import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = ({ options }) => [
  {
    label: `Nama Sasaran`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Sasaran harus diisi`
      }
    ]
  },
  {
    label: `Deskripsi Sasaran`,
    name: 'deskripsi',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Deskripsi Sasaran harus diisi`
      }
    ]
  },
  {
    label: `Nama ${Modul.MISSION}`,
    name: 'ids_misi',
    type: InputType.SELECT,
    mode: 'multiple',
    rules: [
      {
        required: true,
        message: `Nama ${Modul.MISSION} harus diisi`
      }
    ],
    options: options.missions.map((item) => ({
      label: item.nama,
      value: item.id
    }))
  },
  {
    label: `Tanggal Mulai`,
    name: 'tanggal_mulai',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal mulai harus diisi`
      }
    ],
    size: 'large',
    props: {
      format: 'YYYY-MM-DD',
      disabledTime: true,
      showTime: false
    }
  },
  {
    label: `Tanggal Selesai`,
    name: 'tanggal_selesai',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal selesai harus diisi`
      }
    ],
    size: 'large',
    props: {
      format: 'YYYY-MM-DD',
      disabledTime: true,
      showTime: false
    }
  }
];

export const renstraFilterFields = () => [];
