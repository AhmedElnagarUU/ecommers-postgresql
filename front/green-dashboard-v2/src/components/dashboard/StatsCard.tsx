import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <div className="bg-gradient-to-b from-[#2a1d3f]/30 to-[#1a1a1a]/30 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/60">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl">
          <Icon size={24} className="text-white/60" />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center space-x-2">
          {trend && (
            <span className={`text-sm ${trend.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
          )}
          <span className="text-sm text-white/40">
            {description || trend?.label}
          </span>
        </div>
      )}
    </div>
  );
} 