import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/cat-admin-api/login', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
]
