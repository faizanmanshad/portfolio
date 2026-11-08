const origins = new Set(["https://faizanmanshad.com", "https://www.faizanmanshad.com"]);
const recipient = "contactfaizanmanshad@gmail.com";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin");
    if (!origins.has(origin)) return new Response(null, { status: 403 });
    const headers = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    const reply = (status, accepted = false) => Response.json({ accepted }, { status, headers });
    if (new URL(request.url).pathname !== "/message") return reply(404);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return reply(405);
    if (!request.headers.get("content-type")?.startsWith("application/json")) return reply(415);
    if (!env.RESEND_API_KEY || !env.MAIL_FROM || !env.CONTACT_LIMIT) return reply(503);
    const limit = await env.CONTACT_LIMIT.limit({ key: request.headers.get("CF-Connecting-IP") || "unknown" });
    if (!limit.success) return reply(429);
    const raw = await request.text();
    if (raw.length > 20000) return reply(413);
    let fields;
    try { fields = JSON.parse(raw); } catch { return reply(400); }
    if (!fields || typeof fields !== "object" || fields._website_verification) return reply(400);
    for (const [key, max] of Object.entries({ name: 100, subject: 160, email: 254, message: 3000 })) {
      if (typeof fields[key] !== "string" || !fields[key].trim() || fields[key].length > max) return reply(400);
    }
    const { name, email, subject, message, requestId } = fields;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(subject) ||
        typeof requestId !== "string" || !/^[a-f0-9-]{36}$/i.test(requestId)) return reply(400);
    try {
      const result = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json", "Idempotency-Key": requestId },
        body: JSON.stringify({ from: env.MAIL_FROM, to: [recipient], reply_to: email, subject, text: name + " <" + email + ">\n\n" + message })
      });
      if (!result.ok || !(await result.json()).id) return reply(502);
      return reply(200, true);
    } catch { return reply(502); }
  }
};
