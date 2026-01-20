import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchContext, buildContextPrompt } from '@/lib/ai/rag';
import { streamAIText, SYSTEM_PROMPTS, type ProviderConfig } from '@/lib/ai/providers';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const {
      projectId,
      prompt,
      type = 'continueScene',
      currentText,
      provider = 'openai',
      model = 'gpt-4o',
    } = body;

    if (!projectId || !prompt) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Get system prompt based on type
    const systemPromptBase = SYSTEM_PROMPTS[type as keyof typeof SYSTEM_PROMPTS] 
      || SYSTEM_PROMPTS.continueScene;

    // Get relevant context from project
    const context = await searchContext({
      projectId,
      query: prompt,
      maxEntities: 5,
      maxDocuments: 3,
    });

    // Build full system prompt with context
    const contextPrompt = buildContextPrompt(context);
    const systemPrompt = `${systemPromptBase}

${contextPrompt ? `\n## Контекст из проекта:\n${contextPrompt}` : ''}`;

    // Build user prompt
    let fullPrompt = prompt;
    if (currentText) {
      fullPrompt = `Текущий текст:\n\n${currentText}\n\n---\n\nЗапрос: ${prompt}`;
    }

    // Stream the response
    const config: ProviderConfig = { provider, model };
    const result = await streamAIText(fullPrompt, systemPrompt, config);

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
