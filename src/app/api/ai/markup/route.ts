import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for the response
interface MarkedBlock {
  type: 'dialogue' | 'description' | 'action' | 'thought';
  text: string;
  speaker?: string; // For dialogue/thought blocks
}

interface MarkedScene {
  title: string;
  blocks: MarkedBlock[];
}

interface MarkupResponse {
  scenes?: MarkedScene[];  // Multiple scenes if text contains scene breaks
  blocks?: MarkedBlock[];  // Single scene - just blocks
}

const SYSTEM_PROMPT = `Определи тип каждого абзаца. Ответ строго в формате JSON.

Типы:
- "dialogue" — прямая речь (—, «», "")
- "description" — описание места/атмосферы (нет речи)
- "action" — действия персонажей (нет речи)
- "thought" — внутренние мысли

Правила:
1. Анализируй каждый абзац отдельно
2. Верни массив types точно такой же длины как paragraphs
3. Сохраняй порядок

Пример JSON:
{ "paragraphs": ["Лес был тёмным.", "— Идём, — сказал Том.", "Мира кивнула."] }
{ "types": ["description", "dialogue", "action"] }`;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Split text into paragraphs (preserve original text!)
    const rawParagraphs = text.split(/\n+/);
    const paragraphs = rawParagraphs.filter((p) => p.trim().length > 0);
    const normalizedParagraphs = paragraphs.map((p) => p.trim());

    if (paragraphs.length === 0) {
      return NextResponse.json({ blocks: [] });
    }

    const speechVerbs = /(сказал|сказала|ответил|ответила|спросил|спросила|крикнул|крикнула|прошептал|прошептала|пробормотал|пробормотала|произнес|произнесла|воскликнул|воскликнула|буркнул|буркнула|заметил|заметила|добавил|добавила|уточнил|уточнила)/i;
    const thoughtVerbs = /(подумал|подумала|думал|думала|мысленно|про себя|в голове|в мыслях)/i;
    const hasDialogueDash = (p: string) => /^\s*[—-]/.test(p);
    const hasQuotes = (p: string) => /[«»"]/.test(p);

    const isDialogueLine = (p: string) =>
      hasDialogueDash(p) || hasQuotes(p) || speechVerbs.test(p);
    const isThoughtLine = (p: string) => thoughtVerbs.test(p);

    // First pass: heuristic types
    const types: Array<MarkedBlock['type'] | null> = normalizedParagraphs.map((p) => {
      if (isDialogueLine(p)) return 'dialogue';
      if (isThoughtLine(p)) return 'thought';
      return null;
    });

    // Classify unknowns with AI (only for nulls)
    const unknownIndices = types
      .map((t, i) => (t ? -1 : i))
      .filter((i) => i !== -1);

    if (unknownIndices.length > 0) {
      const unknownParagraphs = unknownIndices.map((i) => normalizedParagraphs[i]);
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify({ paragraphs: unknownParagraphs }) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const aiResponse = JSON.parse(content) as { types: string[] };
        const aiTypes = aiResponse.types || [];
        for (let i = 0; i < unknownIndices.length; i++) {
          const idx = unknownIndices[i];
          const type = aiTypes[i] || 'description';
          types[idx] = type as MarkedBlock['type'];
        }
      }
    }

    // Fill any remaining nulls as description
    for (let i = 0; i < types.length; i++) {
      if (!types[i]) types[i] = 'description';
    }

    // Dialogue continuity: short narrator lines between dialogues stay dialogue
    for (let i = 1; i < types.length - 1; i++) {
      if (types[i] !== 'dialogue' && types[i - 1] === 'dialogue' && types[i + 1] === 'dialogue') {
        if (normalizedParagraphs[i].length <= 200) {
          types[i] = 'dialogue';
        }
      }
    }

    // Build blocks by grouping consecutive paragraphs of the same type
    // Use ORIGINAL text, not AI-generated!
    const blocks: MarkedBlock[] = [];
    let currentType: string | null = null;
    let currentTexts: string[] = [];

    for (let i = 0; i < paragraphs.length; i++) {
      const type = types[i] || 'description';
      const para = paragraphs[i];

      if (type === currentType) {
        // Same type - add to current block
        currentTexts.push(para);
      } else {
        // Different type - save previous block and start new
        if (currentType && currentTexts.length > 0) {
          blocks.push({
            type: currentType as MarkedBlock['type'],
            text: currentTexts.join('\n'),
          });
        }
        currentType = type;
        currentTexts = [para];
      }
    }

    // Don't forget the last block
    if (currentType && currentTexts.length > 0) {
      blocks.push({
        type: currentType as MarkedBlock['type'],
        text: currentTexts.join('\n'),
      });
    }

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('[AI Markup Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
