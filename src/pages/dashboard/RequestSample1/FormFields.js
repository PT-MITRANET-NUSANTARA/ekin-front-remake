import { InputType } from '@/constants';

export const KalenderFormFields = () => [
  {
    label: 'Waktu Mulai',
    name: 'dayTimeStart',
    type: InputType.TIME,
    size: 'large',
    rules: [{ required: true, message: 'Waktu Mulai harus diisi' }]
  },
  {
    label: 'Waktu Berakhir',
    name: 'dayTimeEnd',
    type: InputType.TIME,
    size: 'large',
    rules: [{ required: true, message: 'Waktu Berakhir harus diisi' }]
  },
  {
    label: 'Istirahat Mulai',
    name: 'breakTimeStart',
    type: InputType.TIME,
    size: 'large',
    rules: [{ required: true, message: 'Istirahat Mulai harus diisi' }]
  },
  {
    label: 'Istirahat Berakhir',
    name: 'breakTimeEnd',
    type: InputType.TIME,
    size: 'large',
    rules: [{ required: true, message: 'Istirahat Berakhir harus diisi' }]
  },
  {
    label: 'Total Menit Kerja',
    name: 'totalMinuteWork',
    type: InputType.NUMBER,
    size: 'large',
    placeholder: 'Masukan total menit',
    rules: [{ required: true, message: 'Total Menit harus diisi' }]
  },
  {
    label: 'Catatan',
    name: 'note',
    type: InputType.TEXT,
    size: 'large',
    placeholder: 'Catatan (opsional)'
  }
];

export const HolidayFormFields = () => [
  {
    label: 'Nama Hari Libur',
    name: 'name',
    type: InputType.TEXT,
    size: 'large',
    placeholder: 'Masukan nama hari libur',
    rules: [{ required: true, message: 'Nama harus diisi' }]
  },
  {
    label: 'Catatan',
    name: 'note',
    type: InputType.TEXT,
    size: 'large',
    placeholder: 'Catatan (opsional)'
  }
];
