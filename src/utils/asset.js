const baseUrl = import.meta.env.VITE_BASE_URL;
const tenant = import.meta.env.VITE_TENANTS;
export const BASE_URL = baseUrl.replace('://', `://${tenant}.`) + '/storage/';

export default function asset(url) {
  return BASE_URL + url;
}
