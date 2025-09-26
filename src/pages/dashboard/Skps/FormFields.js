import { InputType } from '@/constants';

export const formFields = () => [
  {
    label: `Periode Mulai`,
    name: 'tanggal_mulai',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Periode mulai harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Periode Akhir`,
    name: 'tanggal_selesai',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Periode akhir harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Pendekatan`,
    name: 'pendekatan',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Pendekatan visi harus diisi`
      }
    ],
    size: 'large',
    options: [
      {
        label: 'Kuantitatif',
        value: 'KUANTITATIF'
      },
      {
        label: 'Kualitatif',
        value: 'KUALITATIF'
      }
    ]
  }
];
