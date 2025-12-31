'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Moon, Sun, Calendar, Clock, Mail, Smartphone, Download, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const TIME_OPTIONS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
];

function formatTime(time: string): string {
  const [hours] = time.split(':');
  const h = parseInt(hours);
  if (h === 0) return '12:00 AM';
  if (h === 12) return '12:00 PM';
  if (h > 12) return `${h - 12}:00 PM`;
  return `${h}:00 AM`;
}

export default function SettingsPage() {
  // Review Schedule
  const [reviewDay, setReviewDay] = useState(0); // Sunday
  const [reviewTime, setReviewTime] = useState('17:00'); // 5 PM
  
  // Notifications
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [escalationEnabled, setEscalationEnabled] = useState(true);
  
  // Appearance
  const [darkMode, setDarkMode] = useState(false);
  
  // Save states
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const handleExportData = () => {
    // In real app, fetch all data and download as JSON
    alert('Export feature coming soon! Will download all your review data as JSON.');
  };
  
  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      alert('Account deletion coming soon with Supabase integration.');
    }
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-coach-charcoal' : 'bg-paper'}`}>
      {/* Header */}
      <header className="bg-coach-charcoal">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 -rotate-3 items-center justify-center rounded-lg bg-focus-orange font-display text-sm font-bold text-white">
              RR
            </div>
            <span className="font-display text-lg font-bold text-white">
              Review<span className="text-focus-orange">Ritual</span>
            </span>
          </Link>
        </div>
      </header>
      
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-focus-orange hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`font-display text-2xl font-bold ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
            Settings
          </h1>
          <p className={darkMode ? 'text-medium-gray' : 'text-text-secondary'}>
            Configure your review schedule and preferences.
          </p>
        </div>
        
        {/* Review Schedule */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className={`h-5 w-5 ${darkMode ? 'text-focus-orange' : 'text-focus-orange'}`} />
            <h2 className={`font-display text-sm uppercase tracking-wider ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
              Review Schedule
            </h2>
          </div>
          
          <div className={`rounded-xl border-2 p-4 space-y-4 ${darkMode ? 'border-coach-slate bg-coach-slate' : 'border-warm-gray bg-white'}`}>
            {/* Day Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
                Review Day
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day.value}
                    onClick={() => setReviewDay(day.value)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      reviewDay === day.value
                        ? 'bg-focus-orange text-white'
                        : darkMode
                          ? 'bg-coach-charcoal text-medium-gray hover:text-white'
                          : 'bg-warm-gray text-text-secondary hover:bg-warm-gray/80'
                    }`}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
                Review Time
              </label>
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`} />
                <select
                  value={reviewTime}
                  onChange={(e) => setReviewTime(e.target.value)}
                  className={`h-10 rounded-lg border-2 px-3 font-body focus:border-focus-orange focus:outline-none ${
                    darkMode
                      ? 'border-coach-charcoal bg-coach-charcoal text-white'
                      : 'border-warm-gray bg-white text-text-primary'
                  }`}
                >
                  {TIME_OPTIONS.map(time => (
                    <option key={time} value={time}>
                      {formatTime(time)}
                    </option>
                  ))}
                </select>
              </div>
              <p className={`mt-2 text-xs ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
                You'll receive your first reminder at this time.
              </p>
            </div>
          </div>
        </section>
        
        {/* Notifications */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-focus-orange" />
            <h2 className={`font-display text-sm uppercase tracking-wider ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
              Notifications
            </h2>
          </div>
          
          <div className={`rounded-xl border-2 p-4 space-y-4 ${darkMode ? 'border-coach-slate bg-coach-slate' : 'border-warm-gray bg-white'}`}>
            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className={`h-5 w-5 ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
                    Push Notifications
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
                    Receive reminders on your device
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  pushEnabled ? 'bg-focus-orange' : darkMode ? 'bg-coach-charcoal' : 'bg-warm-gray'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    pushEnabled ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className={`h-5 w-5 ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
                    Email Reminders
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
                    Backup reminders via email
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEmailEnabled(!emailEnabled)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  emailEnabled ? 'bg-focus-orange' : darkMode ? 'bg-coach-charcoal' : 'bg-warm-gray'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    emailEnabled ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
            
            {/* Escalation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className={`h-5 w-5 ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
                    Escalating Reminders
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
                    "Streak at risk" follow-ups if you don't complete
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEscalationEnabled(!escalationEnabled)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  escalationEnabled ? 'bg-focus-orange' : darkMode ? 'bg-coach-charcoal' : 'bg-warm-gray'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    escalationEnabled ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
        
        {/* Appearance */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {darkMode ? <Moon className="h-5 w-5 text-focus-orange" /> : <Sun className="h-5 w-5 text-focus-orange" />}
            <h2 className={`font-display text-sm uppercase tracking-wider ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
              Appearance
            </h2>
          </div>
          
          <div className={`rounded-xl border-2 p-4 ${darkMode ? 'border-coach-slate bg-coach-slate' : 'border-warm-gray bg-white'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className={`h-5 w-5 ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
                    Dark Mode
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
                    Easy on the eyes for evening reviews
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  darkMode ? 'bg-focus-orange' : 'bg-warm-gray'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    darkMode ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
        
        {/* Data & Account */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Download className="h-5 w-5 text-focus-orange" />
            <h2 className={`font-display text-sm uppercase tracking-wider ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
              Data & Account
            </h2>
          </div>
          
          <div className={`rounded-xl border-2 p-4 space-y-4 ${darkMode ? 'border-coach-slate bg-coach-slate' : 'border-warm-gray bg-white'}`}>
            {/* Export Data */}
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
                  Export Data
                </p>
                <p className={`text-xs ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
                  Download all your reviews as JSON
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleExportData}>
                <Download className="mr-1 h-4 w-4" />
                Export
              </Button>
            </div>
            
            {/* Delete Account */}
            <div className="flex items-center justify-between pt-4 border-t border-warm-gray">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-coach-charcoal'}`}>
                  Delete Account
                </p>
                <p className={`text-xs ${darkMode ? 'text-medium-gray' : 'text-text-secondary'}`}>
                  Permanently delete all data
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </section>
        
        {/* Save Button */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-focus-orange hover:underline">
            ← Back to Dashboard
          </Link>
          <Button onClick={handleSave} isLoading={isSaving}>
            {saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
