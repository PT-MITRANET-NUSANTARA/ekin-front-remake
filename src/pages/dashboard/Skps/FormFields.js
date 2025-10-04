import { InputType } from '@/constants';

export const formFields = ({ options }) => [
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
  },
  {
    label: `Renstra`,
    name: 'renstra_id',
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

export const aspekFormFields = () => [
  {
    label: `Nama Indikator`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Indikator harus diisi`
      }
    ],
    size: 'large'
  },
  {
    label: `Target Indikator`,
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

export const lampiranFormFields = () => [
  {
    label: `Nama lampiran`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama lampiran harus diisi`
      }
    ],
    size: 'large'
  }
];

export const filterMphFormFields = ({ options }) => [
  {
    label: `SKP Bawahan`,
    name: 'skp_id',
    type: InputType.SELECT,
    size: 'large',
    options: Array.isArray(options.skpBawahan)
      ? options.skpBawahan.map((item) => ({
          label: item.posjab[0].nama_asn,
          value: item.id
        }))
      : []
  }
];

export const mphFormFields = ({ options }) => [
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
    label: `SKP Bawahan`,
    name: 'skp_id',
    type: InputType.SELECT,
    size: 'large',
    options: Array.isArray(options.skpBawahan)
      ? options.skpBawahan.map((item) => ({
          label: item.posjab[0].nama_asn,
          value: item.id
        }))
      : [],
    rules: [
      {
        required: true,
        message: `SKP Bawahan harus diisi`
      }
    ]
  },
  {
    label: `RHK Atasan`,
    name: 'rhk_atasan_id',
    type: InputType.SELECT,
    size: 'large',
    options: options.matriksSkp.rhk.map((item) => ({
      label: item.desc,
      value: item.id
    })),
    rules: [
      {
        required: true,
        message: `RHK Atasan harus diisi`
      }
    ]
  }
];

export const perjanjianKinerjaFormFields = () => [
  {
    label: `Upload Perjanjian Kinerja`,
    name: 'file',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.file,
          name: data?.id
        }
      ];
    },
    accept: ['.pdf', '.jpg', '.png'],
    rules: [{ required: true, message: 'File Perjanjian Kinerja harus diisi' }]
  }
];

export const rencanaAksiFormFields = ({ options }) => [
  {
    label: `Rencana Aksi`,
    name: 'desc',
    type: InputType.TEXT,
    rules: [{ required: true, message: 'Rencana aksi harus diisi' }]
  },
  {
    label: `Tanggal Mulai`,
    name: 'periode_start',
    type: InputType.DATE,
    rules: [{ required: true, message: 'Tanggal mulai harus diisi' }]
  },
  {
    label: `Tanggal Berakhir`,
    name: 'periode_end',
    type: InputType.DATE,
    rules: [{ required: true, message: 'Tanggal selesai harus diisi' }]
  },
  {
    label: `Rencana Hasil Kerja`,
    name: 'rhk_id',
    type: InputType.SELECT,
    size: 'large',
    options: options.rhks.map((item) => ({
      label: item.desc,
      value: item.id
    })),
    rules: [
      {
        required: true,
        message: `RHK harus diisi`
      }
    ]
  }
];

export const descFormField = () => [
  {
    label: `Feedback`,
    name: 'desc',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Feedback harus diisi`
      }
    ],
    size: 'large'
  }
];

export const ratingFormFields = () => [
  {
    label: `Feedback`,
    name: 'desc',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Feedback harus diisi`
      }
    ],
    size: 'large'
  }
];
