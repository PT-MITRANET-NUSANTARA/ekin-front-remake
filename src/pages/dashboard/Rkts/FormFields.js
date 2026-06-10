import { InputType } from '@/constants';
import { SATUAN_LIST, getSatuanPrefix } from '@/constants/Satuan';
import dateFormatter from '@/utils/dateFormatter';

export const rktFormFields = ({ options }) => [
  {
    label: `Judul RKT`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul RKT harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Label`,
    name: 'label',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Label harus diisi`
      }
    ],
    size: 'large',
    options: [
      {
        label: 'Kinerja Berbasis Anggaran',
        value: 'Kinerja Berbasis Anggaran'
      },
      {
        label: 'Kinerja Berbasis Non-Anggaran',
        value: 'Kinerja Berbasis Non-Anggaran'
      }
    ]
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
    label: `Renstra`,
    name: 'id_renstra',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Renstra harus diisi`
      }
    ],
    size: 'large',
    options: options.renstras.map((item) => ({
      label: `${dateFormatter(item.tanggal_mulai)} | Hingga | ${dateFormatter(item.tanggal_selesai)}`,
      value: item.id
    }))
  },
  {
    label: `Sub Kegiatan`,
    name: 'id_sub_kegiatan',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Sub Kegiatan harus diisi`
      }
    ],
    size: 'large',
    options: options.subActivities.map((item) => ({
      label: item.nama,
      value: item.id
    })),
    mode: 'multiple'
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
    type: InputType.SATUAN,
    rules: [
      {
        required: true,
        message: `Satuan harus diisi`
      }
    ],
    size: 'large'
  }
];

export const rktsFilterFields = () => [];
