// 1. React imports
import { useState } from 'react';

// 2. Third-party imports
import PropTypes from 'prop-types';

// 3. Internal imports (none)

// 4. PropTypes object declaration
const actionCardPropTypes = {
  action: PropTypes.string.isRequired,
  savingKg: PropTypes.number.isRequired,
  difficulty: PropTypes.string,
  timeToImpact: PropTypes.string,
  onCommit: PropTypes.func.isRequired
};

// 5. Component function
const ActionCard = ({ action, savingKg, difficulty = 'easy', timeToImpact = 'this week', onCommit }) => {
  const [committed, setCommitted] = useState(false);

  const handleCommit = () => {
    if (!committed) {
      onCommit({
        id: Date.now(),
        action,
        savingKg,
        difficulty,
        completed: false
      });
      setCommitted(true);
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'hard') return 'var(--accent-red)';
    if (diff === 'medium') return 'var(--accent-orange)';
    return 'var(--accent-green)';
  };

  return (
    <div className="action-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="action-card__badge">High Impact Recommendation</span>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
          <span style={{ color: getDifficultyColor(difficulty) }}>
            {difficulty.toUpperCase()}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--accent-teal)' }}>{timeToImpact}</span>
        </div>
      </div>

      <div className="action-card__title">{action}</div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <div>
          <div className="action-card__savings">-{savingKg.toFixed(1)} kg CO₂</div>
          <div className="action-card__desc">Estimated weekly saving</div>
        </div>
        
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleCommit}
          disabled={committed}
          style={{
            background: committed ? 'rgba(16,185,129,0.1)' : undefined,
            color: committed ? 'var(--accent-green)' : undefined,
            border: committed ? '1px solid rgba(16,185,129,0.3)' : undefined,
            boxShadow: committed ? 'none' : undefined
          }}
        >
          {committed ? '✓ Committed' : 'Commit to Action'}
        </button>
      </div>
    </div>
  );
};

ActionCard.propTypes = actionCardPropTypes;

// 6. Default export
export default ActionCard;
