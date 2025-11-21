'use client';

import { useState, useRef, useEffect } from 'react';
import ValidatorDashboard from '@/app/components/ValidatorDashboard';

const EXAMPLE_ADDRESSES = [
  '0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97',
  '0xdadb0d80178819f2319190d340ce9a924f783711',
  '0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5',
  '0x18bb896994283bd9c16aa2072777a97c12f1b290',
];

export default function Home() {
  const [validatorAddress, setValidatorAddress] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState(EXAMPLE_ADDRESSES);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatorAddress.trim()) {
      setShowDashboard(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValidatorAddress(value);
    
    if (value.trim()) {
      // Filter addresses based on input
      const filtered = EXAMPLE_ADDRESSES.filter((addr) =>
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAddresses(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredAddresses(EXAMPLE_ADDRESSES);
      setShowDropdown(true);
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
    setFilteredAddresses(EXAMPLE_ADDRESSES);
  };

  const handleAddressSelect = (address: string) => {
    setValidatorAddress(address);
    setShowDropdown(false);
    inputRef.current?.focus();
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
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={validatorAddress}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
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
              
              {/* Dropdown with example addresses */}
              {showDropdown && filteredAddresses.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full mt-2 w-full bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 max-h-64 overflow-y-auto"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Example Validator Addresses
                    </div>
                    {filteredAddresses.map((address, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAddressSelect(address)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="text-sm font-mono text-black dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {address}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
