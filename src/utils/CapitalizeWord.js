export default function capitalizeWords(str) {
  if (!str || typeof str !== 'string') return str; // biar ga jadi '---'
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
