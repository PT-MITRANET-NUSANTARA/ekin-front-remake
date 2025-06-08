export default function isInEnum(value, enumeration) {
  return Object.values(enumeration).includes(value);
}
