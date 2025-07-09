import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function ApiKeyTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; message: string } | null>(null);

  const testApiKey = async () => {
    setTesting(true);
    setResult(null);

    try {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      
      if (!apiKey) {
        setResult({
          success: false,
          message: 'No API key found. Please add VITE_NEWS_API_KEY to your .env file'
        });
        return;
      }

      console.log('Testing API key:', apiKey.substring(0, 10) + '...');

      // Test with a simple request
      const params = new URLSearchParams({
        q: 'test',
        pageSize: '1',
        apiKey: apiKey
      });

      const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
      const data = await response.json();

      if (response.ok && data.status === 'ok') {
        setResult({
          success: true,
          message: `API key is valid! Found ${data.totalResults} total articles available.`
        });
      } else {
        setResult({
          success: false,
          message: `API error: ${data.message || data.code || 'Unknown error'}`
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setTesting(false);
    }
  };

  const testWebhook = async () => {
    setWebhookTesting(true);
    setWebhookResult(null);

    try {
      const response = await fetch('https://eo19k75419koo7s.m.pipedream.net', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test webhook from NewsHub!',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setWebhookResult({
          success: true,
          message: `Webhook successful! Response: ${JSON.stringify(data)}`
        });
      } else {
        setWebhookResult({
          success: false,
          message: `Webhook failed: ${response.status} - ${response.statusText}`
        });
      }
    } catch (error) {
      setWebhookResult({
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setWebhookTesting(false);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">API & Webhook Tests</h3>
      
      <div className="flex space-x-4 mb-4">
        <button
          onClick={testApiKey}
          disabled={testing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {testing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <span>Test News API</span>
          )}
        </button>

        <button
          onClick={testWebhook}
          disabled={webhookTesting}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {webhookTesting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <span>Test Webhook</span>
          )}
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {result.success ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          )}
          <div>
            <p className={`text-sm font-medium ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? 'Success!' : 'Error'}
            </p>
            <p className={`text-sm ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>
          </div>
        </div>
      )}

      {webhookResult && (
        <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
          webhookResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {webhookResult.success ? (
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          )}
          <div>
            <p className={`text-sm font-medium ${
              webhookResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {webhookResult.success ? 'Webhook Success!' : 'Webhook Error'}
            </p>
            <p className={`text-sm ${
              webhookResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {webhookResult.message}
            </p>
          </div>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>News API Key:</strong> {import.meta.env.VITE_NEWS_API_KEY ? 
              `${import.meta.env.VITE_NEWS_API_KEY.substring(0, 10)}...` : 
              'Not configured'
            }</p>
            <p className="mt-2">
              Get a free key at{' '}
              <a 
                href="https://newsapi.org/register" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                newsapi.org/register
              </a>
            </p>
          </div>
          <div>
            <p><strong>Pipedream Webhook:</strong> https://eo19k75419koo7s.m.pipedream.net</p>
            <p className="mt-2">
              The webhook will be triggered when you click the "Webhook" button in the search bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}