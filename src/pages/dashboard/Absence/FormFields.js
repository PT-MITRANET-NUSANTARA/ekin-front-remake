import { InputType } from '@/constants';
import { AbsenceStatus } from '@/constants/AbsenceStatus';

export const formFields = ({ options }) => [
  {
    label: 'NIP',
    name: 'id_user',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: 'NIP harus diisi'
      }
    ],
    options:
      options.users?.map((user) => ({
        label: `${user.nip_asn} - ${user.nama_asn}`,
        value: user.nip_asn
      })) || [],
    size: 'large'
  },
  {
    label: 'Tanggal',
    name: 'tanggal',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: 'Tanggal harus diisi'
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
    label: 'Status',
    name: 'status',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: 'Status harus diisi'
      }
    ],
    options: Object.values(AbsenceStatus).map((status) => ({
      label: status,
      value: status
    })),
    size: 'large'
  },

  {
    label: 'Keterangan',
    name: 'keterangan',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: 'Keterangan harus diisi'
      }
    ],
    size: 'large'
  }
];
