import { PAGINATION_ALL } from '@/constants';

const baseUrl = import.meta.env.VITE_BASE_URL;
export const BASE_URL = `${baseUrl}`;

const controllers = {};

/**
 * @param {string} endpoint
 * @param {'GET' | 'POST' | 'PATCH' | 'DELETE'} method
 * @param {object} body
 * @param {string} token
 * @param {object} file
 * @param {AbortController} abortController
 * @returns {Promise<{
 *  code: number;
 *  status: boolean;
 *  message: string;
 *  data: any;
 * }>}
 */
async function customFetch(endpoint, method, body, token, file, abortController) {
  const formData = new FormData();
  for (const key in body) {
    if (file && key in file) continue;
    formData.append(key, body[key]);
  }

  for (const key in file) {
    if (!file[key]) continue;
    formData.append(key, file[key], file[key].name);
  }

  const options = {
    method,
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };

  if (file) {
    options.body = formData;
  } else if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  if (abortController) options.signal = abortController.signal;
  else if (controllers[endpoint]) options.signal = controllers[endpoint].signal;

  const response = await fetch(BASE_URL + endpoint, options);

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { isSuccess: true, data: url };
  }
}

/**
 * @param {'GET' | 'POST' | 'PATCH' | 'DELETE'} method
 * @returns {(endpoint: string, options?: {
 *  body?: object;
 *  token?: string;
 *  file?: object;
 *  page?: number;
 *  perPage?: number;
 *  params?: Record<string, string | number>;
 *  abortController?: AbortController;
 * }) => ReturnType<typeof customFetch>}
 */
function createCustomFetch(method) {
  return (endpoint, { body, token, file, page, perPage = 10, params, abortController } = {}) => {
    const cleanEndpoint = endpoint.split('?')[0];
    if (!abortController) {
      if (controllers[cleanEndpoint]) controllers[cleanEndpoint].abort();
      controllers[cleanEndpoint] = new AbortController();
    }

    const searchParams = {};
    if (params) for (const key in params) searchParams[key] = params[key];

    if (page) {
      searchParams.page = page;
      if (perPage === PAGINATION_ALL) searchParams.per_page = 'all';
      else searchParams.per_page = perPage;
    }

    const searchParamsString = Object.entries(searchParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const hasSearchParams = endpoint.includes('?');
    let concatenatedEndpoint = endpoint;
    if (searchParamsString !== '') {
      if (hasSearchParams) concatenatedEndpoint += '&';
      else concatenatedEndpoint += '?';
      concatenatedEndpoint += searchParamsString;
    }
    return customFetch(concatenatedEndpoint, method, body, token, file, abortController);
  };
}

async function customFetchFile(endpoint, token, options = {}) {
  const response = await fetch(BASE_URL + endpoint, {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    },
    signal: options.signal
  });

  const blob = await response.blob();
  const base64 = await blobToBase64(blob);
  return { isSuccess: response.ok, data: base64 };
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default {
  get: createCustomFetch('GET'),
  post: createCustomFetch('POST'),
  patch: createCustomFetch('PATCH'),
  put: createCustomFetch('PUT'),
  delete: createCustomFetch('DELETE'),
  getFile: customFetchFile
};
