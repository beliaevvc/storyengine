import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, streamText, LanguageModel } from 'ai';

export type AIProvider = 'openai' | 'anthropic';
export type AIModel = 'gpt-4o' | 'gpt-4-turbo' | 'claude-3-5-sonnet-20241022' | 'claude-3-opus-20240229';

export interface ProviderConfig {
  provider: AIProvider;
  model: AIModel;
}

// Default configuration
const DEFAULT_CONFIG: ProviderConfig = {
  provider: 'openai',
  model: 'gpt-4o',
};

// Get the language model based on configuration
export function getModel(config: ProviderConfig = DEFAULT_CONFIG): LanguageModel {
  const { provider, model } = config;

  if (provider === 'openai') {
    return openai(model);
  }

  if (provider === 'anthropic') {
    return anthropic(model);
  }

  throw new Error(`Unknown provider: ${provider}`);
}

// Available models for each provider
export const AVAILABLE_MODELS: Record<AIProvider, { id: AIModel; name: string }[]> = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o (рекомендуется)' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (рекомендуется)' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
  ],
};

// Generate text (non-streaming)
export async function generateAIText(
  prompt: string,
  systemPrompt: string,
  config: ProviderConfig = DEFAULT_CONFIG
): Promise<string> {
  const model = getModel(config);

  const { text } = await generateText({
    model,
    system: systemPrompt,
    prompt,
  });

  return text;
}

// Stream text
export async function streamAIText(
  prompt: string,
  systemPrompt: string,
  config: ProviderConfig = DEFAULT_CONFIG
) {
  const model = getModel(config);

  return streamText({
    model,
    system: systemPrompt,
    prompt,
  });
}

// Predefined system prompts for different use cases
export const SYSTEM_PROMPTS = {
  continueScene: `Ты — талантливый писатель-соавтор. Твоя задача — продолжить сцену, сохраняя:
- Стиль и тон текста
- Характеры персонажей
- Логику событий
- Атмосферу истории

Пиши естественно и выразительно. Не добавляй метакомментарии — только текст истории.`,

  writeDialogue: `Ты — мастер диалогов. Твоя задача — написать диалог между персонажами, учитывая:
- Их характеры и манеру речи
- Отношения между ними
- Контекст сцены
- Эмоциональное состояние

Каждый персонаж должен говорить по-своему. Диалог должен двигать сюжет вперёд.`,

  describeLocation: `Ты — мастер описаний. Твоя задача — описать локацию так, чтобы читатель почувствовал себя там:
- Используй все органы чувств (зрение, слух, запахи, текстуры)
- Передай атмосферу и настроение места
- Добавь детали, которые раскрывают мир
- Сохраняй стиль истории

Избегай клише. Пиши живо и образно.`,

  generateIdeas: `Ты — креативный консультант по сторителлингу. Твоя задача — предложить идеи для развития сюжета:
- Неожиданные повороты
- Конфликты и препятствия
- Развитие персонажей
- Тематические углубления

Предлагай 3-5 конкретных идей с кратким описанием каждой.`,

  analyzeText: `Ты — литературный редактор. Твоя задача — проанализировать текст и дать конструктивную обратную связь:
- Сильные стороны
- Возможные улучшения
- Соответствие характерам персонажей
- Логика сюжета

Будь конкретен и давай actionable советы.`,

  chat: `Ты — помощник писателя. Ты знаешь всё о проекте пользователя: персонажей, локации, события, сюжет.

Отвечай на вопросы о истории, помогай с планированием, предлагай идеи.

Если пользователь спрашивает о персонаже или событии — используй информацию из контекста.
Если информации нет — честно скажи об этом и предложи помочь создать.`,
};
