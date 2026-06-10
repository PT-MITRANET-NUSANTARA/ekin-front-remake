export const SATUAN_LIST = [
  {
    label: 'Rupiah',
    value: 'Rupiah',
    prefix: 'Rp.'
  },
  {
    label: 'Hari',
    value: 'Hari',
    prefix: ''
  }
];

export const SATUAN_MAP = SATUAN_LIST.reduce((acc, satuan) => {
  acc[satuan.value] = satuan;
  return acc;
}, {});

export const getSatuanPrefix = (satauan) => {
  return SATUAN_MAP[satauan]?.prefix || '';
};
