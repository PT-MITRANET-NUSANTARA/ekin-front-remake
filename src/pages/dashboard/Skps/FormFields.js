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

export const rhkFormFields = ({ options }) => [
  {
    label: `Rencana Hasil Kerja`,
    name: 'desc',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Rencana Hasil Kerja harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Jenis RHK`,
    name: 'jenis',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Periode akhir harus diisi`
      }
    ],
    size: 'large',
    options: [
      {
        label: 'UTAMA',
        value: 'UTAMA'
      },
      {
        label: 'TAMBAHAN',
        value: 'TAMBAHAN'
      }
    ]
  },
  {
    label: `Klasifikasi`,
    name: 'klasifikasi',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Klasifikasi harus diisi`
      }
    ],
    size: 'large',
    options: [
      {
        label: 'ORGANISASI',
        value: 'ORGANISASI'
      },
      {
        label: 'INDIVIDU',
        value: 'INDIVIDU'
      }
    ]
  },
  {
    label: `Penugasan`,
    name: 'penugasan',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Penugasan visi harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Rencana Kerja Tahunan`,
    name: 'rkts',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Penugasan visi harus diisi`
      }
    ],
    size: 'large',
    mode: 'multiple',
    options: options.rkts.map((item) => ({
      label: item.nama,
      value: item.id
    }))
  }
];
