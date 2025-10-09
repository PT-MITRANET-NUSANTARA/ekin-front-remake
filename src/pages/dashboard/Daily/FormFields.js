import { InputType } from '@/constants';

export const formFields = () => [
  {
    label: 'Judul',
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Nama harus diisi'
      }
    ],
    size: 'large'
  },
  {
    label: 'Deskripsi',
    name: 'desc',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: 'Deskripsi harus diisi'
      }
    ],
    size: 'large'
  },
  {
    label: 'Waktu Mulai',
    name: 'start_date_time',
    type: InputType.TIME,
    rules: [
      {
        required: true,
        message: 'Waktu mulai harus diisi'
      }
    ],
    size: 'large',
    extra: {
      format: 'HH:mm'
    }
  },
  {
    label: 'Waktu Selesai',
    name: 'end_date_time',
    type: InputType.TIME,
    rules: [
      {
        required: true,
        message: 'Waktu selesai harus diisi'
      }
    ],
    size: 'large',
    extra: {
      format: 'HH:mm'
    }
  },
  {
    label: 'Progress',
    name: 'progress',
    type: InputType.SLIDER,
    rules: [
      {
        required: true,
        message: 'Progress harus diisi'
      }
    ],
    size: 'large'
  }
];
