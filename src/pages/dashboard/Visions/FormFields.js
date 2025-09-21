import { InputType } from '@/constants';

export const formFields = () => [
  {
    label: `Judul Visi`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul visi harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Deskripsi`,
    name: 'deskripsi',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi visi harus diisi`
      }
    ],
    size: 'large'
  }
];
