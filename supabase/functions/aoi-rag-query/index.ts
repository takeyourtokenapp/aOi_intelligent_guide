import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface QueryRequest {
  question: string;
  userId: string;
  userLevel: string;
  domain: 'foundation' | 'app';
  context?: any;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { question, userId, userLevel, domain, context }: QueryRequest = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const queryType = await classifyQuery(question);

    let responseText = '';

    if (queryType === 'medical' || domain === 'foundation') {
      const { data: cnsKnowledge } = await supabase
        .from('knowledge_base_cns')
        .select('topic, content, source_citation')
        .or(`topic.ilike.%${question}%,content.ilike.%${question}%`)
        .eq('age_appropriate', true)
        .limit(3);

      if (cnsKnowledge && cnsKnowledge.length > 0) {
        const knowledgeText = cnsKnowledge
          .map((k: any) => `Topic: ${k.topic}\n${k.content}\nSource: ${k.source_citation || 'Internal'}\n`)
          .join('\n---\n');

        responseText = generateMedicalResponse(question, knowledgeText, userLevel);
      } else {
        responseText = 'I understand you\'re asking about medical topics. While I can provide general educational information about brain tumors in children, I don\'t have specific information about your question in my knowledge base yet. Please consult with medical professionals for specific medical advice.';
      }
    } else if (queryType === 'web3' || domain === 'app') {
      const { data: web3Knowledge } = await supabase
        .from('knowledge_base_web3')
        .select('topic, content, practical_example')
        .or(`topic.ilike.%${question}%,content.ilike.%${question}%`)
        .limit(3);

      if (web3Knowledge && web3Knowledge.length > 0) {
        const knowledgeText = web3Knowledge
          .map((k: any) => `Topic: ${k.topic}\n${k.content}${k.practical_example ? '\n\nExample:\n' + k.practical_example : ''}`)
          .join('\n---\n');

        responseText = generateWeb3Response(question, knowledgeText, userLevel);
      } else {
        responseText = 'I can help you learn about Web3 and blockchain technology. However, I don\'t have specific information about your question yet. Try asking about: blockchain basics, mining, tokens, security, or wallets.';
      }
    } else if (queryType === 'progress') {
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('*, profiles!inner(*)')
        .eq('user_id', userId)
        .single();

      if (userProgress) {
        responseText = `📊 Your Progress:\n\n🎓 Level: ${userProgress.level}\n📈 Progress: ${userProgress.level_progress}%\n✅ Courses Completed: ${userProgress.courses_completed}\n🏆 Certificates: ${userProgress.certificates_earned}\n💝 Foundation Contribution: $${userProgress.foundation_contribution}\n\nKeep up the great work! Every step brings you closer to mastering the ecosystem.`;
      }
    } else {
      responseText = generateGeneralResponse(question, domain);
    }

    await supabase.from('aoi_interactions').insert({
      user_id: userId,
      interaction_type: queryType as any,
      question,
      response: responseText,
      platform: domain,
      created_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        response: responseText,
        queryType,
        sources: 'knowledge_base'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );

  } catch (error) {
    console.error('Error in aoi-rag-query:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});

function classifyQuery(question: string): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('progress') || lowerQ.includes('achievement') || lowerQ.includes('level')) {
    return 'progress';
  }
  
  if (lowerQ.includes('brain') || lowerQ.includes('tumor') || lowerQ.includes('cancer') || 
      lowerQ.includes('treatment') || lowerQ.includes('research') || lowerQ.includes('medical')) {
    return 'medical';
  }
  
  if (lowerQ.includes('blockchain') || lowerQ.includes('crypto') || lowerQ.includes('mining') || 
      lowerQ.includes('token') || lowerQ.includes('wallet') || lowerQ.includes('web3')) {
    return 'web3';
  }
  
  return 'general';
}

function generateMedicalResponse(question: string, knowledge: string, userLevel: string): string {
  return `Based on educational medical research:\n\n${knowledge}\n\n⚠️ Important: This is educational information only. Always consult with qualified medical professionals for diagnosis, treatment, or medical advice.\n\nWould you like to learn more about how Web3 technology can support medical research?`;
}

function generateWeb3Response(question: string, knowledge: string, userLevel: string): string {
  return `${knowledge}\n\n💡 This information is part of our Academy curriculum. Complete related courses to earn certificates and progress to the next level!\n\nNeed more specific guidance? Let me know!`;
}

function generateGeneralResponse(question: string, domain: string): string {
  if (domain === 'foundation') {
    return `Hello! I'm aOi (葵), your guide for understanding how technology enables medical research.\n\nI can help you:\n• Learn about brain tumors in children (educational)\n• Understand how Web3 supports research funding\n• Navigate between our knowledge hub and tools\n• Track your learning progress\n\nWhat would you like to explore?`;
  } else {
    return `Hello! I'm aOi (葵), your Web3 learning assistant.\n\nI can help you:\n• Learn blockchain and crypto fundamentals\n• Guide you through our Academy courses\n• Explain mining and token economics\n• Show your progress and achievements\n\nWhat would you like to learn today?`;
  }
}
