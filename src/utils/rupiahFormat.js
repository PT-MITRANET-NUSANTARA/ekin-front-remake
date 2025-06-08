export function rupiahFormat(value, withSymbol) {
  if (isNaN(value)) return '';

  const formatted = value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  return withSymbol ? formatted : formatted.replace('Rp.  ', '').trim();
}
