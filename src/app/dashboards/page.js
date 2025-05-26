'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, ClipboardIcon, ArrowPathIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch API keys
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/keys');
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      setError('Failed to fetch API keys');
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create API key');
      }

      setApiKeys([...apiKeys, data]);
      setNewKeyName('');
      setSuccessMessage('API key created successfully');
      setShowCreateModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message);
      console.error('Error creating API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (keyId) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      setSuccessMessage('API key deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message);
      console.error('Error deleting API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateApiKey = async (keyId) => {
    if (!confirm('Are you sure you want to regenerate this API key? The old key will stop working immediately.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/keys/${keyId}/regenerate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate API key');
      }

      const newKey = await response.json();
      setApiKeys(apiKeys.map(key => key.id === keyId ? newKey : key));
      setSuccessMessage('API key regenerated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message);
      console.error('Error regenerating API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1">
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-sm text-gray-500 mb-1">Pages / Overview</div>
                <h1 className="text-3xl font-bold">Overview</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Operational</span>
                </div>
              </div>
            </div>

            {/* Current Plan Card */}
            <div className="bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200 rounded-xl p-8 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-sm font-medium mb-2">CURRENT PLAN</div>
                  <h2 className="text-3xl font-bold text-gray-900">Researcher</h2>
                </div>
                <button className="bg-white/20 hover:bg-white/30 text-gray-900 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors">
                  Manage Plan
                </button>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">API Usage</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Plan</span>
                  <span className="text-sm">0 / 1,000 Credits</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full">
                  <div className="h-full w-0 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* API Keys Section */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">API Keys</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <span>+</span>
                    <span>Create API Key</span>
                  </button>
                </div>
                <p className="text-gray-500 mt-2">
                  The key is used to authenticate your requests to the Research API. To learn more, see the documentation.
                </p>
              </div>

              {error && (
                <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                  {successMessage}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left text-sm font-medium text-gray-500 p-4">NAME</th>
                      <th className="text-left text-sm font-medium text-gray-500 p-4">TYPE</th>
                      <th className="text-left text-sm font-medium text-gray-500 p-4">USAGE</th>
                      <th className="text-left text-sm font-medium text-gray-500 p-4">KEY</th>
                      <th className="text-right text-sm font-medium text-gray-500 p-4">OPTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && apiKeys.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-gray-500">Loading API keys...</p>
                        </td>
                      </tr>
                    ) : apiKeys.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500">
                          No API keys found
                        </td>
                      </tr>
                    ) : (
                      apiKeys.map((key) => (
                        <tr key={key.id} className="border-b">
                          <td className="p-4">
                            <span className="font-medium">{key.name}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">dev</span>
                          </td>
                          <td className="p-4">0</td>
                          <td className="p-4 font-mono text-sm">
                            {key.key}
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => copyToClipboard(key.key, key.id)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Copy to clipboard"
                              >
                                {copiedKeyId === key.id ? (
                                  <CheckIcon className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ClipboardIcon className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => regenerateApiKey(key.id)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Regenerate Key"
                              >
                                <ArrowPathIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteApiKey(key.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Key"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">Create New API Key</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={createApiKey} className="p-6">
              <div className="mb-4">
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name
                </label>
                <input
                  id="keyName"
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter a name for your API key"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 