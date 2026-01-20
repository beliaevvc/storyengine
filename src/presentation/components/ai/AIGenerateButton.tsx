'use client';

import { useState } from 'react';
import { useCompletion } from '@ai-sdk/react';
import {
  Sparkles,
  Loader2,
  ChevronDown,
  MessageSquare,
  MapPin,
  Lightbulb,
  Wand2,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

type GenerationType = 'continueScene' | 'writeDialogue' | 'describeLocation' | 'generateIdeas';

const GENERATION_OPTIONS: {
  type: GenerationType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}[] = [
  {
    type: 'continueScene',
    label: 'Продолжить сцену',
    icon: Wand2,
    placeholder: 'Что должно произойти дальше?',
  },
  {
    type: 'writeDialogue',
    label: 'Написать диалог',
    icon: MessageSquare,
    placeholder: 'Между какими персонажами? О чём?',
  },
  {
    type: 'describeLocation',
    label: 'Описать локацию',
    icon: MapPin,
    placeholder: 'Какую локацию описать?',
  },
  {
    type: 'generateIdeas',
    label: 'Идеи для сюжета',
    icon: Lightbulb,
    placeholder: 'В каком направлении развить сюжет?',
  },
];

interface AIGenerateButtonProps {
  projectId: string;
  currentText?: string;
  onGenerate: (text: string) => void;
}

export function AIGenerateButton({
  projectId,
  currentText,
  onGenerate,
}: AIGenerateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<GenerationType>('continueScene');
  const [customPrompt, setCustomPrompt] = useState('');

  const { complete, isLoading, completion } = useCompletion({
    api: '/api/ai/generate',
    body: {
      projectId,
      type: selectedType,
      currentText,
    },
    onFinish: (_, completion) => {
      if (completion) {
        onGenerate(completion);
        setIsOpen(false);
        setCustomPrompt('');
      }
    },
  });

  const handleGenerate = () => {
    const option = GENERATION_OPTIONS.find((o) => o.type === selectedType);
    const prompt = customPrompt || option?.placeholder || 'Продолжи';
    complete(prompt);
  };

  const selectedOption = GENERATION_OPTIONS.find((o) => o.type === selectedType);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="bg-gradient-to-r from-[#539bf5] to-[#986ee2] hover:opacity-90 text-white"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Sparkles className="w-4 h-4 mr-2" />
        )}
        AI
        <ChevronDown className="w-4 h-4 ml-1" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#22272e] border border-[#444c56] rounded-lg shadow-xl z-20 p-4">
            <h3 className="text-sm font-medium text-[#adbac7] mb-3">
              Генерация с AI
            </h3>

            {/* Type Selection */}
            <div className="space-y-1 mb-4">
              {GENERATION_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      selectedType === option.type
                        ? 'bg-[#539bf5]/10 text-[#539bf5]'
                        : 'text-[#adbac7] hover:bg-[#2d333b]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Prompt */}
            <div className="mb-4">
              <label className="block text-xs text-[#768390] mb-1">
                Уточнение (опционально)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={selectedOption?.placeholder}
                rows={2}
                className="w-full px-3 py-2 bg-[#2d333b] border border-[#444c56] rounded-md text-sm text-[#adbac7] placeholder:text-[#545d68] focus:outline-none focus:ring-2 focus:ring-[#539bf5] resize-none"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full bg-[#347d39] hover:bg-[#46954a] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Генерация...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Сгенерировать
                </>
              )}
            </Button>

            {/* Preview */}
            {completion && (
              <div className="mt-4 p-3 bg-[#2d333b] rounded-md max-h-40 overflow-y-auto">
                <p className="text-xs text-[#768390] mb-1">Предпросмотр:</p>
                <p className="text-sm text-[#adbac7] whitespace-pre-wrap">
                  {completion}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
