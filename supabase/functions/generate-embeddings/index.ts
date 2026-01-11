import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmbeddingRequest {
  text: string;
  table: "knowledge_base_cns" | "knowledge_base_web3" | "lessons";
  id: string;
  language?: "en" | "ru";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { text, table, id, language = "en" }: EmbeddingRequest = await req.json();

    if (!text || !table || !id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: text, table, id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const openaiData = await openaiResponse.json();
    const embedding = openaiData.data[0].embedding;

    let updateResult;
    if (table === "lessons") {
      const columnName = language === "ru" ? "embedding_ru" : "embedding_en";
      updateResult = await supabase
        .from(table)
        .update({ [columnName]: embedding })
        .eq("id", id);
    } else {
      updateResult = await supabase
        .from(table)
        .update({ embedding })
        .eq("id", id);
    }

    if (updateResult.error) {
      throw new Error(`Database update error: ${updateResult.error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Embedding generated and stored successfully",
        id,
        table,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating embedding:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while generating embedding"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});