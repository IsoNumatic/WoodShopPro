import { useState } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'phases'>('users');

  return (
    <div className="min-h-screen bg-bg p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-fg mb-8">Admin Panel</h1>

        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-l-btn font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-accent text-white shadow-inset'
                : 'bg-bg text-muted shadow-extruded hover:shadow-extruded-hover'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('phases')}
            className={`flex-1 py-2 px-4 rounded-r-btn font-medium transition-all ${
              activeTab === 'phases'
                ? 'bg-accent text-white shadow-inset'
                : 'bg-bg text-muted shadow-extruded hover:shadow-extruded-hover'
            }`}
          >
            Custom Phases
          </button>
        </div>

        <div className="bg-bg rounded-card shadow-extruded p-6">
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Company Users</h2>
              <p className="text-muted">Users management coming soon...</p>
            </div>
          )}

          {activeTab === 'phases' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Custom Phases</h2>
              <p className="text-muted">Custom phases management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}