// 1. React imports
import { useState } from 'react';

// 2. Third-party imports
import PropTypes from 'prop-types';

// 3. Internal imports
import { formatCO2 } from '../utils/carbon.js';
import { INDIA_AVERAGE_ANNUAL_KG, WORLD_AVERAGE_ANNUAL_KG } from '../utils/constants.js';

// 4. PropTypes object declaration
const progressTrackerPropTypes = {
  streak: PropTypes.number.isRequired,
  trend: PropTypes.number.isRequired,
  history: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired
  })).isRequired,
  pledges: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    action: PropTypes.string.isRequired,
    savingKg: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired
  })).isRequired,
  onTogglePledge: PropTypes.func.isRequired,
  onClearHistory: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    country: PropTypes.string
  }).isRequired
};

// 5. Component function
const ProgressTracker = ({
  streak,
  trend,
  history,
  pledges,
  onTogglePledge,
  onClearHistory,
  profile
}) => {
  const latestTotal = history.length > 0 ? history[0].total : 0;
  
  // Annualized user rate vs national benchmarks
  const userAnnualized = latestTotal * 52;
  const indiaRatio = userAnnualized / INDIA_AVERAGE_ANNUAL_KG;
  
  // Calculate total savings from completed pledges
  const totalSaved = pledges
    .filter((p) => p.completed)
    .reduce((sum, p) => sum + p.savingKg, 0);

  return (
    <div className="panel">
      <h2 className="panel__title">🏆 Performance Dashboard</h2>

      {/* Streak and Trend Badges */}
      <div className="badge-container">
        <div className="stat-badge">
          <span className="stat-badge__val stat-badge__val--green">{streak} Days</span>
          <span className="stat-badge__lbl">Logging Streak</span>
        </div>
        <div className="stat-badge">
          <span className={`stat-badge__val ${trend <= 0 ? 'stat-badge__val--green' : ''}`}>
            {trend > 0 ? `+${trend}` : trend}%
          </span>
          <span className="stat-badge__lbl">vs Last Week</span>
        </div>
        {totalSaved > 0 && (
          <div className="stat-badge">
            <span className="stat-badge__val stat-badge__val--green">{totalSaved.toFixed(1)} kg</span>
            <span className="stat-badge__lbl">Carbon Offset</span>
          </div>
        )}
      </div>

      {/* Benchmarking Comparison details */}
      {latestTotal > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="panel__title" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>🌍 Benchmark Insights</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your transport/lifestyle emissions scale to <strong>{Math.round(userAnnualized)} kg CO₂/year</strong>.
          </p>
          <div className="benchmark-meter">
            <div 
              className="benchmark-meter__fill" 
              style={{ width: `${Math.min(100, Math.max(10, (userAnnualized / WORLD_AVERAGE_ANNUAL_KG) * 100))}%` }} 
            />
          </div>
          <div className="benchmark-labels">
            <span>Eco-Hero (0 kg)</span>
            <span>India Avg ({INDIA_AVERAGE_ANNUAL_KG} kg)</span>
            <span>World Avg ({WORLD_AVERAGE_ANNUAL_KG} kg)</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', marginTop: '0.75rem', fontWeight: 500 }}>
            {indiaRatio > 1 
              ? `⚠️ Your carbon footprints scale at ${indiaRatio.toFixed(1)}x the average Indian's annual level.` 
              : `🎉 Awesome! Your footprint is under the Indian average.`}
          </div>
        </div>
      )}

      {/* Commitments Checklist */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 className="panel__title" style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>🤝 Active Carbon Commitments</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Check off actions as you execute them this week.
        </p>
        
        {pledges.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No active pledges. Commit to an action from the AI panel.
          </div>
        ) : (
          <div className="pledge-list">
            {pledges.map((pledge) => (
              <div key={pledge.id} className="pledge-item">
                <button
                  type="button"
                  className={`pledge-item__checkbox ${pledge.completed ? 'pledge-item__checkbox--checked' : ''}`}
                  onClick={() => onTogglePledge(pledge.id)}
                >
                  {pledge.completed && <span className="pledge-item__checkmark">✓</span>}
                </button>
                <div className="pledge-item__content">
                  <span className={`pledge-item__text ${pledge.completed ? 'pledge-item__text--checked' : ''}`}>
                    {pledge.action}
                  </span>
                  <span className="pledge-item__savings">
                    -{pledge.savingKg.toFixed(1)} kg CO₂
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Trend List */}
      <div>
        <h3 className="panel__title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>📜 Log History</h3>
        {history.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No entries logged yet.</div>
        ) : (
          <div className="history-list">
            {history.map((entry, idx) => (
              <div key={idx} className="history-item">
                <span className="history-item__date">
                  {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="history-item__val">{formatCO2(entry.total)}</span>
              </div>
            ))}
            <button 
              type="button" 
              className="btn btn--danger" 
              onClick={onClearHistory}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Reset History Logs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ProgressTracker.propTypes = progressTrackerPropTypes;

// 6. Default export
export default ProgressTracker;
