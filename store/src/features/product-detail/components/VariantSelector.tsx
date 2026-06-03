import type { VariantGroup } from '@/lib/types';
import { cn } from '@/shared/lib/cn';

interface VariantSelectorProps {
  groups?: VariantGroup[];
  selections: Record<string, string>;
  onChange: (groupName: string, value: string) => void;
}

export function VariantSelector({ groups = [], selections, onChange }: VariantSelectorProps) {
  if (!groups.length) return null;

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.name}>
          <p className="mb-3 text-sm font-bold text-brand">{group.name}</p>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange(group.name, option)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition',
                  selections[group.name] === option
                    ? 'border-brand bg-brand text-white'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
