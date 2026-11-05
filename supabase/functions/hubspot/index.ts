// Success Plan Builder: the HubSpot helper (a Supabase Edge Function).
//
// READ-ONLY. It can do exactly five things with HubSpot, and nothing else:
//   searchCompanies, getCompany, companyDeals, searchContacts, getOwner
// plus one setup-only read (listFields, to pick which money fields to show),
// plus one Slack post (slack). It never creates, changes or deletes anything in HubSpot.
//
// Safety:
// - The HubSpot key is read from the Supabase secret HUBSPOT_SECRET_KEY. It is never
//   sent back, printed, logged or put in an error message.
// - Every request must come from someone signed in with a @factorlab.com Google account.
// - Only requests from the live tool's web address are answered.
// - It stores nothing, and it never logs customer data (only an action name and a status).

const ALLOWED_ORIGINS = ["https://treyfact.github.io"];
const HUBSPOT = "https://api.hubapi.com";
const DOMAIN = "@factorlab.com";

// Which company and deal fields come back. MONEY_* stay empty until Trey picks them (step 3).
const COMPANY_FIELDS = ["name", "domain", "city", "state", "hubspot_owner_id"];
const MONEY_COMPANY_FIELDS: string[] = [];
const DEAL_FIELDS = ["dealname", "dealstage", "closedate", "pipeline"];
const MONEY_DEAL_FIELDS: string[] = [];
const CONTACT_FIELDS = ["firstname", "lastname", "email", "jobtitle"];

function cors(origin: string | null) {
  const ok = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}
function reply(origin: string | null, status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(origin), "Content-Type": "application/json" } });
}

// Is this a signed-in FactorLab person? Asks Supabase who the sign-in token belongs to.
async function signedInEmail(req: Request): Promise<string | null> {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const r = await fetch(Deno.env.get("SUPABASE_URL") + "/auth/v1/user", {
    headers: { Authorization: "Bearer " + token, apikey: Deno.env.get("SUPABASE_ANON_KEY") || "" },
  });
  if (!r.ok) return null;
  const u = await r.json();
  const email = String(u?.email || "").toLowerCase();
  return email.endsWith(DOMAIN) && u?.email_confirmed_at ? email : null;
}

// One read from HubSpot. GET for reads; POST only for HubSpot's search endpoints, which read.
async function hs(path: string, search?: unknown) {
  const key = Deno.env.get("HUBSPOT_SECRET_KEY");
  if (!key) throw new Error("not set up");
  const r = await fetch(HUBSPOT + path, {
    method: search ? "POST" : "GET",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: search ? JSON.stringify(search) : undefined,
  });
  if (!r.ok) throw new Error("hubspot " + r.status);   // the status number only, never HubSpot's reply text
  return r.json();
}
const digits = (v: unknown) => /^\d{1,20}$/.test(String(v || "")) ? String(v) : null;
const words = (v: unknown, max = 80) => String(v || "").trim().slice(0, max);
const pick = (o: Record<string, unknown>, keys: string[]) => Object.fromEntries(keys.map(k => [k, o?.[k] ?? ""]));

const ACTIONS: Record<string, (b: Record<string, unknown>) => Promise<unknown>> = {
  // 1. Search companies by name, for the Account name dropdown.
  async searchCompanies(b) {
    const q = words(b.q); if (q.length < 2) return { results: [] };
    const r = await hs("/crm/v3/objects/companies/search", { query: q, limit: 8, properties: ["name", "domain", "city", "state"] });
    return { results: (r.results || []).map((c: any) => ({ id: c.id, ...pick(c.properties, ["name", "domain", "city", "state"]) })) };
  },
  // 2. Read one company, by its exact HubSpot ID.
  async getCompany(b) {
    const id = digits(b.id); if (!id) throw new Error("bad id");
    const props = COMPANY_FIELDS.concat(MONEY_COMPANY_FIELDS);
    const c = await hs(`/crm/v3/objects/companies/${id}?properties=${props.join(",")}`);
    return { id: c.id, ...pick(c.properties, props) };
  },
  // 3. Read that company's deals.
  async companyDeals(b) {
    const id = digits(b.id); if (!id) throw new Error("bad id");
    const props = DEAL_FIELDS.concat(MONEY_DEAL_FIELDS);
    const r = await hs("/crm/v3/objects/deals/search", {
      filterGroups: [{ filters: [{ propertyName: "associations.company", operator: "EQ", value: id }] }],
      properties: props, limit: 20,
    });
    return { results: (r.results || []).map((d: any) => ({ id: d.id, ...pick(d.properties, props) })) };
  },
  // 4. Search that company's contacts only, for the Who I'm working with dropdown.
  async searchContacts(b) {
    const id = digits(b.companyId); if (!id) throw new Error("bad id");
    const q = words(b.q);
    const r = await hs("/crm/v3/objects/contacts/search", {
      ...(q ? { query: q } : {}),
      filterGroups: [{ filters: [{ propertyName: "associations.company", operator: "EQ", value: id }] }],
      properties: CONTACT_FIELDS, limit: 10,
    });
    return { results: (r.results || []).map((c: any) => ({ id: c.id, ...pick(c.properties, CONTACT_FIELDS) })) };
  },
  // 5. Read an owner's name (the company's HubSpot owner).
  async getOwner(b) {
    const id = digits(b.id); if (!id) throw new Error("bad id");
    const o = await hs(`/crm/v3/owners/${id}`);
    return { id: o.id, name: [o.firstName, o.lastName].filter(Boolean).join(" ") };
  },
  // Setup only (step 3): the names of company and deal fields, so Trey can pick the money ones.
  async listFields(b) {
    const obj = b.object === "deals" ? "deals" : "companies";
    const r = await hs(`/crm/v3/properties/${obj}`);
    return { results: (r.results || []).map((p: any) => ({ name: p.name, label: p.label, type: p.type })) };
  },
  // Slack: account name, who built it and the HubSpot link. Never money. Skipped until the webhook secret exists.
  async slack(b) {
    const hook = Deno.env.get("SLACK_WEBHOOK_URL"); if (!hook) return { skipped: true };
    const id = digits(b.companyId);
    const link = id ? `https://app-na2.hubspot.com/contacts/246468046/record/0-2/${id}` : "";
    const text = `New success plan: *${words(b.account, 120)}*, built by ${words(b.by, 80)}${link ? `\n${link}` : ""}`;
    const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    return { posted: r.ok };
  },
};

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST" || !origin || !ALLOWED_ORIGINS.includes(origin)) return reply(origin, 403, { error: "Not allowed" });
  const email = await signedInEmail(req);
  if (!email) return reply(origin, 401, { error: "Sign in with your FactorLab Google account" });
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 2000) return reply(origin, 413, { error: "Too long" });
    body = JSON.parse(text);
  } catch { return reply(origin, 400, { error: "Bad request" }); }
  const action = ACTIONS[String(body.action)];
  if (!action) return reply(origin, 400, { error: "Not allowed" });
  try {
    return reply(origin, 200, await action(body));
  } catch (e) {
    const m = String((e as Error).message || "");
    console.log(String(body.action), m.startsWith("hubspot ") ? m : "failed");   // action and status only
    return reply(origin, 502, { error: m === "not set up" ? "HubSpot isn't set up yet" : m.startsWith("hubspot 403") ? "HubSpot said no (missing permission)" : "HubSpot didn't answer. Type it in by hand." });
  }
});
