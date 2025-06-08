/**
 * Formats a date string into 'YYYY-MM-DD' format.
 *
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string in 'YYYY-MM-DD' format.
 * @throws {Error} If the provided dateString is invalid.
 */
export default function dateFormatter(dateString, format = 'full') {
  if (!dateString) {
    throw new Error('Date string is required');
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  switch (format) {
    case 'year':
      return date.getFullYear().toString();

    case 'month':
      return String(date.getMonth() + 1).padStart(2, '0');

    case 'day':
      return String(date.getDate()).padStart(2, '0');

    case 'full':
    default: {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
}
