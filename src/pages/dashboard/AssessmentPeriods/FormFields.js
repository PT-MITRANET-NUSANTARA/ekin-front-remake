import { InputType } from '@/constants';
import Modul from '@/constants/Modul';
import dateFormatter from '@/utils/dateFormatter';

export const formFields = (options = {}) => {
  const renstras = options.renstras ?? [];
  
  return [
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
    options: renstras.map((item) => ({
      label: `${dateFormatter(item.tanggal_mulai)} | Hingga | ${dateFormatter(item.tanggal_selesai)}`,
      value: item.id
    }))
  }
];
};

export const assessmentPeriodFilterFields = () => [];
