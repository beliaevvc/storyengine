import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchContext, buildContextPrompt, getProjectEntities } from '@/lib/ai/rag';
import { streamAIText, SYSTEM_PROMPTS, type ProviderConfig } from '@/lib/ai/providers';

export const runtime = 'nodejs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
      messages,
      provider = 'openai',
      model = 'gpt-4o',
    } = body;

    if (!projectId || !messages || messages.length === 0) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Get the last user message for context search
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      return new Response('Last message must be from user', { status: 400 });
    }

    // Get relevant context
    const context = await searchContext({
      projectId,
      query: lastMessage.content,
      maxEntities: 5,
      maxDocuments: 2,
    });

    // Get all entities for broader context
    const allEntities = await getProjectEntities(projectId);

    // Build context string
    const contextPrompt = buildContextPrompt(context);

    // Build entity list
    const entityList = allEntities
      .slice(0, 20)
      .map((e) => `- ${e.name} (${e.type})`)
      .join('\n');

    // Build system prompt
    const systemPrompt = `${SYSTEM_PROMPTS.chat}

## Все сущности проекта:
${entityList || 'Сущности ещё не созданы.'}

${contextPrompt ? `\n## Релевантный контекст:\n${contextPrompt}` : ''}`;

    // Build conversation prompt
    const conversationHistory = messages
      .slice(-10) // Last 10 messages for context
      .map((m: Message) => `${m.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${m.content}`)
      .join('\n\n');

    const fullPrompt = conversationHistory;

    // Stream the response
    const config: ProviderConfig = { provider, model };
    const result = await streamAIText(fullPrompt, systemPrompt, config);

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
