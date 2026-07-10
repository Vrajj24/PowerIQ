import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Shield, Key, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('123 Energy Park, Tech City, India');
  
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordUI, setShowPasswordUI] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    updateUser(name, email);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordUI(false);
    // password logic goes here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-left pb-10">
      <div>
        <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-600 text-xs font-medium mt-1">Manage your account information, contact details, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Overview */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 space-y-4 rounded-xl">
          <div className="w-24 h-24 rounded-full bg-[#1a2a3a] border-4 border-slate-900 flex items-center justify-center text-white font-extrabold text-3xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] tracking-wider">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'JD'}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 font-serif text-base">{user?.name || 'John Doe'}</h3>
            <p className="text-[10px] text-[#c5a059] font-bold uppercase tracking-wider mt-0.5">Energy Analyst</p>
          </div>
          <div className="w-full pt-4 border-t-2 border-slate-900 space-y-2.5 text-xs text-left text-slate-655 text-slate-500">
            <div className="flex justify-between">
              <span className="font-semibold uppercase text-[9px] tracking-wider">Account Type:</span>
              <span className="text-slate-900 font-bold font-serif">Enterprise</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold uppercase text-[9px] tracking-wider">Status:</span>
              <span className="text-[#5a7366] font-bold uppercase text-[10px]">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold uppercase text-[9px] tracking-wider">Member Since:</span>
              <span className="text-slate-900 font-bold font-serif">Jan 2025</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Update details and security */}
        <div className="md:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact and billing address.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                
                {isSaved && (
                  <div className="p-3 bg-emerald-50 border-2 border-emerald-900 text-[#5a7366] text-xs rounded-lg flex items-center gap-2 font-bold uppercase tracking-wide">
                    <CheckCircle size={15} />
                    <span>Profile settings updated successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    id="profile-name"
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User size={15} />}
                  />
                  <Input 
                    id="profile-email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={15} />}
                  />
                  <Input 
                    id="profile-phone"
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone size={15} />}
                  />
                  <div className="sm:col-span-2">
                    <Input 
                      id="profile-address"
                      label="Home Address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      leftIcon={<MapPin size={15} />}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Credential management and security options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              
              {!showPasswordUI ? (
                <div className="p-3 bg-slate-50 rounded-lg border-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-white border-2 border-slate-900 rounded-lg text-slate-800">
                      <Key size={14} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900 font-serif">Change Password</h4>
                      <p className="text-slate-500 text-[9px] mt-0.5 uppercase font-bold tracking-wider">Update your account login passkey.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordUI(true)}>
                    Update
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <h4 className="font-bold text-slate-900 font-serif">Change Password</h4>
                    <div className="grid gap-3">
                      <Input id="current-pass" label="Current Password" type="password" />
                      <Input id="new-pass" label="New Password" type="password" />
                      <Input id="confirm-pass" label="Confirm Password" type="password" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" type="button" onClick={() => setShowPasswordUI(false)}>Cancel</Button>
                      <Button variant="primary" size="sm" type="submit">Save Password</Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg border-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-white border-2 border-slate-900 rounded-lg text-slate-800">
                    <Shield size={14} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 font-serif">Two-Factor Authentication</h4>
                    <p className="text-slate-500 text-[9px] mt-0.5 uppercase font-bold tracking-wider">Secure your dashboard with TOTP keys.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
