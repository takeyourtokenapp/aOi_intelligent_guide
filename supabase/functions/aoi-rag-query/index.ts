import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QueryRequest {
  question: string;
  userId?: string;
  userLevel?: string;
  domain: "foundation" | "app";
  language?: "en" | "ru" | "he";
  context?: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      question,
      userId,
      userLevel = "beginner",
      domain,
      language = "en",
      context,
    }: QueryRequest = await req.json();

    if (!question || !domain) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: question, domain" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate embedding for the question
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: question,
        encoding_format: "float",
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`OpenAI embedding error: ${await embeddingResponse.text()}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Classify query type
    const queryType = classifyQuery(question);

    let sources: any[] = [];
    let responseText = "";

    // Search relevant knowledge bases using vector similarity
    if (queryType === "medical" || domain === "foundation") {
      // Search CNS knowledge base
      const { data: cnsResults, error: cnsError } = await supabase.rpc(
        "search_knowledge_cns",
        {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: 5,
        }
      );

      if (!cnsError && cnsResults && cnsResults.length > 0) {
        sources = cnsResults.map((r: any) => ({
          type: "cns_knowledge",
          topic: r.topic,
          similarity: r.similarity,
        }));

        const knowledgeText = cnsResults
          .map((k: any) => `**${k.topic}**\n${k.content}`)
          .join("\n\n---\n\n");

        responseText = generateMedicalResponse(
          question,
          knowledgeText,
          userLevel,
          cnsResults
        );
      } else {
        responseText =
          "I understand you're asking about medical topics. While I can provide general educational information about brain tumors in children, I don't have specific information about your question in my knowledge base yet. Please consult with medical professionals for specific medical advice.";
      }
    } else if (queryType === "web3" || domain === "app") {
      // Search Web3 knowledge base
      const { data: web3Results, error: web3Error } = await supabase.rpc(
        "search_knowledge_web3",
        {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: 5,
        }
      );

      if (!web3Error && web3Results && web3Results.length > 0) {
        sources = web3Results.map((r: any) => ({
          type: "web3_knowledge",
          topic: r.topic,
          similarity: r.similarity,
        }));

        const knowledgeText = web3Results
          .map((k: any) => `**${k.topic}**\n${k.content}`)
          .join("\n\n---\n\n");

        responseText = generateWeb3Response(
          question,
          knowledgeText,
          userLevel,
          web3Results
        );
      } else {
        responseText =
          "I can help you learn about Web3 and blockchain technology. However, I don't have specific information about your question yet. Try asking about: blockchain basics, mining, tokens, security, or wallets.";
      }
    } else if (queryType === "academy") {
      // Search lessons
      const { data: lessonResults, error: lessonError } = await supabase.rpc(
        "search_lessons",
        {
          query_embedding: queryEmbedding,
          language: language,
          match_threshold: 0.7,
          match_count: 3,
        }
      );

      if (!lessonError && lessonResults && lessonResults.length > 0) {
        sources = lessonResults.map((r: any) => ({
          type: "lesson",
          title: r.title,
          slug: r.slug,
          similarity: r.similarity,
        }));

        responseText = generateAcademyResponse(question, lessonResults, language);
      } else {
        responseText =
          "I can guide you through our Academy courses. We offer tracks in Crypto Foundations, Mining Essentials, Web3 Economy, and DeSci Fundamentals. What would you like to learn?";
      }
    } else if (queryType === "progress" && userId) {
      // Get user progress
      const { data: userProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (userProgress) {
        responseText = `📊 **Your Progress**\n\n🎓 Level: ${userProgress.level}\n📈 Progress: ${userProgress.level_progress}%\n✅ Courses Completed: ${userProgress.courses_completed}\n🏆 Certificates: ${userProgress.certificates_earned}\n💝 Foundation Contribution: $${userProgress.foundation_contribution}\n\nKeep up the great work! Every step brings you closer to mastering the ecosystem.`;
      } else {
        responseText =
          "I don't have progress information for you yet. Start by completing your first lesson to begin tracking your journey!";
      }
    } else {
      responseText = generateGeneralResponse(question, domain, language);
    }

    // Log interaction (optional - only if userId provided)
    if (userId) {
      await supabase.from("access_logs").insert({
        user_id: userId,
        resource: "aoi_assistant",
        action: "query",
        allowed: true,
        timestamp: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({
        response: responseText,
        queryType,
        sources,
        language,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in aoi-rag-query:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while processing your question",
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

function classifyQuery(question: string): string {
  const lowerQ = question.toLowerCase();

  if (
    lowerQ.includes("progress") ||
    lowerQ.includes("achievement") ||
    lowerQ.includes("level") ||
    lowerQ.includes("my course")
  ) {
    return "progress";
  }

  if (
    lowerQ.includes("lesson") ||
    lowerQ.includes("course") ||
    lowerQ.includes("academy") ||
    lowerQ.includes("learn") ||
    lowerQ.includes("track")
  ) {
    return "academy";
  }

  if (
    lowerQ.includes("brain") ||
    lowerQ.includes("tumor") ||
    lowerQ.includes("cancer") ||
    lowerQ.includes("treatment") ||
    lowerQ.includes("research") ||
    lowerQ.includes("medical") ||
    lowerQ.includes("medulloblastoma") ||
    lowerQ.includes("cns")
  ) {
    return "medical";
  }

  if (
    lowerQ.includes("blockchain") ||
    lowerQ.includes("crypto") ||
    lowerQ.includes("mining") ||
    lowerQ.includes("token") ||
    lowerQ.includes("wallet") ||
    lowerQ.includes("web3") ||
    lowerQ.includes("defi") ||
    lowerQ.includes("nft") ||
    lowerQ.includes("dao")
  ) {
    return "web3";
  }

  return "general";
}

function generateMedicalResponse(
  question: string,
  knowledge: string,
  userLevel: string,
  results: any[]
): string {
  const topResult = results[0];
  const relevanceNote =
    topResult.similarity > 0.85
      ? "This answer closely matches your question."
      : "This information may be related to your question.";

  return `${relevanceNote}\n\n${knowledge}\n\n⚠️ **Important**: This is educational information only. Always consult with qualified medical professionals for diagnosis, treatment, or medical advice.\n\n💡 Would you like to learn more about how Web3 technology can support medical research?`;
}

function generateWeb3Response(
  question: string,
  knowledge: string,
  userLevel: string,
  results: any[]
): string {
  const topResult = results[0];
  const relevanceNote =
    topResult.similarity > 0.85
      ? "Here's what I found:"
      : "This might help:";

  return `${relevanceNote}\n\n${knowledge}\n\n💡 **Next Step**: This information is part of our Academy curriculum. Complete related courses to earn certificates and progress to the next level!\n\nNeed more specific guidance? Let me know!`;
}

function generateAcademyResponse(
  question: string,
  results: any[],
  language: string
): string {
  const lessons = results
    .map(
      (lesson: any, i: number) =>
        `${i + 1}. **${lesson.title}** (${Math.round(lesson.similarity * 100)}% match)\n   Lesson: /academy/lessons/${lesson.slug}`
    )
    .join("\n\n");

  return `I found these relevant lessons for you:\n\n${lessons}\n\n🎓 Click on a lesson to start learning! Each completed lesson brings you closer to your certification.`;
}

function generateGeneralResponse(
  question: string,
  domain: string,
  language: string
): string {
  if (domain === "foundation") {
    return `Hello! I'm aOi (葵), your guide for understanding how technology enables medical research.\n\nI can help you:\n• Learn about brain tumors in children (educational)\n• Understand how Web3 supports research funding\n• Navigate between our knowledge hub and tools\n• Track your learning progress\n\nWhat would you like to explore?`;
  } else {
    return `Hello! I'm aOi (葵), your Web3 learning assistant.\n\nI can help you:\n• Learn blockchain and crypto fundamentals\n• Guide you through our Academy courses\n• Explain mining and token economics\n• Show your progress and achievements\n\nWhat would you like to learn today?`;
  }
}
