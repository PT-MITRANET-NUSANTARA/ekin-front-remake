import { InputType } from '@/constants';

export const unorFormFields = ({ options }) => [
  {
    label: `Nama`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama harus diisi`
      }
    ]
  },
  {
    label: `Unit Organisasi`,
    name: 'unitId',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Unor harus diisi`
      }
    ],
    size: 'large',
    options: options.unors.map((item) => ({
      label: item.name,
      value: item.id
    }))
  }
];

export const jabatanFormFields = ({ options }) => [
  {
    label: `ASN`,
    name: 'nip',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `ASN harus diisi`
      }
    ],
    options: options.nips.map((item) => ({
      label: item.name,
      value: item.nip
    })),
    size: 'large',
    mode: 'multiple'
  }
];
