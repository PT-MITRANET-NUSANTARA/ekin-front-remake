export default function getPredikat(value) {
  const num = parseFloat(value);

  switch (num) {
    case 1:
      return 'SANGAT KURANG';
    case 2:
      return 'KURANG (MISCONDUCT)';
    case 3:
      return 'BUTUH PERBAIKAN';
    case 4:
      return 'BAIK';
    case 5:
      return 'ISTIMEWA';
    default:
      return 'NILAI TIDAK VALID';
  }
}
