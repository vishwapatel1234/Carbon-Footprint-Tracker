// 1. React imports
import { useState } from 'react';

// 2. Third-party imports
import PropTypes from 'prop-types';

// 3. Internal imports (none)

// 4. PropTypes object declaration
const onboardingPropTypes = {
  onComplete: PropTypes.func.isRequired
};

// 5. Component function
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    country: 'India',
    commuteMode: 'car',
    dietType: 'chicken',
    homeSize: 'medium'
  });

  const handleSelect = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="onboarding__question">Where do you live?</h3>
            <div className="onboarding__options-grid">
              <button
                type="button"
                className={`onboarding__option ${profile.country === 'India' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('country', 'India')}
              >
                <span className="onboarding__emoji">🇮🇳</span>
                <span>India</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.country === 'USA' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('country', 'USA')}
              >
                <span className="onboarding__emoji">🇺🇸</span>
                <span>United States</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.country === 'Europe' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('country', 'Europe')}
              >
                <span className="onboarding__emoji">🇪🇺</span>
                <span>Europe</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.country === 'Other' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('country', 'Other')}
              >
                <span className="onboarding__emoji">🌍</span>
                <span>Other Region</span>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="onboarding__question">What is your primary commute method?</h3>
            <div className="onboarding__options-grid">
              <button
                type="button"
                className={`onboarding__option ${profile.commuteMode === 'car' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('commuteMode', 'car')}
              >
                <span className="onboarding__emoji">🚗</span>
                <span>Personal Car</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.commuteMode === 'bus' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('commuteMode', 'bus')}
              >
                <span className="onboarding__emoji">🚌</span>
                <span>Public Bus</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.commuteMode === 'train' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('commuteMode', 'train')}
              >
                <span className="onboarding__emoji">🚆</span>
                <span>Metro / Train</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.commuteMode === 'bike' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('commuteMode', 'bike')}
              >
                <span className="onboarding__emoji">🚲</span>
                <span>Walking / Cycling</span>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="onboarding__question">How would you describe your weekly diet?</h3>
            <div className="onboarding__options-grid">
              <button
                type="button"
                className={`onboarding__option ${profile.dietType === 'vegan' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('dietType', 'vegan')}
              >
                <span className="onboarding__emoji">🌱</span>
                <span>Vegan / Vegetarian</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.dietType === 'chicken' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('dietType', 'chicken')}
              >
                <span className="onboarding__emoji">🍗</span>
                <span>Poultry / Fish Eater</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.dietType === 'beef' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('dietType', 'beef')}
              >
                <span className="onboarding__emoji">🥩</span>
                <span>Regular Red Meat</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.dietType === 'mixed' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('dietType', 'mixed')}
              >
                <span className="onboarding__emoji">🍱</span>
                <span>Standard Mixed Diet</span>
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="onboarding__question">What size is your home household?</h3>
            <div className="onboarding__options-grid">
              <button
                type="button"
                className={`onboarding__option ${profile.homeSize === 'small' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('homeSize', 'small')}
              >
                <span className="onboarding__emoji">🏢</span>
                <span>Small Apartment</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.homeSize === 'medium' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('homeSize', 'medium')}
              >
                <span className="onboarding__emoji">🏡</span>
                <span>Medium Flat</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.homeSize === 'large' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('homeSize', 'large')}
              >
                <span className="onboarding__emoji">🏰</span>
                <span>Large House</span>
              </button>
              <button
                type="button"
                className={`onboarding__option ${profile.homeSize === 'shared' ? 'onboarding__option--selected' : ''}`}
                onClick={() => handleSelect('homeSize', 'shared')}
              >
                <span className="onboarding__emoji">🤝</span>
                <span>Shared Space</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding">
      <div className="onboarding__header">
        <h2 className="onboarding__title">EcoPulse Onboarding</h2>
        <p className="onboarding__subtitle">Let's build your lifestyle profile to calculate your baseline impact</p>
      </div>

      <div className="onboarding__step-indicator">
        <div className={`onboarding__dot ${step === 1 ? 'onboarding__dot--active' : ''}`} />
        <div className={`onboarding__dot ${step === 2 ? 'onboarding__dot--active' : ''}`} />
        <div className={`onboarding__dot ${step === 3 ? 'onboarding__dot--active' : ''}`} />
        <div className={`onboarding__dot ${step === 4 ? 'onboarding__dot--active' : ''}`} />
      </div>

      {renderStepContent()}

      <div className="onboarding__nav-buttons">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleNext}
        >
          {step === 4 ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

Onboarding.propTypes = onboardingPropTypes;

// 6. Default export
export default Onboarding;
