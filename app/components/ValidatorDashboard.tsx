'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface TransactionData {
  Block: {
    Time: string;
    Number: number;
  };
  TokenBalance: {
    Address: string;
    PostBalance: string;
    PreBalance: string;
    PostBalanceInUSD: string;
    PreBalanceInUSD: string;
  };
  Transaction: {
    Hash: string;
  };
  reward: string;
  reward_usd: string;
}

interface ApiResponse {
  data: {
    EVM: {
      TransactionBalances: TransactionData[];
    };
  };
}

interface ValidatorDashboardProps {
  validatorAddress: string;
}

export default function ValidatorDashboard({ validatorAddress }: ValidatorDashboardProps) {
  const [data, setData] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/validator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: validatorAddress,
        }),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((result as any).error || 'Failed to fetch data');
      }

      if (result.data?.EVM?.TransactionBalances) {
        // Sort data in descending order by Block Time (newest first)
        const sortedData = [...result.data.EVM.TransactionBalances].sort((a, b) => {
          const timeA = new Date(a.Block.Time).getTime();
          const timeB = new Date(b.Block.Time).getTime();
          return timeB - timeA; // Descending order
        });
        setData(sortedData);
        // Reset to first page when new data is loaded
        setCurrentPage(1);
      } else {
        setData([]);
        setCurrentPage(1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch validator data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [validatorAddress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const downloadCSV = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create CSV content
    const headers = ['Block Time', 'Post Balance', 'Pre Balance', 'Rewards in ETH', 'Rewards in USD', 'Transaction Hash'];
    const csvRows = [headers.join(',')];
    
    data.forEach((transaction) => {
      const row = [
        formatDate(transaction.Block.Time),
        formatBalance(transaction.TokenBalance.PostBalance),
        formatBalance(transaction.TokenBalance.PreBalance),
        formatBalance(transaction.reward),
        parseFloat(transaction.reward_usd).toFixed(2),
        transaction.Transaction.Hash,
      ];
      csvRows.push(row.map(cell => `"${cell}"`).join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `validator-${validatorAddress.slice(0, 10)}-rewards.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Close form after download
    setShowForm(false);
    // Reset form
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const formatBalance = (balance: string) => {
    return parseFloat(balance).toFixed(6);
  };

  const formatUSD = (usd: string) => {
    return parseFloat(usd).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (time: string) => {
    return new Date(time).toLocaleString();
  };

  // Latest Balance: PostBalance for the first entry (newest after sorting)
  // Balance 24 hours ago: PreBalance for the last entry (oldest after sorting)
  const latestBalance = data.length > 0 ? data[0]?.TokenBalance?.PostBalance : '0';
  const balance24HoursAgo = data.length > 0 ? data[data.length - 1]?.TokenBalance?.PreBalance : '0';

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900 py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
            >
              ← Back to Search
            </Link>
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
              Validator: {validatorAddress.slice(0, 10)}...{validatorAddress.slice(-8)}
            </h1>
          </div>
          <button
            onClick={downloadCSV}
            className="px-6 py-3 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
          >
            Download .csv
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Loading validator data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                  Latest Balance
                </h3>
                <p className="text-3xl font-bold text-black dark:text-zinc-50">
                  {formatBalance(latestBalance)} ETH
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                  Balance 24 Hours Ago
                </h3>
                <p className="text-3xl font-bold text-black dark:text-zinc-50">
                  {formatBalance(balance24HoursAgo)} ETH
                </p>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden">
              {/* Pagination Controls - Top */}
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Show:
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    entries
                  </span>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Showing {data.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                        Block Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                        Post Balance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                        Pre Balance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                        Rewards in ETH
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                        Rewards in USD
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                        Transaction Signature
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-zinc-600 dark:text-zinc-400">
                          No transaction data available for this validator in the last 24 hours.
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((transaction, index) => (
                        <tr
                          key={`${transaction.Transaction.Hash}-${index}`}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-zinc-50">
                            {formatDate(transaction.Block.Time)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-zinc-50">
                            {formatBalance(transaction.TokenBalance.PostBalance)} ETH
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-zinc-50">
                            {formatBalance(transaction.TokenBalance.PreBalance)} ETH
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-zinc-50">
                            {formatBalance(transaction.reward)} ETH
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-zinc-50">
                            {formatUSD(transaction.reward_usd)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Link
                              href={`https://etherscan.io/tx/${transaction.Transaction.Hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {transaction.Transaction.Hash.slice(0, 10)}...{transaction.Transaction.Hash.slice(-8)}
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls - Bottom */}
              {data.length > 0 && (
                <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === 1
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black dark:text-zinc-50">
                  Contact Us
                </h2>
                <button
                  onClick={closeForm}
                  className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                Please complete the form below with as much detail as possible.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Use Case Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Please describe your use case and requirements..."
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Download CSV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

