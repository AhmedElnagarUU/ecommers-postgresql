'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export function DashboardCard({ title, value, icon: Icon, trend, loading }: DashboardCardProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden">
        <div className="space-y-4">
          <div className="h-12 w-12 rounded-xl bg-mintlify-accent/10"></div>
          <div className="h-4 w-24 bg-mintlify-hover/50 rounded-lg"></div>
          <div className="h-8 w-16 bg-mintlify-hover/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      {/* Card Container */}
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden 
        border border-mintlify-accent/5 hover:border-mintlify-accent/20 transition-all duration-300 ease-in-out">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-mintlify-accent/5 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>

        {/* Content Container */}
        <div className="relative">
          {/* Icon Container */}
          <div className="mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-mintlify-accent/10 
              flex items-center justify-center transition-colors duration-300 ease-in-out">
              <Icon className="w-7 h-7 text-mintlify-accent group-hover:text-blue-400 transition-colors duration-300 ease-in-out" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-mintlify-text-secondary font-medium group-hover:text-mintlify-text transition-colors duration-300 ease-in-out">{title}</h3>
            
            <div className="flex items-end space-x-2">
              <span className="text-2xl font-bold text-mintlify-text group-hover:text-blue-400 transition-colors duration-300 ease-in-out">
                {value}
              </span>
              {trend && (
                <div className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-300 ease-in-out
                  ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{trend.isPositive ? '↑' : '↓'}</span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-mintlify-accent/20
          scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></div>
      </div>
    </div>
  );
}

export default DashboardCard;