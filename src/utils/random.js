/**
 * Core random utility engine.
 * All generators in health-data-faker use these primitives.
 * No external dependencies — plain Math.random() based.
 */

/**
 * Returns a random element from an array.
 * @param {Array} array
 * @returns {*}
 */
export function randomItem(array) {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error('randomItem requires a non-empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomNumber(min, max) {
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('randomNumber requires numeric min and max');
  }
  if (min > max) {
    throw new Error('randomNumber: min must be <= max');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random boolean.
 * @returns {boolean}
 */
export function randomBoolean() {
  return Math.random() < 0.5;
}

/**
 * Returns a random alphanumeric string of given length.
 * @param {number} length
 * @returns {string}
 */
export function randomString(length) {
  if (typeof length !== 'number' || length < 1) {
    throw new Error('randomString requires a positive integer length');
  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Returns a string of random numeric digits of given length.
 * @param {number} length
 * @returns {string}
 */
export function randomDigits(length) {
  if (typeof length !== 'number' || length < 1) {
    throw new Error('randomDigits requires a positive integer length');
  }
  const digits = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += digits[Math.floor(Math.random() * digits.length)];
  }
  return result;
}

/**
 * Returns a random Date between start and end (inclusive).
 * @param {Date} start
 * @param {Date} end
 * @returns {Date}
 */
export function randomDate(start, end) {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw new Error('randomDate requires Date instances for start and end');
  }
  if (start > end) {
    throw new Error('randomDate: start must be <= end');
  }
  const startMs = start.getTime();
  const endMs = end.getTime();
  return new Date(Math.floor(Math.random() * (endMs - startMs + 1)) + startMs);
}
