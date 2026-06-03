import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ProfileInfoProps {
  loading?: boolean;
}

export function ProfileInfo({ loading }: ProfileInfoProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-24 w-24 rounded-2xl bg-mintlify-accent/10"></div>
            <div className="h-4 w-32 bg-mintlify-accent/10 rounded"></div>
            <div className="h-3 w-24 bg-mintlify-accent/10 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-5 w-5 rounded bg-mintlify-accent/10"></div>
                <div className="h-4 w-full bg-mintlify-accent/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
      {/* Profile Image and Name */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-24 w-24 rounded-2xl bg-mintlify-accent/10 flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-mintlify-accent">JD</span>
        </div>
        <h2 className="text-lg font-semibold text-mintlify-text">John Doe</h2>
        <p className="text-sm text-mintlify-text-secondary">Administrator</p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-mintlify-text-secondary">
          <Mail className="h-5 w-5" />
          <span className="text-sm">john.doe@example.com</span>
        </div>
        <div className="flex items-center space-x-3 text-mintlify-text-secondary">
          <Phone className="h-5 w-5" />
          <span className="text-sm">+1 234-567-8901</span>
        </div>
        <div className="flex items-center space-x-3 text-mintlify-text-secondary">
          <MapPin className="h-5 w-5" />
          <span className="text-sm">New York, USA</span>
        </div>
      </div>

      {/* Edit Profile Button */}
      <button className="w-full mt-6 px-4 py-2 bg-mintlify-accent/10 hover:bg-mintlify-accent/20 
        text-mintlify-accent rounded-lg text-sm font-medium">
        Edit Profile
      </button>
    </div>
  );
} 