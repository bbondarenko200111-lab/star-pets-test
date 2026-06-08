import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('API тесты (jsonplaceholder)', () => {
  const uniqueIdempotencyKey = `key-${Date.now()}`;

  test('Позитивный контракт: POST /posts', async ({ request }) => {
    const payload = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };

    const response = await request.post(`${BASE_URL}/posts`, {
      data: payload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();

    // проверка структуры и типов
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
    expect(body.userId).toBe(payload.userId);
  });

  test('Негатив: запрос без обязательного поля title', async ({ request }) => {
    const payload = {
      body: 'bar',
      userId: 1,
    };

    const response = await request.post(`${BASE_URL}/posts`, {
      data: payload,
    });

    // jsonplaceholder не валидирует, возвращает 201 даже с неполными данными
    // но в реальном API ожидаем 400. Комментарий для StarPets:
    expect(response.status()).toBe(201);
    // ⚠️ В реальном бэкенде StarPets здесь должен быть 400 Bad Request
  });

  test('Негатив: невалидные данные (userId строка вместо числа)', async ({ request }) => {
    const payload = {
      title: 'foo',
      body: 'bar',
      userId: 'not-a-number',
    };

    const response = await request.post(`${BASE_URL}/posts`, {
      data: payload,
    });
    // jsonplaceholder всё равно принимает, но в реальном API ожидаем 422
    expect(response.status()).toBe(201);
    // ⚠️ В реальном бэкенде StarPets: 422 Unprocessable Entity
  });

  test('API без токена 401', async ({ request }) => {
    const response = await request.post(`https://users.apineural.com/api/user/profile`);
    
    expect(401).toContain(response.status())
   });

  test('Идемпотентность: 3 одинаковых POST с одним X-Idempotency-Key', async ({ request }) => {
    const idempotencyKey = uniqueIdempotencyKey;
    const payload = {
      title: 'idempotent',
      body: 'test',
      userId: 1,
    };

    const responses = [];
    for (let i = 0; i < 3; i++) {
      const res = await request.post(`${BASE_URL}/posts`, {
        data: payload,
        headers: {
          'X-Idempotency-Key': idempotencyKey,
        },
      });
      responses.push(res);
    }

    // jsonplaceholder не поддерживает идемпотентность, но для StarPets:
    // первый запрос → 201, второй и третий → 200 (или 409) с тем же id
    for (let i = 1; i < responses.length; i++) {
      expect(responses[i].status()).toBe(responses[0].status());
      const body1 = await responses[0].json();
      const body2 = await responses[i].json();
      expect(body2.id).toBe(body1.id);
    }
  });
});
