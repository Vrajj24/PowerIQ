import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('123 Energy Park, Tech City, India');
  
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateUser(name, email);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'JD';

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-left">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-ink tracking-tight">Your corner of PowerIQ</h1>
        <p className="text-muted text-xs mt-0.5">Keep your account details up to date.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Summary */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 space-y-4 bg-surface">
          <div className="w-20 h-20 rounded-full bg-line border border-line flex items-center justify-center text-ink font-bold text-2xl">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-ink text-sm">{user?.name || 'John Doe'}</h3>
            <p className="text-xs text-muted font-mono mt-0.5">Energy Analyst</p>
          </div>
          
          <div className="w-full pt-4 border-t border-line space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-muted">Account Role</span>
              <span className="text-ink font-medium">Administrator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Auth Method</span>
              <span className="text-ink font-mono">JWT Bearer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Status</span>
              <span className="text-emerald-700 font-medium">Active</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Edit Profile Form */}
        <Card className="md:col-span-2 p-6 bg-surface">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-semibold text-ink border-b border-line pb-2">Profile Details</h3>

            {isSaved && (
              <div className="p-3 bg-emerald-100/40 border border-emerald-200/60 text-emerald-700 text-xs rounded-sm flex items-center gap-2">
                <CheckCircle size={15} />
                <span>Profile updated successfully</span>
              </div>
            )}

            <Input
              id="name"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="phone"
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              id="address"
              label="Property Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

      </div>

    </div>
  );
}
