'use client';

import React, { useState, useEffect } from 'react';

interface GlobalSEO {
  siteName: string;
  siteDescription: string;
  defaultTitle: string;
  titleSeparator: string;
  defaultKeywords: string;
  author: string;
  ogImage: string;
  twitterHandle: string;
  twitterCard: string;
  googleAnalyticsId: string;
  googleSiteVerification: string;
  bingVerification: string;
  facebookAppId: string;
  robots: string;
  canonical: string;
}

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'advanced' | 'social' | 'verification'>('global');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [globalSEO, setGlobalSEO] = useState<GlobalSEO>({
    siteName: 'Steroids4U',
    siteDescription: 'Premium anabolic steroids and performance enhancement products. Fast EU shipping, authentic products, competitive prices.',
    defaultTitle: 'Buy Steroids Online | Steroids4U - Premium Quality Products',
    titleSeparator: '|',
    defaultKeywords: 'buy steroids, anabolic steroids, steroids online, performance enhancement, bodybuilding supplements',
    author: 'Steroids4U',
    ogImage: 'https://steroids4u.eu/og-image.jpg',
    twitterHandle: '@steroids4u',
    twitterCard: 'summary_large_image',
    googleAnalyticsId: '',
    googleSiteVerification: '',
    bingVerification: '',
    facebookAppId: '',
    robots: 'index, follow',
    canonical: 'https://steroids4u.eu',
  });

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/admin/seo/global', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.seo) {
            setGlobalSEO(data.seo);
          }
        }
      } catch (error) {
        console.error('Failed to fetch SEO settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSEO();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGlobalSEO((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/seo/global', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(globalSEO),
      });

      if (response.ok) {
        alert('SEO settings saved successfully!');
      } else {
        alert('Failed to save SEO settings');
      }
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      alert('Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Loading SEO settings...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">SEO Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global SEO settings, meta tags, and search engine optimization</p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">SEO Best Practices</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep titles under 60 characters for optimal display in search results</li>
              <li>• Meta descriptions should be 150-160 characters</li>
              <li>• Use relevant keywords naturally in your content</li>
              <li>• Ensure all images have descriptive alt text</li>
              <li>• Set up Google Analytics and Search Console for tracking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('global')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'global'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Global Settings
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'social'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Social Media
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'verification'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Verification & Analytics
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'advanced'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Advanced
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Global Settings Tab */}
          {activeTab === 'global' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={globalSEO.siteName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Steroids4U"
                />
                <p className="text-xs text-gray-500 mt-1">Your website's name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Page Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="defaultTitle"
                  value={globalSEO.defaultTitle}
                  onChange={handleChange}
                  maxLength={60}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Buy Steroids Online | Steroids4U"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {globalSEO.defaultTitle.length}/60 characters - Used when no specific title is set
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Separator
                </label>
                <select
                  name="titleSeparator"
                  value={globalSEO.titleSeparator}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="|">| (Pipe)</option>
                  <option value="-">- (Dash)</option>
                  <option value="–">– (En Dash)</option>
                  <option value="—">— (Em Dash)</option>
                  <option value="·">· (Middle Dot)</option>
                  <option value="•">• (Bullet)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Character used to separate title parts</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="siteDescription"
                  value={globalSEO.siteDescription}
                  onChange={handleChange}
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Premium anabolic steroids and performance enhancement products..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {globalSEO.siteDescription.length}/160 characters - Default meta description
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Keywords
                </label>
                <textarea
                  name="defaultKeywords"
                  value={globalSEO.defaultKeywords}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="buy steroids, anabolic steroids, steroids online..."
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for your site</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  name="author"
                  value={globalSEO.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Steroids4U"
                />
                <p className="text-xs text-gray-500 mt-1">Default author for content</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  name="canonical"
                  value={globalSEO.canonical}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="https://steroids4u.eu"
                />
                <p className="text-xs text-gray-500 mt-1">Your site's primary domain</p>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Open Graph (Facebook, LinkedIn)</h3>
                <p className="text-xs text-gray-600">Controls how your content appears when shared on social media</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default OG Image URL
                </label>
                <input
                  type="url"
                  name="ogImage"
                  value={globalSEO.ogImage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="https://steroids4u.eu/og-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x630px</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook App ID
                </label>
                <input
                  type="text"
                  name="facebookAppId"
                  value={globalSEO.facebookAppId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="123456789012345"
                />
                <p className="text-xs text-gray-500 mt-1">For Facebook Insights and analytics</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Twitter Card Settings</h3>
                <p className="text-xs text-gray-600">Optimize how your content appears on Twitter/X</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  name="twitterHandle"
                  value={globalSEO.twitterHandle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="@steroids4u"
                />
                <p className="text-xs text-gray-500 mt-1">Your Twitter/X username</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Card Type
                </label>
                <select
                  name="twitterCard"
                  value={globalSEO.twitterCard}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary with Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">How Twitter displays your content</p>
              </div>
            </div>
          )}

          {/* Verification & Analytics Tab */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Search Engine Verification</h3>
                <p className="text-xs text-gray-600">Verify your site ownership with search engines</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Site Verification Code
                </label>
                <input
                  type="text"
                  name="googleSiteVerification"
                  value={globalSEO.googleSiteVerification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 font-mono text-xs"
                  placeholder="abc123def456ghi789jkl012mno345pqr678stu901"
                />
                <p className="text-xs text-gray-500 mt-1">From Google Search Console</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bing Webmaster Verification Code
                </label>
                <input
                  type="text"
                  name="bingVerification"
                  value={globalSEO.bingVerification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 font-mono text-xs"
                  placeholder="ABC123DEF456GHI789JKL012MNO345"
                />
                <p className="text-xs text-gray-500 mt-1">From Bing Webmaster Tools</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Analytics & Tracking</h3>
                <p className="text-xs text-gray-600">Monitor your site's performance and traffic</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  name="googleAnalyticsId"
                  value={globalSEO.googleAnalyticsId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 font-mono text-xs"
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                />
                <p className="text-xs text-gray-500 mt-1">Google Analytics 4 or Universal Analytics ID</p>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-900 mb-1">Advanced Settings</h3>
                    <p className="text-xs text-yellow-800">These settings affect how search engines crawl and index your site. Change with caution.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Robots Meta Tag
                </label>
                <select
                  name="robots"
                  value={globalSEO.robots}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="index, follow">Index, Follow (Recommended)</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Controls search engine indexing behavior</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Robots.txt Preview</h3>
                <pre className="text-xs font-mono bg-white p-3 rounded border border-gray-200 overflow-x-auto">
{`User-agent: *
Allow: /

Sitemap: ${globalSEO.canonical}/sitemap.xml`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </div>
    </div>
  );
}


