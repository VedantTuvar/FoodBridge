import React, { useEffect, useState } from 'react';
import { Heading } from '../components/atoms/Typography';
import { Button } from '../components/atoms/Button';
import { analyticsApi, ChartDataResponse } from '../api/analyticsApi';

export const AnalyticsChartsPage: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'ytd'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharts();
  }, [timeRange]);

  const fetchCharts = async () => {
    try {
      const data = await analyticsApi.getChartData();
      setChartData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Analytics Charts...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--teal)', fontWeight: 600, textTransform: 'uppercase' }}>
            📊 VISUAL ANALYTICS
          </span>
          <Heading level={2}>Data Charts & Fulfillment Dynamics</Heading>
          <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
            Visual data visualizations of surplus food flow, category distribution, and delivery status performance.
          </p>
        </div>

        {/* Time Range Selector */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['7d', '30d', 'ytd'] as const).map(range => (
            <Button
              key={range}
              size="small"
              variant={timeRange === range ? 'primary' : 'outline'}
              onClick={() => setTimeRange(range)}
            >
              {range.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        
        {/* Weekly Volume Bar Chart */}
        <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
          <Heading level={3}>Weekly Food Rescued (kg)</Heading>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '220px', marginTop: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
            {chartData?.weekly_volume.map((item, i) => {
              const heightPercent = Math.min(100, (item.kg / 2500) * 100);
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: '4px' }}>{item.kg}kg</div>
                  <div style={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    backgroundColor: i === 5 ? 'var(--amber)' : 'var(--teal)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }} />
                  <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '8px' }}>{item.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Food Categories Breakdown */}
        <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
          <Heading level={3}>Surplus Food Category Distribution</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
            {chartData?.food_categories.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                  <strong>{cat.category}</strong>
                  <span style={{ fontWeight: 600, color: 'var(--teal)' }}>{cat.percentage}%</span>
                </div>
                <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--paper-alt)', borderRadius: '6px' }}>
                  <div style={{
                    width: `${cat.percentage}%`,
                    height: '100%',
                    backgroundColor: i === 0 ? 'var(--teal)' : i === 1 ? 'var(--amber)' : i === 2 ? 'var(--green-soft)' : '#6c757d',
                    borderRadius: '6px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
