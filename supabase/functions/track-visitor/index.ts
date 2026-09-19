import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// In-memory rate limiting to prevent analytics flooding (max 60 events/minute per IP)
const visitorRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isTrackRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = visitorRateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    visitorRateLimitMap.set(ip, { count: 1, resetTime: now + 60_000 });
    return false;
  }
  if (entry.count >= 60) {
    return true;
  }
  entry.count++;
  return false;
}

function getClientIP(req: Request): string {
  const headers = req.headers;

  // Prioritize Cloudflare / proxy-injected trusted headers before client-controlled ones
  const cfConnecting = headers.get("cf-connecting-ip");
  if (cfConnecting) return cfConnecting.trim();

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim()).filter(Boolean);
    if (ips.length > 0) return ips[ips.length - 1]; // Take closest trusted upstream IP
  }

  const trueClient = headers.get("true-client-ip");
  if (trueClient) return trueClient.trim();

  return "0.0.0.0";
}

function extractCountry(req: Request, ip: string): string {
  // Cloudflare/Supabase may provide country via headers
  const cfCountry = req.headers.get("cf-ipcountry");
  if (cfCountry) return cfCountry;

  const xCountry = req.headers.get("x-vercel-ip-country");
  if (xCountry) return xCountry;

  return "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const ip = getClientIP(req);
  if (isTrackRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Tracking rate limit exceeded" }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { sessionToken, pagePath, pageTitle, serviceUsed } = body;

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: "sessionToken is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const ip = getClientIP(req);
    const country = extractCountry(req, ip);
    const userAgent = req.headers.get("user-agent") ?? "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert visitor session
    const { data: existingSession } = await supabase
      .from("visitor_sessions")
      .select("id, page_views")
      .eq("session_token", sessionToken)
      .maybeSingle();

    if (existingSession) {
      // Update existing session
      await supabase
        .from("visitor_sessions")
        .update({
          ip_address: ip,
          country: country || undefined,
          user_agent: userAgent,
          page_views: (existingSession.page_views ?? 0) + 1,
          last_seen: new Date().toISOString(),
        })
        .eq("id", existingSession.id);
    } else {
      // Create new session
      await supabase.from("visitor_sessions").insert({
        session_token: sessionToken,
        ip_address: ip,
        country,
        user_agent: userAgent,
        page_views: 1,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      });
    }

    // Insert page view record
    await supabase.from("page_views").insert({
      session_token: sessionToken,
      page_path: pagePath ?? "/",
      page_title: pageTitle ?? "",
      service_used: serviceUsed ?? "",
    });

    return new Response(
      JSON.stringify({ success: true, ip }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
