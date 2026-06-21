// 1. React imports
import { useState } from 'react';

// 2. Third-party imports
import PropTypes from 'prop-types';

// 3. Internal imports
import {
  validateKm,
  validateMeals,
  validateEnergy,
  validatePurchases,
  validateFlights
} from '../utils/validation.js';

// 4. PropTypes object declaration
const footprintFormPropTypes = {
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    commuteMode: PropTypes.string,
    dietType: PropTypes.string
  }).isRequired
};

// 5. Component function
const FootprintForm = ({ onSubmit, profile }) => {
  const [inputs, setInputs] = useState({
    transportKm: '50',
    transportMode: profile.commuteMode || 'car',
    meatMeals: profile.dietType === 'beef' ? '5' : '2',
    dietType: profile.dietType || 'chicken',
    energyKwh: '120',
    purchases: '3',
    flightHours: '0'
  });

  const [errors, setErrors] = useState({
    transportKm: null,
    meatMeals: null,
    energyKwh: null,
    purchases: null,
    flightHours: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Run validations
    const kmValid = validateKm(inputs.transportKm);
    const mealsValid = validateMeals(inputs.meatMeals);
    const energyValid = validateEnergy(inputs.energyKwh);
    const purchasesValid = validatePurchases(inputs.purchases);
    const flightsValid = validateFlights(inputs.flightHours);

    if (!kmValid.valid || !mealsValid.valid || !energyValid.valid || !purchasesValid.valid || !flightsValid.valid) {
      setErrors({
        transportKm: kmValid.error,
        meatMeals: mealsValid.error,
        energyKwh: energyValid.error,
        purchases: purchasesValid.error,
        flightHours: flightsValid.error
      });
      return;
    }

    // Convert inputs to numbers, fallback to 0 if empty or NaN
    const parsedInputs = {
      transportKm: Number(inputs.transportKm) || 0,
      transportMode: inputs.transportMode,
      meatMeals: Number(inputs.meatMeals) || 0,
      dietType: inputs.dietType,
      energyKwh: Number(inputs.energyKwh) || 0,
      purchases: Number(inputs.purchases) || 0,
      flightHours: Number(inputs.flightHours) || 0
    };

    onSubmit(parsedInputs);
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2 className="panel__title">⚡ Weekly Footprint Logger</h2>
      
      <div className="form-group">
        <label className="form-label" htmlFor="transportKm">Transport Distance (km / week)</label>
        <input
          id="transportKm"
          name="transportKm"
          type="number"
          className="form-input"
          value={inputs.transportKm}
          onChange={handleChange}
        />
        {errors.transportKm && <span className="form-error-msg">{errors.transportKm}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="transportMode">Commute Mode</label>
        <select
          id="transportMode"
          name="transportMode"
          className="form-select"
          value={inputs.transportMode}
          onChange={handleChange}
        >
          <option value="car">Petrol Car</option>
          <option value="bus">Public Bus</option>
          <option value="train">Train / Metro</option>
          <option value="bike">Bicycle / Walk</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="meatMeals">Beef / Red Meat Meals (meals / week)</label>
        <input
          id="meatMeals"
          name="meatMeals"
          type="number"
          className="form-input"
          value={inputs.meatMeals}
          onChange={handleChange}
        />
        {errors.meatMeals && <span className="form-error-msg">{errors.meatMeals}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="dietType">Alternative Meals Category</label>
        <select
          id="dietType"
          name="dietType"
          className="form-select"
          value={inputs.dietType}
          onChange={handleChange}
        >
          <option value="chicken">Standard Poultry / Fish</option>
          <option value="vegan">Vegan / Vegetarian</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="energyKwh">Electricity Usage (kWh / week)</label>
        <input
          id="energyKwh"
          name="energyKwh"
          type="number"
          className="form-input"
          value={inputs.energyKwh}
          onChange={handleChange}
        />
        {errors.energyKwh && <span className="form-error-msg">{errors.energyKwh}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="purchases">Online Shopping (deliveries / week)</label>
        <input
          id="purchases"
          name="purchases"
          type="number"
          className="form-input"
          value={inputs.purchases}
          onChange={handleChange}
        />
        {errors.purchases && <span className="form-error-msg">{errors.purchases}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="flightHours">Flight Travel (hours / week)</label>
        <input
          id="flightHours"
          name="flightHours"
          type="number"
          className="form-input"
          value={inputs.flightHours}
          onChange={handleChange}
        />
        {errors.flightHours && <span className="form-error-msg">{errors.flightHours}</span>}
      </div>

      <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '1rem' }}>
        Log & Analyze Footprint
      </button>
    </form>
  );
};

FootprintForm.propTypes = footprintFormPropTypes;

// 6. Default export
export default FootprintForm;
