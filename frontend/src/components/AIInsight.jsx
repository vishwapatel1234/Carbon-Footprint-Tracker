// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import PropTypes from 'prop-types';

// 3. Internal imports
import ActionCard from './ActionCard.jsx';

// 4. PropTypes object declaration
const aiInsightPropTypes = {
  insight: PropTypes.shape({
    recommendation: PropTypes.string,
    action: PropTypes.string,
    estimatedSavingKg: PropTypes.number,
    category: PropTypes.string,
    difficulty: PropTypes.string,
    timeToImpact: PropTypes.string
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onCommit: PropTypes.func.isRequired
};

// 5. Component function
const AIInsight = ({ insight, loading, error, onCommit }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset typewriter when new insight arrives
  useEffect(() => {
    if (insight && insight.recommendation) {
      setDisplayText('');
      setCurrentIndex(0);
    }
  }, [insight]);

  // Typewriter effect logic
  useEffect(() => {
    if (insight && insight.recommendation && currentIndex < insight.recommendation.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + insight.recommendation[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 15); // Faster typewriter speed
      return () => clearTimeout(timeout);
    }
  }, [insight, currentIndex]);

  if (loading) {
    return (
      <div className="panel" style={{ minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ height: '20px', width: '40%', background: 'var(--bg-tertiary)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          <div style={{ height: '14px', width: '90%', background: 'var(--bg-tertiary)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          <div style={{ height: '14px', width: '80%', background: 'var(--bg-tertiary)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          <div style={{ height: '14px', width: '85%', background: 'var(--bg-tertiary)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.3; }
            100% { opacity: 0.6; }
          }
        `}} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ color: 'var(--accent-red)', marginBottom: '0.5rem' }}>⚠️ Insight Retrival Failed</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Submit a daily/weekly log on the left to receive AI-powered, high-impact suggestions tailored to your footprint breakdown.
        </p>
      </div>
    );
  }

  const isTypingDone = currentIndex >= (insight.recommendation ? insight.recommendation.length : 0);

  return (
    <div className="panel" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="panel__title" style={{ margin: 0 }}>🧠 Personalized AI Co₂ Coach</h3>
        <span className="action-card__badge" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-teal)', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
          {insight.category}
        </span>
      </div>

      <div style={{ minHeight: '60px', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          <span className="typewriter-text">{displayText}</span>
        </p>
      </div>

      {isTypingDone && (
        <ActionCard
          action={insight.action}
          savingKg={insight.estimatedSavingKg}
          difficulty={insight.difficulty}
          timeToImpact={insight.timeToImpact}
          onCommit={onCommit}
        />
      )}
    </div>
  );
};

AIInsight.propTypes = aiInsightPropTypes;

// 6. Default export
export default AIInsight;
