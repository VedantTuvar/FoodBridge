import React, { useState } from 'react';
import { Heading } from '../../components/atoms/Typography';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';

export const AdminReportsPage: React.FC = () => {
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const reportsList = [
    { id: 'csr-monthly', title: 'Corporate CSR & Impact Compliance Report', period: 'July 2026', format: 'PDF / CSV', desc: 'Aggregated food redistribution stats, CO₂ offsets, and tax-deductible donation certificate details.' },
    { id: 'ngo-audit', title: 'NGO Verification & Governance Audit Trail', period: 'YTD 2026', format: 'CSV', desc: 'Complete breakdown of verified NGOs, rejected applications, background document checks, and status changes.' },
    { id: 'waste-reduction', title: 'Municipal Food Waste Reduction Ledger', period: 'Q2 2026', format: 'PDF', desc: 'City-wide surplus food diversion stats formatted for municipal environmental policy reporting.' },
    { id: 'volunteer-perf', title: 'Volunteer Fleet & Delivery Performance Log', period: 'Last 30 Days', format: 'CSV / JSON', desc: 'Log of pickup turnaround times, route fulfillment rates, rating distribution, and active volunteers.' },
  ];

  const triggerDownload = (reportTitle: string, format: string) => {
    setDownloadMsg(`Generating ${reportTitle} (${format})... Export downloaded successfully.`);
    setTimeout(() => setDownloadMsg(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Heading level={2}>Reports & Compliance Exporter</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Generate certified audit exports, CSR compliance packages, and municipal food-waste reports.
        </p>
      </div>

      {downloadMsg && (
        <Callout type="teal" title="Export Completed">
          {downloadMsg}
        </Callout>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reportsList.map(rep => (
          <div key={rep.id} style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>📄 {rep.title}</h3>
                <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  Coverage Period: <strong>{rep.period}</strong> • Formats Available: <code>{rep.format}</code>
                </div>
                <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--ink-soft)' }}>
                  {rep.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Button size="small" variant="primary" onClick={() => triggerDownload(rep.title, 'PDF')}>
                  ⬇ Download PDF
                </Button>
                <Button size="small" variant="outline" onClick={() => triggerDownload(rep.title, 'CSV')}>
                  📊 Export CSV
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
