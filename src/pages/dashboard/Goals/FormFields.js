import { InputType } from '@/constants';

export const goalFormFields = ({ options }) => [
  {
    label: `Judul tujuan`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul tujuan harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Rencana strategi`,
    name: 'id_renstra',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Rencana Strategi harus diisi`
      }
    ],
    size: 'large',
    options: options.renstras.map((item) => ({
      label: `${item.tanggal_mulai} | Hingga |  ${item.tanggal_selesai}`,
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

export const goalsFilterFields = () => [];
