export default function getNilai(value) {
  const num = parseFloat(value);

  switch (num) {
    case 1:
      return 'DIBAWAH EKSPEKTASI';
    case 2:
      return 'SESUAI EKSPEKTASI';
    case 3:
      return 'DIATAS EKSPEKTASI';
    default:
      return 'NILAI TIDAK VALID';
  }
}
