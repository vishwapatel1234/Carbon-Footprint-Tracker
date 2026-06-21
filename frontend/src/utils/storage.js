import { HISTORY_DAYS } from './constants.js';

/**
 * Saves a weekly carbon entry to history (keeps max HISTORY_DAYS).
 * @param {Object} entry - { date, inputs, total, breakdown }
 */
export const saveEntry = (entry) => {
  try {
    const history = getHistory();
    // Prepend new entry
    history.unshift(entry);
    // Sort descending by date
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Limit to history days
    const trimmed = history.slice(0, HISTORY_DAYS);
    localStorage.setItem('eco_history', JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving history entry:', error);
  }
};

/**
 * Retrieves the carbon footprint history logs.
 * @returns {Array} - Array of entries
 */
export const getHistory = () => {
  try {
    const data = localStorage.getItem('eco_history');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
};

/**
 * Clears the history logs.
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem('eco_history');
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

/**
 * Saves the user profile questionnaire answers.
 * @param {Object} profile 
 */
export const saveProfile = (profile) => {
  try {
    localStorage.setItem('eco_profile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

/**
 * Retrieves the user profile answers.
 * @returns {Object|null}
 */
export const getProfile = () => {
  try {
    const data = localStorage.getItem('eco_profile');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading profile:', error);
    return null;
  }
};

/**
 * Saves active pledges/commitments.
 * @param {Array} pledges
 */
export const savePledges = (pledges) => {
  try {
    localStorage.setItem('eco_pledges', JSON.stringify(pledges));
  } catch (error) {
    console.error('Error saving pledges:', error);
  }
};

/**
 * Retrieves the checklist of pledges/commitments.
 * @returns {Array}
 */
export const getPledges = () => {
  try {
    const data = localStorage.getItem('eco_pledges');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading pledges:', error);
    return [];
  }
};
