import { InputType } from '@/constants';

export const unorFormFields = ({ options }) => [
  {
    label: `Nama`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama harus diisi`
      }
    ]
  },
  {
    label: `Unit Organisasi`,
    name: 'unitId',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Unor harus diisi`
      }
    ],
    size: 'large',
    options: options.unors.map((item) => ({
      label: item.name,
      value: item.id
    }))
  }
];

export const jabatanFormFields = ({ options }) => [
  {
    label: `ASN`,
    name: 'nip',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `ASN harus diisi`
      }
    ],
    options: options.nips.map((item) => ({
      label: item.name,
      value: item.nip
    })),
    size: 'large',
    mode: 'multiple'
  }
];

export const pimpinanUnitKerjaFormFields = ({ options, nameDisabled = false, hideNameField = false }) => {
  const fields = [];
  
  // Only include name field if not hidden
  if (!hideNameField) {
    fields.push({
      label: `Nama JPT`,
      name: 'name',
      type: InputType.TEXT,
      rules: [
        {
          required: true,
          message: `Nama JPT harus diisi`
        }
      ],
      disabled: nameDisabled
    });
  }
  
  fields.push({
    label: `NIP`,
    name: 'nip',
    type: InputType.SELECT,
    rules: [
      {
        required: false,
        message: `NIP dapat dikosongkan`
      }
    ],
    size: 'large',
    mode: 'multiple',
    options: (options.asn || []).map((item) => ({
      label: `${item.nip} - ${item.nama || item.name}`,
      value: item.nip
    }))
  });
  
  return fields;
};
