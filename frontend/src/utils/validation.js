import {
  MAX_KM_INPUT,
  MAX_MEALS_INPUT,
  MAX_KWH_INPUT
} from './constants.js';

/**
 * Validates travel distance input.
 * @param {string|number} km
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateKm = (km) => {
  if (km === '' || km === undefined || km === null) {
    return { valid: false, error: 'This field is required' };
  }
  const val = Number(km);
  if (isNaN(val)) {
    return { valid: false, error: 'Please enter a number' };
  }
  if (val < 0) {
    return { valid: false, error: 'Must be 0 or more' };
  }
  if (val > MAX_KM_INPUT) {
    return { valid: false, error: 'Seems too high — double check this value' };
  }
  return { valid: true, error: null };
};

/**
 * Validates meat meals input.
 * @param {string|number} meals
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateMeals = (meals) => {
  if (meals === '' || meals === undefined || meals === null) {
    return { valid: false, error: 'This field is required' };
  }
  const val = Number(meals);
  if (isNaN(val)) {
    return { valid: false, error: 'Please enter a number' };
  }
  if (val < 0) {
    return { valid: false, error: 'Must be 0 or more' };
  }
  if (val > MAX_MEALS_INPUT) {
    return { valid: false, error: 'Seems too high — double check this value' };
  }
  return { valid: true, error: null };
};

/**
 * Validates electricity usage.
 * @param {string|number} kwh
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateEnergy = (kwh) => {
  if (kwh === '' || kwh === undefined || kwh === null) {
    return { valid: false, error: 'This field is required' };
  }
  const val = Number(kwh);
  if (isNaN(val)) {
    return { valid: false, error: 'Please enter a number' };
  }
  if (val < 0) {
    return { valid: false, error: 'Must be 0 or more' };
  }
  if (val > MAX_KWH_INPUT) {
    return { valid: false, error: 'Seems too high — double check this value' };
  }
  return { valid: true, error: null };
};

/**
 * Validates purchase count.
 * @param {string|number} count
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validatePurchases = (count) => {
  if (count === '' || count === undefined || count === null) {
    return { valid: false, error: 'This field is required' };
  }
  const val = Number(count);
  if (isNaN(val)) {
    return { valid: false, error: 'Please enter a number' };
  }
  if (val < 0) {
    return { valid: false, error: 'Must be 0 or more' };
  }
  if (val > 100) {
    return { valid: false, error: 'Seems too high — double check this value' };
  }
  return { valid: true, error: null };
};

/**
 * Validates flight hours.
 * @param {string|number} hours
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateFlights = (hours) => {
  if (hours === '' || hours === undefined || hours === null) {
    return { valid: false, error: 'This field is required' };
  }
  const val = Number(hours);
  if (isNaN(val)) {
    return { valid: false, error: 'Please enter a number' };
  }
  if (val < 0) {
    return { valid: false, error: 'Must be 0 or more' };
  }
  if (val > 168) { // Max hours in a week
    return { valid: false, error: 'Seems too high — double check this value' };
  }
  return { valid: true, error: null };
};
