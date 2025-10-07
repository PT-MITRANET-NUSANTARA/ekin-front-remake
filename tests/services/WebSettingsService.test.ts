import WebSettings, { IncomingApiData } from '@/models/WebSettings';
import WebSettingsService from '@/services/WebSettingsService';
import { BASE_URL } from '@/utils/api';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const BASE_ENDPOINT = BASE_URL + '/web-settings';

function unauthorized() {
  return HttpResponse.json(
    {
      code: 401,
      status: false,
      message: 'Unauthorized'
    },
    { status: 401 }
  );
}

function badRequest(body: Partial<Omit<ApiData, 'id'>>) {
  const errors: { name?: string[] } = {};
  if (!body.name) errors['name'] = ['The name field is required.'];
  return HttpResponse.json(
    {
      code: 400,
      status: false,
      message: 'Bad request',
      errors
    },
    { status: 400 }
  );
}

function notFound() {
  return HttpResponse.json(
    {
      code: 404,
      status: false,
      message: 'Not found'
    },
    { status: 404 }
  );
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

function success<T, P extends Pagination = Pagination>(data?: T, pagination?: P) {
  const response: { code: number; status: boolean; message: string; data?: T; pagination?: P } = {
    code: 201,
    status: true,
    message: 'Success'
  };
  if (data) response.data = data;
  if (pagination) response.pagination = pagination;
  return HttpResponse.json(response, { status: 201 });
}

const restHandler = {
  getAll: http.get(BASE_ENDPOINT, ({ request }) => {
    const authorization = request.headers.get('Authorization');
    if (!authorization || authorization !== 'Bearer token') return unauthorized();

    return success<IncomingApiData[]>(
      [ { id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" } ],
      {
        total: 2,
        per_page: 10,
        current_page: 1,
        total_pages: 1
      }
    );
  }),

  store: http.post(BASE_ENDPOINT, async ({ request }) => {
    const authorization = request.headers.get('Authorization');
    if (!authorization || authorization !== 'Bearer token') return unauthorized();

    const body = (await request.json()) as ApiData;
    if (!body || !body.name) return badRequest(body);

    return success();
  }),

  update: http.patch(`${BASE_ENDPOINT}/edit/:id`, async ({ request, params }) => {
    const authorization = request.headers.get('Authorization');
    if (!authorization || authorization !== 'Bearer token') return unauthorized();

    const body = (await request.json()) as ApiData;
    if (!body || !body.name) return badRequest(body);

    if (params.id !== '1') return notFound();

    return success();
  }),

  delete: http.delete(`${BASE_ENDPOINT}/delete/:id`, ({ request, params }) => {
    const authorization = request.headers.get('Authorization');
    if (!authorization || authorization !== 'Bearer token') return unauthorized();

    if (params.id !== '1') return notFound();

    return success();
  }),

  deleteBatch: http.delete(`${BASE_ENDPOINT}/multi-delete`, ({ request }) => {
    const authorization = request.headers.get('Authorization');
    if (!authorization || authorization !== 'Bearer token') return unauthorized();

    const url = new URL(request.url);
    const ids = url.searchParams.getAll('id')[0].split(',').map(Number);
    if (ids.length !== 2 || ids[0] !== 1 || ids[1] !== 2) return notFound();

    return success();
  })
};

const server = setupServer(...Object.values(restHandler));

describe('WebSettingsService', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());

  it('getAll(): should be able to get all Web Settingses', async () => {
    const { message, status, data } = await WebSettingsService.getAll('token');

    expect(message).toBe('Success');
    expect(status).toBe(true);
    expect(data).toBeDefined();
    expect(data).toHaveLength(2);
    if (data) {
      expect(data[0]).toBeDefined();
      expect(data[0].id).toBe(1);
      expect(data[0].name).toBe('John Doe');

      expect(data[1]).toBeDefined();
      expect(data[1].id).toBe(2);
      expect(data[1].name).toBe('Jane Doe');
    }
  });

  it('getAll(): should error when unauthorized', async () => {
    const { message, status, data } = await WebSettingsService.getAll('invalid token');

    expect(message).toBe('Unauthorized');
    expect(status).toBe(false);
    expect(data).toBeUndefined();
  });

  it('store(): should be able to store a Web Settings', async () => {
    const { message, status } = await WebSettingsService.store(new WebSettings(3, 'Malik'), 'token');

    expect(message).toBe('Success');
    expect(status).toBe(true);
  });

  it('store(): should be error when unauthorized', async () => {
    const { message, status } = await WebSettingsService.store(new WebSettings(3, 'Malik'), 'invalid token');

    expect(message).toBe('Unauthorized');
    expect(status).toBe(false);
  });

  it('store(): should be error when bad request', async () => {
    const noName = await WebSettingsService.store({} as WebSettings, 'token');
    expect(noName.message).toBe('Bad request');
    expect(noName.status).toBe(false);
    expect(noName.errors).toStrictEqual({ name: ['The name field is required.'] });
  });

  it('update(): should be able to update a Web Settings', async () => {
    const { message, status } = await WebSettingsService.update(1, new WebSettings(1, 'Rapik'), 'token');

    expect(message).toBe('Success');
    expect(status).toBe(true);
  });

  it('update(): should be error when unauthorized', async () => {
    const { message, status } = await WebSettingsService.update(1, new WebSettings(1, 'Rapik'), 'invalid token');

    expect(message).toBe('Unauthorized');
    expect(status).toBe(false);
  });

  it('update(): should be error when bad request', async () => {
    const noName = await WebSettingsService.update(1, {} as WebSettings, 'token');
    expect(noName.message).toBe('Bad request');
    expect(noName.status).toBe(false);
    expect(noName.errors).toStrictEqual({ name: ['The name field is required.'] });
  });

  it('update(): should be error when not found', async () => {
    const { message, status } = await WebSettingsService.update(2, new WebSettings(2, 'Rapik'), 'token');

    expect(message).toBe('Not found');
    expect(status).toBe(false);
  });

  it('delete(): should be able to delete a Web Settings', async () => {
    const { message, status } = await WebSettingsService.delete(1, 'token');

    expect(message).toBe('Success');
    expect(status).toBe(true);
  });

  it('delete(): should be error when unauthorized', async () => {
    const { message, status } = await WebSettingsService.delete(1, 'invalid token');

    expect(message).toBe('Unauthorized');
    expect(status).toBe(false);
  });

  it('delete(): should be error when not found', async () => {
    const { message, status } = await WebSettingsService.delete(2, 'token');

    expect(message).toBe('Not found');
    expect(status).toBe(false);
  });

  it('deleteBatch(): should be able to delete multiple Web Settingses', async () => {
    const { message, status } = await WebSettingsService.deleteBatch([1, 2], 'token');

    expect(message).toBe('Success');
    expect(status).toBe(true);
  });

  it('deleteBatch(): should be error when unauthorized', async () => {
    const { message, status } = await WebSettingsService.deleteBatch([1, 2], 'invalid token');

    expect(message).toBe('Unauthorized');
    expect(status).toBe(false);
  });

  it('deleteBatch(): should be error when not found', async () => {
    const { message, status } = await WebSettingsService.deleteBatch([2, 3], 'token');

    expect(message).toBe('Not found');
    expect(status).toBe(false);
  });
});
