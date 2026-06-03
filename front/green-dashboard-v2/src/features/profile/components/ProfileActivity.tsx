import React from 'react';
import { Clock, ShoppingCart, Settings, FileText } from 'lucide-react';

interface ProfileActivityProps {
  loading?: boolean;
}

interface Activity {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

const sampleActivities: Activity[] = [
  {
    id: 1,
    icon: <ShoppingCart className="h-4 w-4" />,
    title: "New Order Processed",
    description: "Processed order #12345",
    time: "2 hours ago"
  },
  {
    id: 2,
    icon: <Settings className="h-4 w-4" />,
    title: "Settings Updated",
    description: "Changed notification preferences",
    time: "5 hours ago"
  },
  {
    id: 3,
    icon: <FileText className="h-4 w-4" />,
    title: "Report Generated",
    description: "Monthly sales report generated",
    time: "1 day ago"
  }
];

export function ProfileActivity({ loading }: ProfileActivityProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-32 bg-mintlify-accent/10 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-mintlify-accent/10"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-mintlify-accent/10 rounded mb-2"></div>
                <div className="h-3 w-48 bg-mintlify-accent/10 rounded"></div>
              </div>
              <div className="h-3 w-16 bg-mintlify-accent/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
      <h3 className="text-lg font-semibold text-mintlify-text mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {sampleActivities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-mintlify-accent/10 flex items-center justify-center text-mintlify-accent">
                {activity.icon}
              </div>
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-mintlify-text">
                  {activity.title}
                </p>
                <span className="text-xs text-mintlify-text-secondary flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </span>
              </div>
              <p className="text-sm text-mintlify-text-secondary mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 