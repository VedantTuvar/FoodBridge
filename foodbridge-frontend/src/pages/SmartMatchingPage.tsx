import React, { useState } from 'react';
import { Heading } from '../components/atoms/Typography';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';
import { analyticsApi, SmartMatchCandidate, DemandPredictionResult } from '../api/analyticsApi';

export const SmartMatchingPage: React.FC = () => {
  const [quantityKg, setQuantityKg] = useState('35');
  const [perishabilityHours, setPerishabilityHours] = useState('3');
  const [district, setDistrict] = useState('Central District');
  const [dayOfWeek, setDayOfWeek] = useState('Friday');

  const [matches, setMatches] = useState<SmartMatchCandidate[]>([]);
  const [prediction, setPrediction] = useState<DemandPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleRunSmartMatching = async () => {
    setLoading(true);
    try {
      const [candidates, predData] = await Promise.all([
        analyticsApi.getSmartMatches(parseFloat(quantityKg), parseFloat(perishabilityHours)),
        analyticsApi.predictDemand(district, dayOfWeek)
      ]);
      setMatches(candidates);
      setPrediction(predData);
      setMsg('AI Smart Matching Engine computed optimal NGO match rankings.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--amber)', fontWeight: 600, textTransform: 'uppercase' }}>
          🤖 AI-READY PREDICTION ARCHITECTURE
        </span>
        <Heading level={2}>Smart Matching & Demand Forecasting Engine</Heading>
        <p style={{ color: 'var(--ink-soft)', marginTop: '4px' }}>
          Multi-factor AI scoring algorithm ranking NGO candidates by distance, capacity fit, perishability urgency, and reliability.
        </p>
      </div>

      {msg && <Callout type="teal" title="AI Recommendation Ready">{msg}</Callout>}

      {/* Input Parameters Workbench */}
      <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '24px' }}>
        <Heading level={3}>Donation & Location Parameters</Heading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Food Quantity (kg):</label>
            <input
              type="number"
              value={quantityKg}
              onChange={(e) => setQuantityKg(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--line)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Perishability Window (hours):</label>
            <input
              type="number"
              value={perishabilityHours}
              onChange={(e) => setPerishabilityHours(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--line)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Target District:</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--line)' }}
            >
              <option value="Central District">Central District</option>
              <option value="West Bay Hub">West Bay Hub</option>
              <option value="Northside Sector">Northside Sector</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Forecast Day:</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--line)' }}
            >
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button variant="primary" onClick={handleRunSmartMatching} disabled={loading}>
            {loading ? '⚡ Computing AI Match Scores...' : '🤖 Execute Smart Matching Engine'}
          </Button>
        </div>
      </div>

      {/* AI Demand Prediction Card */}
      {prediction && (
        <div style={{ backgroundColor: '#fffdf5', border: '1px solid var(--amber)', borderRadius: '6px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase' }}>
                🔮 AI PREDICTIVE DEMAND FORECAST
              </div>
              <h3 style={{ margin: '4px 0', fontSize: '18px' }}>
                Forecasted Demand for {prediction.district} ({prediction.day_of_week})
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', margin: 0 }}>
                Predicted Shelter Demand: <strong>{prediction.predicted_demand_kg} kg</strong> (~{prediction.predicted_meals} meals) • Peak Window: <strong>{prediction.peak_time_window}</strong>
              </p>
            </div>
            <span style={{ padding: '6px 12px', backgroundColor: 'var(--amber)', color: '#fff', fontWeight: 700, borderRadius: '20px', fontSize: '12px' }}>
              {(prediction.confidence_score * 100).toFixed(0)}% AI Confidence
            </span>
          </div>
        </div>
      )}

      {/* Ranked Candidate List */}
      {matches.length > 0 && (
        <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--line)', borderRadius: '6px', padding: '24px' }}>
          <Heading level={3}>Ranked NGO Candidate Recommendations</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {matches.map((ngo, i) => (
              <div key={ngo.ngo_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--paper-alt)', borderRadius: '6px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '24px', height: '24px', backgroundColor: i === 0 ? 'var(--teal)' : 'var(--ink-soft)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                      #{i + 1}
                    </span>
                    <strong style={{ fontSize: '16px' }}>{ngo.organization_name}</strong>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                    {ngo.address} • Distance: <strong>{ngo.distance_km} km</strong> • Capacity: <strong>{ngo.capacity_per_day} meals/day</strong> • Rating: ⭐ {ngo.rating_avg}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--teal)', marginTop: '2px', fontWeight: 600 }}>
                    💡 Rationale: {ngo.recommendation_reason}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--teal)' }}>{ngo.match_score_percentage}%</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>MATCH SCORE</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
