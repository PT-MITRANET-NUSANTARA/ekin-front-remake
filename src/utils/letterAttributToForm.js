import { InputType } from '@/constants';

const getInputType = (type) => {
  switch (type) {
    case 'teks':
      return InputType.TEXT;
    case 'angka':
      return InputType.NUMBER;
    case 'tanggal':
      return InputType.DATE;
    default:
      return InputType.TEXT;
  }
};

export const mapLetterAttributesToFormFields = (letter_attribut) => {
  return letter_attribut.map((attr) => ({
    label: attr.label,
    name: attr.attribute,
    type: getInputType(attr.type),
    rules: attr.required === 'ya' ? [{ required: true, message: `${attr.label} harus diisi` }] : []
  }));
};
