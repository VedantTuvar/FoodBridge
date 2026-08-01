import React, { useState } from 'react';
import { Heading } from '../components/atoms/Typography';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';
import { analyticsApi } from '../api/analyticsApi';

export const ReportsPage: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const reportCategories = [
    { key: 'donation', title: '📦 Donation Activity Report', desc: 'Listing frequency, food categories, perishability windows, and rescue completion rates.' },
    { key: 'volunteer', title: '🛵 Volunteer Fleet & Logistics Report', desc: 'Driver fulfillment efficiency, pickup turnaround times, and route completion logs.' },
    { key: 'ngo', title: '🏢 NGO Compliance & Claim Audit', desc: 'Verified NGO claim history, capacity utilization, and physical verification audit logs.' },
    { key: 'corporate', title: '🏬 Corporate CSR Tax Compliance Report', desc: 'Corporate donor contributions, tax-deductible valuation, and branch-level summary.' },
    { key: 'csr', title: '🌱 ESG & Environmental Audit Report', desc: 'CO₂ offset certificates, water footprint calculations, and municipal waste diversion stats.' },
  ];

  const handleGenerateReport = async (key: string, title: string) => {
    const res = await analyticsApi.generateReport(key, { format: selectedFormat });
    setDownloadMsg(`Generated ${title} in ${selectedFormat.toUpperCase()} format. Export downloaded.`);
    setTimeout(() => setDownloadMsg(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--teal)', fontWeight: 600, textTransform: 'uppercase' }}>
          📄 AUDIT & COMPLIANCE
        </span>
        <Heading level={2}>Multi-Domain Report Generator</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Export certified analytical reports for corporate CSR compliance, municipal waste audits, and volunteer fleet operations.
        </p>
      </div>

      {downloadMsg && <Callout type="teal" title="Report Generated">{downloadMsg}</Callout>}

      {/* Format Selector Bar */}
      <div style={{ padding: '16px', backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Preferred Export Format:</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['pdf', 'csv', 'json'] as const).map(fmt => (
            <Button
              key={fmt}
              size="small"
              variant={selectedFormat === fmt ? 'primary' : 'outline'}
              onClick={() => setSelectedFormat(fmt)}
            >
              {fmt.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Report Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reportCategories.map(cat => (
          <div key={cat.key} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '6px' }}>{cat.desc}</p>
              </div>
              <Button size="small" variant="primary" onClick={() => handleGenerateReport(cat.key, cat.title)}>
                ⬇ Generate {selectedFormat.toUpperCase()} Report
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
