export const expiredTimeFormat = (days) => {
  if (days < 30) {
    return `${days}-Hari`;
  }
  const years = Math.floor(days / 365);
  const remainingDaysAfterYear = days % 365;
  const months = Math.floor(remainingDaysAfterYear / 30);
  const remainingDays = remainingDaysAfterYear % 30;

  let result = '';
  if (years > 0) {
    result += `${years} Tahun, `;
  }
  if (months > 0) {
    result += `${months} Bulan, `;
  }
  if (remainingDays > 0) {
    result += `${remainingDays} Hari, `;
  }

  return result.trim();
};
