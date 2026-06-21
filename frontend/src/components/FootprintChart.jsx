// 1. React imports
import { useState } from 'react';

// 2. Third-party imports
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// 3. Internal imports
import { formatCO2 } from '../utils/carbon.js';
import { INDIA_AVERAGE_ANNUAL_KG, WORLD_AVERAGE_ANNUAL_KG } from '../utils/constants.js';

// 4. PropTypes object declaration
const footprintChartPropTypes = {
  breakdown: PropTypes.shape({
    transport: PropTypes.number.isRequired,
    diet: PropTypes.number.isRequired,
    energy: PropTypes.number.isRequired,
    shopping: PropTypes.number.isRequired,
    flights: PropTypes.number.isRequired
  }).isRequired,
  total: PropTypes.number.isRequired
};

// 5. Component function
const FootprintChart = ({ breakdown, total }) => {
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown' | 'comparison'

  const chartData = [
    { name: 'Transport', value: breakdown.transport, color: '#06b6d4' },
    { name: 'Diet', value: breakdown.diet, color: '#10b981' },
    { name: 'Energy', value: breakdown.energy, color: '#f97316' },
    { name: 'Shopping', value: breakdown.shopping, color: '#a855f7' },
    { name: 'Flights', value: breakdown.flights, color: '#3b82f6' }
  ].filter(item => item.value > 0);

  // Compare user's annualized footprint vs India and World average
  const userAnnualized = total * 52;
  const comparisonData = [
    { name: 'Your Level', amount: Math.round(userAnnualized), fill: '#10b981' },
    { name: 'India Avg', amount: INDIA_AVERAGE_ANNUAL_KG, fill: '#64748b' },
    { name: 'World Avg', amount: WORLD_AVERAGE_ANNUAL_KG, fill: '#3b82f6' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: 0, color: '#f8fafc', fontWeight: 600 }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: '#10b981' }}>{formatCO2(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.object)
  };

  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="panel__title" style={{ marginBottom: 0 }}>📊 Footprint Analysis</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn--secondary ${activeTab === 'breakdown' ? 'app-header__link--active' : ''}`}
            onClick={() => setActiveTab('breakdown')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            Breakdown
          </button>
          <button
            type="button"
            className={`btn btn--secondary ${activeTab === 'comparison' ? 'app-header__link--active' : ''}`}
            onClick={() => setActiveTab('comparison')}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            Benchmarks
          </button>
        </div>
      </div>

      {activeTab === 'breakdown' ? (
        <div className="chart-container">
          {chartData.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>No emissions logged yet.</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-center-label">
                <div className="chart-center-label__val">{total.toFixed(1)}</div>
                <div className="chart-center-label__lbl">kg CO₂/wk</div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem 1.25rem', marginTop: '1rem' }}>
                {chartData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ color: '#94a3b8' }}>{item.name}:</span>
                    <span style={{ fontWeight: 600 }}>{item.value.toFixed(1)} kg</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="chart-container" style={{ padding: '1rem 0' }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" kg" />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {comparisonData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>
            Comparative Per Capita Annual Emissions (kg CO₂ / year)
          </div>
        </div>
      )}
    </div>
  );
};

FootprintChart.propTypes = footprintChartPropTypes;

// 6. Default export
export default FootprintChart;
