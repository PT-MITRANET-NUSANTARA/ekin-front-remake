import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = (options = {}) => [
  {
    label: `Nama ${Modul.ASSESSMENTPERIOD}`,
    name: 'nama',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.ASSESSMENTPERIOD} harus diisi`
      }
    ]
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

export const assessmentPeriodFilterFields = () => [];
