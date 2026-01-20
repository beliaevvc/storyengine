'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Loader2, Bot, User, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import type { AIProvider, AIModel } from '@/lib/ai/providers';

interface AIChatProps {
  projectId: string;
}

export function AIChat({ projectId }: AIChatProps) {
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [model, setModel] = useState<AIModel>('gpt-4o');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: '/api/ai/chat',
    body: {
      projectId,
      provider,
      model,
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#444c56]">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#539bf5]" />
          <span className="font-medium text-[#adbac7]">AI Помощник</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className={showSettings ? 'text-[#539bf5]' : ''}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="flex-shrink-0 p-3 border-b border-[#444c56] bg-[#2d333b] space-y-2">
          <div>
            <label className="block text-xs text-[#768390] mb-1">
              Провайдер
            </label>
            <select
              value={provider}
              onChange={(e) => {
                const newProvider = e.target.value as AIProvider;
                setProvider(newProvider);
                // Reset model to default for new provider
                setModel(newProvider === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-20241022');
              }}
              className="w-full px-2 py-1.5 bg-[#22272e] border border-[#444c56] rounded text-sm text-[#adbac7]"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#768390] mb-1">
              Модель
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as AIModel)}
              className="w-full px-2 py-1.5 bg-[#22272e] border border-[#444c56] rounded text-sm text-[#adbac7]"
            >
              {provider === 'openai' ? (
                <>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </>
              ) : (
                <>
                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                </>
              )}
            </select>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-[#444c56] mx-auto mb-3" />
            <p className="text-[#768390] mb-2">Привет! Я знаю всё о твоём проекте.</p>
            <p className="text-sm text-[#545d68]">
              Спроси меня о персонажах, локациях, сюжете или попроси помочь с идеями.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#539bf5]/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#539bf5]" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-[#539bf5] text-white'
                    : 'bg-[#2d333b] text-[#adbac7]'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#373e47] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#768390]" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#539bf5]/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#539bf5]" />
            </div>
            <div className="bg-[#2d333b] rounded-lg px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#768390]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 p-4 border-t border-[#444c56]"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Спросите о проекте..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#539bf5] hover:bg-[#539bf5]/90 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
