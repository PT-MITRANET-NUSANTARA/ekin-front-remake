import { InputType } from '@/constants';

export const activitiesFormFields = ({ options }) => [
  {
    label: `Judul kegiatan`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul kegiatan harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Total anggaran`,
    name: 'total_anggaran',
    type: InputType.NUMBER,
    rules: [
      {
        required: true,
        message: `Total anggaran harus diisi`
      },
      {
        type: 'number',
        message: 'Input harus berupa angka nominal total anggaran'
      }
    ],
    size: 'large'
  },
  {
    label: `Program`,
    name: 'id_program',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Programs harus diisi`
      }
    ],
    size: 'large',
    options: options.programs.map((item) => ({
      label: item.nama,
      value: item.id
    }))
  }
];

export const indicatorFormFields = () => [
  {
    label: `Nama indikator`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama indikator harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Target`,
    name: 'target',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Target harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Satuan`,
    name: 'satuan',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Satuan harus diisi`
      }
    ],
    size: 'large'
  }
];
