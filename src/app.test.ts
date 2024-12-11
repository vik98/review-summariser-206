import request from 'supertest';

import App from './app';

const appInstance = new App();

describe('app', () => {
  it('responds with a not found message', (done) => {
    request(appInstance.app)
      .get('/what-is-this-even')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('GET /', () => {
  it('responds with a json message', (done) => {
    request(appInstance.app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'Hello World!',
      }, done);
  });
});
