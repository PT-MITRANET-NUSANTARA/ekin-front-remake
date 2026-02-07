import { InputType } from '@/constants';

export const CalendarFormFields = () => [
  {
    label: `Pilih Penanda`,
    name: 'is_holiday',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Tipe Penanda harus diisi`
      }
    ],
    size: 'large',
    options: [
      {
        label: 'Hari Libur',
        value: true
      },
      {
        label: 'Hari Kerja',
        value: false
      }
    ]
  },
  {
    label: 'Nama Penanda',
    name: 'holiday_name',
    type: InputType.TEXT,
    size: 'large',
    placeholder: 'Masukan Nama Penanda',
    rules: [
      {
        required: true,
        message: 'Nama Penanda harus diisi'
      }
    ]
  },
  {
    label: 'Waktu Mulai',
    name: 'harian_time_start',
    type: InputType.TIME,
    size: 'large',
    rules: [
      {
        required: true,
        message: 'Waktu Mulai harus diisi'
      }
    ]
  },
  {
    label: 'Waktu Berakhir',
    name: 'harian_time_end',
    type: InputType.TIME,
    size: 'large',
    rules: [
      {
        required: true,
        message: 'Waktu Berakhir harus diisi'
      }
    ]
  },
  {
    label: 'Waktu Istirahat',
    name: 'break_time_start',
    type: InputType.TIME,
    size: 'large',
    rules: [
      {
        required: true,
        message: 'Waktu Istirahat harus diisi'
      }
    ]
  },
  {
    label: 'Waktu Akhir Istirahat',
    name: 'break_time_end',
    type: InputType.TIME,
    size: 'large',
    rules: [
      {
        required: true,
        message: 'Waktu Akhir Istirahat harus diisi'
      }
    ]
  },
  {
    label: 'Total Menit',
    name: 'total_minutes',
    type: InputType.NUMBER,
    size: 'large',
    placeholder: 'Masukan Total Menit',
    rules: [
      {
        required: true,
        message: 'Total Menit harus diisi'
      }
    ]
  }
];
