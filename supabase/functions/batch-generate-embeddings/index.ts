import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BatchResult {
  total: number;
  processed: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
      cns: { total: 0, processed: 0, failed: 0, errors: [] as Array<{ id: string; error: string }> },
      web3: { total: 0, processed: 0, failed: 0, errors: [] as Array<{ id: string; error: string }> },
      lessons: { total: 0, processed: 0, failed: 0, errors: [] as Array<{ id: string; error: string }> },
    };

    // Generate embeddings for CNS knowledge base
    console.log("Fetching CNS articles without embeddings...");
    const { data: cnsArticles, error: cnsError } = await supabase
      .from("knowledge_base_cns")
      .select("id, topic, content, summary, tags")
      .is("embedding", null);

    if (cnsError) throw cnsError;

    results.cns.total = cnsArticles?.length || 0;
    console.log(`Found ${results.cns.total} CNS articles to process`);

    if (cnsArticles) {
      for (const article of cnsArticles) {
        try {
          const text = `${article.topic}\n\n${article.content}\n\nSummary: ${article.summary || ""}\n\nTags: ${article.tags?.join(", ") || ""}`;

          const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
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

          if (!embeddingResponse.ok) {
            const errorText = await embeddingResponse.text();
            throw new Error(`OpenAI API error: ${embeddingResponse.statusText} - ${errorText}`);
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0].embedding;

          const { error: updateError } = await supabase
            .from("knowledge_base_cns")
            .update({ embedding })
            .eq("id", article.id);

          if (updateError) throw updateError;

          results.cns.processed++;
          console.log(`Processed CNS article: ${article.topic}`);
        } catch (error) {
          results.cns.failed++;
          results.cns.errors.push({
            id: article.id,
            error: error instanceof Error ? error.message : String(error),
          });
          console.error(`Failed to process CNS article ${article.id}:`, error);
        }
      }
    }

    // Generate embeddings for Web3 knowledge base
    console.log("Fetching Web3 articles without embeddings...");
    const { data: web3Articles, error: web3Error } = await supabase
      .from("knowledge_base_web3")
      .select("id, topic, content, tags, practical_example")
      .is("embedding", null);

    if (web3Error) throw web3Error;

    results.web3.total = web3Articles?.length || 0;
    console.log(`Found ${results.web3.total} Web3 articles to process`);

    if (web3Articles) {
      for (const article of web3Articles) {
        try {
          const text = `${article.topic}\n\n${article.content}\n\nPractical Example: ${article.practical_example || ""}\n\nTags: ${article.tags?.join(", ") || ""}`;

          const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
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

          if (!embeddingResponse.ok) {
            const errorText = await embeddingResponse.text();
            throw new Error(`OpenAI API error: ${embeddingResponse.statusText} - ${errorText}`);
          }

          const embeddingData = await embeddingResponse.json();
          const embedding = embeddingData.data[0].embedding;

          const { error: updateError } = await supabase
            .from("knowledge_base_web3")
            .update({ embedding })
            .eq("id", article.id);

          if (updateError) throw updateError;

          results.web3.processed++;
          console.log(`Processed Web3 article: ${article.topic}`);
        } catch (error) {
          results.web3.failed++;
          results.web3.errors.push({
            id: article.id,
            error: error instanceof Error ? error.message : String(error),
          });
          console.error(`Failed to process Web3 article ${article.id}:`, error);
        }
      }
    }

    // Generate embeddings for lessons
    console.log("Fetching lessons without embeddings...");
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id, title_en, title_ru, content_en, content_ru, embedding_en, embedding_ru")
      .or("embedding_en.is.null,embedding_ru.is.null");

    if (lessonsError) throw lessonsError;

    results.lessons.total = lessons?.length || 0;
    console.log(`Found ${results.lessons.total} lessons to process`);

    if (lessons) {
      for (const lesson of lessons) {
        try {
          // Generate English embedding if missing
          if (!lesson.embedding_en && lesson.content_en) {
            const textEn = `${lesson.title_en}\n\n${lesson.content_en}`;

            const embeddingResponseEn = await fetch("https://api.openai.com/v1/embeddings", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${openaiApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "text-embedding-3-small",
                input: textEn,
                encoding_format: "float",
              }),
            });

            if (!embeddingResponseEn.ok) {
              const errorText = await embeddingResponseEn.text();
              throw new Error(`OpenAI API error (EN): ${embeddingResponseEn.statusText} - ${errorText}`);
            }

            const embeddingDataEn = await embeddingResponseEn.json();
            const embeddingEn = embeddingDataEn.data[0].embedding;

            const { error: updateError } = await supabase
              .from("lessons")
              .update({ embedding_en: embeddingEn })
              .eq("id", lesson.id);

            if (updateError) throw updateError;
          }

          // Generate Russian embedding if missing
          if (!lesson.embedding_ru && lesson.content_ru) {
            const textRu = `${lesson.title_ru}\n\n${lesson.content_ru}`;

            const embeddingResponseRu = await fetch("https://api.openai.com/v1/embeddings", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${openaiApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "text-embedding-3-small",
                input: textRu,
                encoding_format: "float",
              }),
            });

            if (!embeddingResponseRu.ok) {
              const errorText = await embeddingResponseRu.text();
              throw new Error(`OpenAI API error (RU): ${embeddingResponseRu.statusText} - ${errorText}`);
            }

            const embeddingDataRu = await embeddingResponseRu.json();
            const embeddingRu = embeddingDataRu.data[0].embedding;

            const { error: updateError } = await supabase
              .from("lessons")
              .update({ embedding_ru: embeddingRu })
              .eq("id", lesson.id);

            if (updateError) throw updateError;
          }

          results.lessons.processed++;
          console.log(`Processed lesson: ${lesson.title_en}`);
        } catch (error) {
          results.lessons.failed++;
          results.lessons.errors.push({
            id: lesson.id,
            error: error instanceof Error ? error.message : String(error),
          });
          console.error(`Failed to process lesson ${lesson.id}:`, error);
        }
      }
    }

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        cns: {
          total: results.cns.total,
          processed: results.cns.processed,
          failed: results.cns.failed,
          successRate: results.cns.total > 0 ? `${((results.cns.processed / results.cns.total) * 100).toFixed(1)}%` : "N/A",
        },
        web3: {
          total: results.web3.total,
          processed: results.web3.processed,
          failed: results.web3.failed,
          successRate: results.web3.total > 0 ? `${((results.web3.processed / results.web3.total) * 100).toFixed(1)}%` : "N/A",
        },
        lessons: {
          total: results.lessons.total,
          processed: results.lessons.processed,
          failed: results.lessons.failed,
          successRate: results.lessons.total > 0 ? `${((results.lessons.processed / results.lessons.total) * 100).toFixed(1)}%` : "N/A",
        },
      },
      totalProcessed: results.cns.processed + results.web3.processed + results.lessons.processed,
      totalFailed: results.cns.failed + results.web3.failed + results.lessons.failed,
      errors: [
        ...results.cns.errors,
        ...results.web3.errors,
        ...results.lessons.errors,
      ],
    };

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Batch embedding generation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});