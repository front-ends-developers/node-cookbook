'use strict';

const path = require('path');
const assert = require('assert');
const request = require('supertest');

const fixutres = [
  '01_http',
  '02_micro',
  '03_express',
  '04_cycle',
  '05_koa',
];

for (const target of fixutres) {
  const baseDir = path.join(__dirname, '../example', target);
  let app;

  describe(`=== ${target} ===`, () => {
    before(() => {
      app = require(baseDir);
    });

    it('should GET /', () => {
      return request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200);
    });

    it('should list todo', () => {
      return request(app)
        .get('/api/todo')
        .expect('Content-Type', /json/)
        .expect('X-Response-Time', /\d+ms/)
        .expect(200)
        .then(res => {
          assert(res.body[0].title.includes('Express'));
        });
    });

    it('should GET list with filter: completed=false', () => {
      return request(app)
        .get('/api/todo')
        .query({ completed: false })
        .expect('Content-Type', /json/)
        .expect('X-Response-Time', /\d+ms/)
        .expect(200)
        .then(res => {
          assert(res.body[0].title.includes('Egg'));
        });
    });

    it('should add todo', () => {
      return request(app)
        .post('/api/todo')
        .send({ title: 'Add one' })
        .expect('Content-Type', /json/)
        // .expect('X-Response-Time', /\d+ms/)
        .expect(201)
        .then(res => {
          assert(res.body.id);
          assert(res.body.title === 'Add one');
          assert(res.body.completed === false);
        });
    });

    it('should add todo fail', () => {
      return request(app)
        .post('/api/todo')
        .send({ title: undefined })
        .expect(500);
    });

    it('should update todo', async () => {
      await request(app)
        .put('/api/todo')
        .send({ id: '1', title: 'Modify Express' })
        .expect('X-Response-Time', /\d+ms/)
        .expect(204);

      // validate
      await request(app)
        .get('/api/todo')
        .expect(200)
        .then(res => {
          assert(res.body[0].title === 'Modify Express');
        });
    });

    it('should update todo fail', () => {
      return request(app)
        .put('/api/todo')
        .send({ id: '-1', title: 'Modify Express' })
        .expect(500);
    });

    it('should delete todo', async () => {
      await request(app)
        .delete('/api/todo/1')
        .expect(204);

      // validate
      await request(app)
        .get('/api/todo')
        .expect('X-Response-Time', /\d+ms/)
        .expect(200)
        .then(res => {
          assert(res.body[0].title.includes('Koa'));
        });
    });

    it('should delete todo fail', () => {
      return request(app)
        .delete('/api/todo/999')
        .expect(500);
    });

    it('should 404', () => {
      return request(app).get('/no_exist').expect(404);
    });
  });

}
