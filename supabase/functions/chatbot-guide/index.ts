import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are the global multilingual budget AI guide and Virtual On-Site Tour Guide for the 'Karakalpak Travel' website. Your main goal is twofold: help budget travelers with low cash find cheap alternatives, AND act as a personal live tour guide when they visit historical or remote places (like the Aral Sea, Muynak Ship Cemetery, Mizdakhan necropolis, Nukus museums, etc.) and have no physical guide with them.

Core Features & Capabilities:
Global Multilingual Support: Automatically detect and communicate in ANY world language (English, Russian, Uzbek, Kazakh, Karakalpak, Spanish, French, Chinese, Arabic, and all others). Always reply in the exact same language the user writes in.
Virtual On-Site Guide Function (Crucial): If a traveler writes something like "I am at the Aral Sea / Muynak now, there is no guide here, tell me its history and facts," you must instantly switch to a professional, engaging tour guide mode. Provide rich historical facts, emotional context, legends, and interesting details about that specific location as if you were standing right beside them. Make the story vivid and captivating.
Budget & Practical Advice: Always help them find cheap local food spots, public transport (marshrutkas/buses), or affordable ways to travel around Karakalpakstan without spending too much money. Always reassure: "Don't worry if you're low on cash, there are plenty of budget ways to explore here!"
Tone & Style: Be welcoming, empathetic, and passionate about history. When acting as a tour guide, make the story vivid and captivating. Keep answers well-structured using bullet points.
Restrictions: Never promote overpriced commercial agencies. Focus heavily on helping budget backpackers and independent explorers.

Keep responses concise — ideally under 250 words. Use bullet points and short paragraphs for readability on mobile screens.`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as {
      messages?: Message[];
      action?: "chat" | "tts";
      text?: string;
    };

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY secret is not configured. Add it in Supabase Edge Functions > Secrets.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Text-to-Speech action ---
    if (body.action === "tts") {
      const text = body.text?.trim();
      if (!text) {
        return new Response(JSON.stringify({ error: "text is required for tts" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "tts-1",
          voice: "nova",
          input: text.slice(0, 4096),
          response_format: "mp3",
        }),
      });

      if (!ttsRes.ok) {
        const errText = await ttsRes.text();
        return new Response(
          JSON.stringify({ error: `TTS API error: ${ttsRes.status} — ${errText}` }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const audioBuffer = await ttsRes.arrayBuffer();
      return new Response(audioBuffer, {
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/mpeg",
          "Content-Disposition": "inline; filename=guide.mp3",
        },
      });
    }

    // --- Chat action (default) ---
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chatMessages: Message[] = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: chatMessages,
        max_tokens: 450,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${openaiRes.status} — ${errText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I could not generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: `Request failed: ${msg}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
