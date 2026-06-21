// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports (none)

// 3. Internal imports
import Onboarding from './components/Onboarding.jsx';
import FootprintForm from './components/FootprintForm.jsx';
import FootprintChart from './components/FootprintChart.jsx';
import AIInsight from './components/AIInsight.jsx';
import ProgressTracker from './components/ProgressTracker.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useHistory } from './hooks/useHistory.js';
import { useFootprint } from './hooks/useFootprint.js';
import { calculateFootprint } from './utils/carbon.js';
import { getPledges, savePledges } from './utils/storage.js';
import './styles/main.css';

// 4. PropTypes object declaration (none)

// 5. Component function
function App() {
  const {
    history,
    profile,
    streak,
    trend,
    addEntry,
    updateProfile,
    clearAllHistory
  } = useHistory();

  const {
    insight,
    loading,
    error: apiError,
    fetchInsight
  } = useFootprint();

  const [pledges, setPledges] = useState([]);
  const [currentBreakdown, setCurrentBreakdown] = useState({
    total: 0,
    breakdown: { transport: 0, diet: 0, energy: 0, shopping: 0, flights: 0 }
  });

  // Simulator state: real-time sliders
  const [simKm, setSimKm] = useState(50);
  const [simMeals, setSimMeals] = useState(2);
  const [simEnergy, setSimEnergy] = useState(120);
  const [simFlights, setSimFlights] = useState(0);

  // Initialize pledges and calculations from history
  useEffect(() => {
    setPledges(getPledges());
    if (history.length > 0) {
      const latest = history[0];
      setCurrentBreakdown({
        total: latest.total,
        breakdown: latest.breakdown
      });
      // Sync simulator with last inputs
      setSimKm(latest.inputs.transportKm || 0);
      setSimMeals(latest.inputs.meatMeals || 0);
      setSimEnergy(latest.inputs.energyKwh || 0);
      setSimFlights(latest.inputs.flightHours || 0);
    }
  }, [history]);

  const handleOnboardingComplete = (newProfile) => {
    updateProfile(newProfile);
  };

  const handleFormSubmit = async (inputs) => {
    const calculated = calculateFootprint(inputs);
    
    const entry = {
      date: new Date().toISOString(),
      inputs,
      total: calculated.total,
      breakdown: calculated.breakdown
    };

    // Save to local history
    addEntry(entry);

    // Identify highest impact category
    let highestCat = 'transport';
    let maxVal = -1;
    Object.entries(calculated.breakdown).forEach(([cat, val]) => {
      if (val > maxVal) {
        maxVal = val;
        highestCat = cat;
      }
    });

    // Request AI insights from server
    await fetchInsight(profile, inputs, history, calculated.breakdown, highestCat);
  };

  // Commit a recommendation to active pledges list
  const handleCommitPledge = (newPledge) => {
    const updated = [newPledge, ...pledges];
    setPledges(updated);
    savePledges(updated);
  };

  const handleTogglePledge = (id) => {
    const updated = pledges.map((p) =>
      p.id === id ? { ...p, completed: !p.completed } : p
    );
    setPledges(updated);
    savePledges(updated);
  };

  // Calculate simulated real-time carbon total
  const simulatedResult = calculateFootprint({
    transportKm: simKm,
    transportMode: history[0]?.inputs?.transportMode || profile?.commuteMode || 'car',
    meatMeals: simMeals,
    dietType: history[0]?.inputs?.dietType || profile?.dietType || 'chicken',
    energyKwh: simEnergy,
    purchases: history[0]?.inputs?.purchases || 2,
    flightHours: simFlights
  });

  const handleResetProfile = () => {
    if (window.confirm('Are you sure you want to reset your profile and history?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Render Onboarding Screen if profile is missing
  if (!profile) {
    return (
      <ErrorBoundary>
        <Onboarding onComplete={handleOnboardingComplete} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <header className="app-header">
        <div className="app-header__logo">
          <div className="app-header__logo-dot" />
          EcoPulse
        </div>
        <nav className="app-header__nav">
          <button type="button" className="app-header__link app-header__link--active">
            Dashboard
          </button>
          <button type="button" className="app-header__link" onClick={handleResetProfile}>
            Reset Profile
          </button>
        </nav>
      </header>

      <main className="app-container">
        <div className="dashboard-grid">
          {/* Left Panel: Log Form & Real-time Simulator */}
          <div>
            <FootprintForm onSubmit={handleFormSubmit} profile={profile} />

            {/* What-If Simulator Card */}
            <div className="panel simulator">
              <h3 className="panel__title" style={{ color: 'var(--accent-teal)' }}>
                🛠️ What-If Carbon Simulator
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Drag sliders below to see how reducing habits affects your weekly total in real-time.
              </p>

              <div className="slider-group">
                <div className="slider-group__header">
                  <span>Transport Distance</span>
                  <span>{simKm} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  className="slider-input"
                  value={simKm}
                  onChange={(e) => setSimKm(Number(e.target.value))}
                />
              </div>

              <div className="slider-group">
                <div className="slider-group__header">
                  <span>Beef/Red Meat Meals</span>
                  <span>{simMeals} meals</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="21"
                  step="1"
                  className="slider-input"
                  value={simMeals}
                  onChange={(e) => setSimMeals(Number(e.target.value))}
                />
              </div>

              <div className="slider-group">
                <div className="slider-group__header">
                  <span>Electricity Usage</span>
                  <span>{simEnergy} kWh</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  className="slider-input"
                  value={simEnergy}
                  onChange={(e) => setSimEnergy(Number(e.target.value))}
                />
              </div>

              <div className="slider-group">
                <div className="slider-group__header">
                  <span>Weekly Flight Hours</span>
                  <span>{simFlights} hrs</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  className="slider-input"
                  value={simFlights}
                  onChange={(e) => setSimFlights(Number(e.target.value))}
                />
              </div>

              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Projected Total:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
                  {simulatedResult.total.toFixed(1)} kg CO₂/wk
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Charts, AI insights, and Progress Checklists */}
          <div>
            <FootprintChart
              breakdown={currentBreakdown.breakdown}
              total={currentBreakdown.total}
            />

            <AIInsight
              insight={insight}
              loading={loading}
              error={apiError}
              onCommit={handleCommitPledge}
            />

            <ProgressTracker
              streak={streak}
              trend={trend}
              history={history}
              pledges={pledges}
              onTogglePledge={handleTogglePledge}
              onClearHistory={clearAllHistory}
              profile={profile}
            />
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}

// 6. Default export
export default App;
