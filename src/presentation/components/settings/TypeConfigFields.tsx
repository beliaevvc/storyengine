'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import type { AttributeType } from '@/core/types/attribute-schema';

interface TypeConfigFieldsProps {
  type: AttributeType;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

export function TypeConfigFields({ type, config, onChange }: TypeConfigFieldsProps) {
  switch (type) {
    case 'number':
      return <NumberConfigFields config={config} onChange={onChange} />;
    case 'text':
      return <TextConfigFields config={config} onChange={onChange} />;
    case 'boolean':
      return <BooleanConfigFields config={config} onChange={onChange} />;
    case 'enum':
      return <EnumConfigFields config={config} onChange={onChange} />;
    case 'list':
      return <ListConfigFields config={config} onChange={onChange} />;
    default:
      return null;
  }
}

// ============================================
// NUMBER CONFIG
// ============================================

function NumberConfigFields({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  const handleChange = (field: string, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    onChange({ ...config, [field]: numValue });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-fg-muted mb-1">
            Минимум
          </label>
          <Input
            type="number"
            value={config.min !== undefined ? String(config.min) : ''}
            onChange={(e) => handleChange('min', e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-fg-muted mb-1">
            Максимум
          </label>
          <Input
            type="number"
            value={config.max !== undefined ? String(config.max) : ''}
            onChange={(e) => handleChange('max', e.target.value)}
            placeholder="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-fg-muted mb-1">
            По умолчанию
          </label>
          <Input
            type="number"
            value={config.default !== undefined ? String(config.default) : ''}
            onChange={(e) => handleChange('default', e.target.value)}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// TEXT CONFIG
// ============================================

function TextConfigFields({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-fg-muted mb-1">
            Макс. длина
          </label>
          <Input
            type="number"
            value={config.maxLength !== undefined ? String(config.maxLength) : ''}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : Number(e.target.value);
              onChange({ ...config, maxLength: value });
            }}
            placeholder="500"
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-fg-muted mb-1">
            По умолчанию
          </label>
          <Input
            type="text"
            value={(config.default as string) ?? ''}
            onChange={(e) => onChange({ ...config, default: e.target.value || undefined })}
            placeholder="Значение по умолчанию"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// BOOLEAN CONFIG
// ============================================

function BooleanConfigFields({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  const defaultValue = config.default as boolean | undefined;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-fg-muted mb-2">
          Значение по умолчанию
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...config, default: false })}
            className={`
              px-4 py-2 rounded-md border transition-colors
              ${defaultValue === false
                ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                : 'border-border-default text-fg-muted hover:border-border-emphasis'
              }
            `}
          >
            Нет (false)
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...config, default: true })}
            className={`
              px-4 py-2 rounded-md border transition-colors
              ${defaultValue === true
                ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                : 'border-border-default text-fg-muted hover:border-border-emphasis'
              }
            `}
          >
            Да (true)
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...config, default: undefined })}
            className={`
              px-4 py-2 rounded-md border transition-colors
              ${defaultValue === undefined
                ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                : 'border-border-default text-fg-muted hover:border-border-emphasis'
              }
            `}
          >
            Не задано
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ENUM CONFIG
// ============================================

function EnumConfigFields({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  const [newOption, setNewOption] = useState('');
  const options = (config.options as string[]) ?? [];
  const defaultValue = config.default as string | undefined;

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      onChange({
        ...config,
        options: [...options, newOption.trim()],
      });
      setNewOption('');
    }
  };

  const handleRemoveOption = (option: string) => {
    const newOptions = options.filter((o) => o !== option);
    onChange({
      ...config,
      options: newOptions,
      // Clear default if it was the removed option
      default: defaultValue === option ? undefined : defaultValue,
    });
  };

  const handleSetDefault = (option: string) => {
    onChange({
      ...config,
      default: defaultValue === option ? undefined : option,
    });
  };

  return (
    <div className="space-y-4">
      {/* Options list */}
      <div>
        <label className="block text-sm font-medium text-fg-muted mb-2">
          Варианты выбора
        </label>
        {options.length > 0 ? (
          <div className="space-y-2 mb-3">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center gap-2 p-2 bg-bg-subtle rounded-md"
              >
                <span className="flex-1 text-fg-default">{option}</span>
                <button
                  type="button"
                  onClick={() => handleSetDefault(option)}
                  className={`
                    text-xs px-2 py-1 rounded transition-colors
                    ${defaultValue === option
                      ? 'bg-accent-primary text-white'
                      : 'text-fg-muted hover:bg-bg-emphasis'
                    }
                  `}
                >
                  {defaultValue === option ? 'По умолч.' : 'Сделать по умолч.'}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(option)}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-fg-muted mb-3">
            Добавьте варианты для выбора
          </p>
        )}

        {/* Add new option */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Новый вариант"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddOption();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddOption}
            disabled={!newOption.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LIST CONFIG
// ============================================

function ListConfigFields({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  const [newItem, setNewItem] = useState('');
  const defaultItems = (config.default as string[]) ?? [];

  const handleAddItem = () => {
    if (newItem.trim()) {
      onChange({
        ...config,
        default: [...defaultItems, newItem.trim()],
      });
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = defaultItems.filter((_, i) => i !== index);
    onChange({
      ...config,
      default: newItems.length > 0 ? newItems : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-fg-muted mb-2">
          Значения по умолчанию (опционально)
        </label>
        {defaultItems.length > 0 && (
          <div className="space-y-2 mb-3">
            {defaultItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-bg-subtle rounded-md"
              >
                <span className="flex-1 text-fg-default">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Новый элемент списка"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddItem();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddItem}
            disabled={!newItem.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
}
