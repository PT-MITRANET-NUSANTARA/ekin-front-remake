const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;

/**
 * Executes the provided callback function if the environment is not 'development'.
 *
 * @template T
 * @template {any[]} P
 * @param {(...args: P) => T} callback - The callback function to execute.
 * @returns {T | undefined} The result of the callback function or undefined if the environment is 'development'.
 */
export function dev(callback) {
  if (ENVIRONMENT !== 'development') return;
  return callback();
}

/**
 * Executes the provided callback function if the environment is not 'production'.
 *
 * @template T
 * @template {any[]} P
 * @param {(...args: P) => T} callback - The callback function to execute.
 * @returns {T | undefined} The result of the callback function or undefined if the environment is 'production'.
 */
export function prod(callback) {
  if (ENVIRONMENT !== 'production') return;
  return callback();
}

export default { dev, prod };
