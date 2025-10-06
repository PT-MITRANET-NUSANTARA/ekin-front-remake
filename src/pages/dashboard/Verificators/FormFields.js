import { InputType } from '@/constants';

export const unorFormFields = ({ options }) => [
  {
    label: `Unit Organisasi`,
    name: 'unit_id',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Unor harus diisi`
      }
    ],
    size: 'large',
    options: options.unors.map((item) => ({
      label: item.nama_unor,
      value: String(item.id_simpeg)
    }))
  },
  {
    label: `Unit Verifikator`,
    name: 'unor_id',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Unit Verificator harus diisi`
      }
    ],
    size: 'large',
    mode: 'multiple',
    options: options.unors.map((item) => ({
      label: item.nama_unor,
      value: String(item.id_simpeg)
    }))
  }
];

export const jabatanFormFields = ({ options }) => [
  {
    label: `Jabatan`,
    name: 'jabatan',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Jabatan harus diisi`
      }
    ],
    options: options.jabatans.map((item) => ({
      label: item,
      value: item
    })),
    size: 'large',
    mode: 'multiple'
  }
];
