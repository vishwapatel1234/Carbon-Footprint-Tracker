import {
  KG_CO2_PER_KM_CAR,
  KG_CO2_PER_KM_BUS,
  KG_CO2_PER_KM_TRAIN,
  KG_CO2_PER_KM_BIKE,
  KG_CO2_PER_BEEF_MEAL,
  KG_CO2_PER_CHICKEN_MEAL,
  KG_CO2_PER_VEGAN_MEAL,
  KG_CO2_PER_KWH,
  KG_CO2_PER_ONLINE_PURCHASE,
  KG_CO2_PER_FLIGHT_HOUR,
  INDIA_AVERAGE_ANNUAL_KG,
  WORLD_AVERAGE_ANNUAL_KG
} from './constants.js';

/**
 * Calculate total weekly CO2 footprint from user inputs.
 * @param {Object} inputs - { transportKm, transportMode, meatMeals, dietType, energyKwh, purchases, flightHours }
 * @returns {Object} - { total, breakdown: { transport, diet, energy, shopping, flights } }
 */
export const calculateFootprint = (inputs) => {
  const km = Number(inputs.transportKm) || 0;
  const mode = inputs.transportMode || 'car';
  let transportFactor = KG_CO2_PER_KM_CAR;
  if (mode === 'bus') transportFactor = KG_CO2_PER_KM_BUS;
  else if (mode === 'train') transportFactor = KG_CO2_PER_KM_TRAIN;
  else if (mode === 'bike') transportFactor = KG_CO2_PER_KM_BIKE;

  const transport = km * transportFactor;

  const meals = Number(inputs.meatMeals) || 0;
  const diet = meals * KG_CO2_PER_BEEF_MEAL + (21 - meals) * (inputs.dietType === 'vegan' ? KG_CO2_PER_VEGAN_MEAL : KG_CO2_PER_CHICKEN_MEAL);

  const energy = (Number(inputs.energyKwh) || 0) * KG_CO2_PER_KWH;
  const shopping = (Number(inputs.purchases) || 0) * KG_CO2_PER_ONLINE_PURCHASE;
  const flights = (Number(inputs.flightHours) || 0) * KG_CO2_PER_FLIGHT_HOUR;

  const total = transport + diet + energy + shopping + flights;

  return {
    total: Math.round(total * 10) / 10,
    breakdown: {
      transport: Math.round(transport * 10) / 10,
      diet: Math.round(diet * 10) / 10,
      energy: Math.round(energy * 10) / 10,
      shopping: Math.round(shopping * 10) / 10,
      flights: Math.round(flights * 10) / 10
    }
  };
};

/**
 * Compare user footprint to India/World average.
 * @param {number} userKgPerWeek
 * @returns {Object} - { vsIndia: number, vsWorld: number, percentile: string }
 */
export const compareToAverage = (userKgPerWeek) => {
  const indiaWeekly = INDIA_AVERAGE_ANNUAL_KG / 52;
  const worldWeekly = WORLD_AVERAGE_ANNUAL_KG / 52;

  const vsIndia = Math.round(((userKgPerWeek - indiaWeekly) / indiaWeekly) * 100);
  const vsWorld = Math.round(((userKgPerWeek - worldWeekly) / worldWeekly) * 100);

  let percentile = 'Average';
  if (userKgPerWeek < indiaWeekly * 0.7) {
    percentile = 'Top 10% Eco-Hero';
  } else if (userKgPerWeek < worldWeekly * 0.8) {
    percentile = 'Better than most';
  } else {
    percentile = 'High Carbon Footprint';
  }

  return { vsIndia, vsWorld, percentile };
};

/**
 * Find the single highest-impact category for this user.
 * @param {Object} breakdown - { transport, diet, energy, shopping, flights }
 * @returns {string} - category name
 */
export const getHighestImpactCategory = (breakdown) => {
  let highestVal = -1;
  let highestCat = 'transport';

  Object.entries(breakdown).forEach(([cat, val]) => {
    if (val > highestVal) {
      highestVal = val;
      highestCat = cat;
    }
  });

  return highestCat;
};

/**
 * Format kg CO2 for display (round to 1 decimal, add unit).
 * @param {number} kg
 * @returns {string} - "12.3 kg CO₂"
 */
export const formatCO2 = (kg) => {
  const val = Number(kg) || 0;
  return `${val.toFixed(1)} kg CO₂`;
};

/**
 * Calculate streak from history array.
 * @param {Array} entries - array of { date, total }
 * @returns {number} - current streak in days
 */
export const calculateStreak = (entries) => {
  if (!Array.isArray(entries) || entries.length === 0) return 0;
  
  // Sort entries descending by date
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let streak = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  let lastDate = null;

  for (let i = 0; i < sorted.length; i++) {
    const entryDate = new Date(sorted[i].date);
    entryDate.setHours(0, 0, 0, 0);

    if (lastDate === null) {
      const diffTime = Math.abs(today - entryDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If the most recent entry is older than yesterday, streak is broken (0)
      if (diffDays > 1) {
        break;
      }
      streak = 1;
      lastDate = entryDate;
    } else {
      const diffTime = Math.abs(lastDate - entryDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
        lastDate = entryDate;
      } else if (diffDays > 1) {
        break;
      }
    }
  }

  return streak;
};

/**
 * Calculate week-over-week change.
 * @param {Array} entries
 * @returns {number} - percentage change (negative = improvement)
 */
export const calculateTrend = (entries) => {
  if (!Array.isArray(entries) || entries.length < 2) return 0;
  
  // Sort ascending by date
  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const current = sorted[sorted.length - 1].total;
  const previous = sorted[sorted.length - 2].total;

  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};
