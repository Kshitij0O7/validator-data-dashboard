'use client';

import { useState } from 'react';
import ValidatorDashboard from '@/app/components/ValidatorDashboard';

export default function Home() {
  const [validatorAddress, setValidatorAddress] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatorAddress.trim()) {
      setShowDashboard(true);
    }
  };

  if (showDashboard) {
    return <ValidatorDashboard validatorAddress={validatorAddress} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      <main className="flex w-full max-w-2xl flex-col items-center justify-center px-6 py-16">
        <div className="w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Validator Rewards Tracker
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Enter a validator address to track staking rewards
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                value={validatorAddress}
                onChange={(e) => setValidatorAddress(e.target.value)}
                placeholder="Enter validator address (e.g., 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb)"
                className="w-full h-14 pl-6 pr-32 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
