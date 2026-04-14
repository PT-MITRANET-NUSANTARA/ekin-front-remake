import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Nama ${Modul.VISION}`,
    name: 'visi_id',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.VISION} harus diisi`
      }
    ],
    options: options.visi.map((item) => ({
      label: item.nama,
      value: item.id
    }))
  },
  {
    label: `Judul Misi`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Judul misi harus diisi`
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
        message: `Deskripsi misi harus diisi`
      }
    ],
    size: 'large'
  }
];
