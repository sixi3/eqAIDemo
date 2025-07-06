import React, { useEffect, useState } from 'react';

interface TokenUsage {
  count: number;
  files: string[];
  type: string;
  category: string;
}

interface ChangeItem {
  token: string;
  changeCount: number;
  lastChanged: string;
  changes: Array<{
    type: string;
    timestamp: string;
    author: string;
  }>;
}

interface Recommendation {
  type: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  details: string[];
}

interface AnalyticsData {
  metadata: {
    generatedAt: string;
    period: string;
    version: string;
  };
  summary: {
    totalTokens: number;
    activeTokens: number;
    totalChanges: number;
    uniqueContributors: number;
    lastUpdate: string;
    mostUsedTokens: Array<{ token: string } & TokenUsage>;
    unusedTokens: string[];
    adoptionRate: number;
  };
  changeFrequency: ChangeItem[];
  categoryBreakdown: Record<string, { count: number; tokens: string[] }>;
  recommendations: Recommendation[];
  trends: {
    recentActivity: number;
    newTokens: number;
    modifiedTokens: number;
  };
}

const DesignSystemDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For now, we'll simulate loading analytics data
      const mockData: AnalyticsData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          period: '2024-01-01 to 2024-01-31',
          version: '1.0.0'
        },
        summary: {
          totalTokens: 85,
          activeTokens: 67,
          totalChanges: 23,
          uniqueContributors: 3,
          lastUpdate: new Date().toISOString(),
          mostUsedTokens: [
            { token: 'colors.primary.500', count: 45, files: ['src/App.tsx', 'src/components/Button.tsx'], type: 'color', category: 'colors' },
            { token: 'spacing.4', count: 38, files: ['src/App.tsx'], type: 'spacing', category: 'spacing' },
            { token: 'typography.fontSize.base', count: 32, files: ['src/components/Button.tsx'], type: 'typography', category: 'typography' }
          ],
          unusedTokens: ['colors.secondary.50', 'spacing.24'],
          adoptionRate: 78.8
        },
        changeFrequency: [
          { token: 'colors.primary.500', changeCount: 3, lastChanged: new Date().toISOString(), changes: [] },
          { token: 'spacing.8', changeCount: 2, lastChanged: new Date().toISOString(), changes: [] }
        ],
        categoryBreakdown: {
          colors: { count: 156, tokens: ['colors.primary.500', 'colors.primary.600'] },
          spacing: { count: 89, tokens: ['spacing.4', 'spacing.8'] },
          typography: { count: 45, tokens: ['typography.fontSize.base'] }
        },
        recommendations: [
          {
            type: 'cleanup',
            priority: 'medium',
            message: 'Consider removing 2 unused tokens',
            details: ['colors.secondary.50', 'spacing.24']
          }
        ],
        trends: {
          recentActivity: 5,
          newTokens: 2,
          modifiedTokens: 3
        }
      };
      
      setAnalytics(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">⚠️ Error loading analytics</p>
          <p>{error}</p>
          <button 
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎨 Design System Analytics
          </h1>
          <p className="text-gray-600">
            Generated {new Date(analytics.metadata.generatedAt).toLocaleString()} • 
            Period: {analytics.metadata.period} • 
            Version: {analytics.metadata.version}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Tokens"
            value={analytics.summary.totalTokens}
            icon="📊"
            color="blue"
          />
          <MetricCard
            title="Active Tokens"
            value={analytics.summary.activeTokens}
            icon="✅"
            color="green"
          />
          <MetricCard
            title="Adoption Rate"
            value={`${analytics.summary.adoptionRate.toFixed(1)}%`}
            icon="📈"
            color="purple"
          />
          <MetricCard
            title="Recent Changes"
            value={analytics.summary.totalChanges}
            icon="🔄"
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Used Tokens */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🏆 Most Used Tokens</h2>
            <div className="space-y-3">
              {analytics.summary.mostUsedTokens.slice(0, 8).map((token, index) => (
                <div key={token.token} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">{token.token}</div>
                      <div className="text-sm text-gray-500">{token.files.length} files</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {token.count} uses
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📂 Category Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(analytics.categoryBreakdown).map(([category, data]) => {
                const percentage = (data.count / Object.values(analytics.categoryBreakdown).reduce((sum, cat) => sum + cat.count, 0)) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium capitalize">{category}</span>
                      <span className="text-sm text-gray-600">
                        {data.count} uses ({data.tokens.length} tokens)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations and Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recommendations */}
          {analytics.recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">💡 Recommendations</h2>
              <div className="space-y-3">
                {analytics.recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'bg-red-50 border-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex items-start">
                      <span className="text-lg mr-2">
                        {rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'}
                      </span>
                      <div>
                        <p className="font-medium">{rec.message}</p>
                        {rec.details.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {rec.details.slice(0, 3).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Recent Trends (30 days)</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Recent Activity</span>
                <span className="font-medium">{analytics.trends.recentActivity} changes</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New Tokens</span>
                <span className="font-medium text-green-600">+{analytics.trends.newTokens}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Modified Tokens</span>
                <span className="font-medium text-blue-600">{analytics.trends.modifiedTokens}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unused Tokens Warning */}
        {analytics.summary.unusedTokens.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              ⚠️ Unused Tokens ({analytics.summary.unusedTokens.length})
            </h2>
            <p className="text-yellow-700 mb-3">
              These tokens are defined but not being used in your codebase:
            </p>
            <div className="flex flex-wrap gap-2">
              {analytics.summary.unusedTokens.slice(0, 10).map(token => (
                <span key={token} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {token}
                </span>
              ))}
              {analytics.summary.unusedTokens.length > 10 && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  +{analytics.summary.unusedTokens.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-xl mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemDashboard; 