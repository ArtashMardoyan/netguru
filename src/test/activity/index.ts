///<reference path='../../../node_modules/@types/mocha/index.d.ts'/>
'use strict';

process.env.NODE_ENV = 'test';

import * as chaiHttp from 'chai-http';

import Activity from './../../models/Activity';
import server from './../../server';

const chai = require('chai');
const should = chai.should();

chai.use(chaiHttp);

describe('Activity', () => {
  beforeEach((done) => { // Before each test we empty the database
    Activity.remove({}, (err) => {
      done();
    });
  });
  /*
    * Test the /GET route
    */
  describe('/GET activities', () => {
    it('it should GET all the activity', (done) => {
      chai.request(server)
          .get('/api/activities')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data.docs.should.be.a('array');
            res.body.data.docs.length.should.be.eql(0);
            done();
          });
    });
  });

  describe('/GET/:id activities', () => {
    it('it should GET a activities by the given id', (done) => {
      let activity = new Activity({
        title: 'test',
        shortDescription: 'test',
        objectives: 'test',
        duration: 12345,
        competencies: 'test',
        templateType: 'content',
        type: 'test',
        thumbnail: 'test',
        modality: 'pairs',
        activitySteps: ['5ace571b667d5d4ae7f22d6c']
      });
      activity.save((err, activity) => {
        chai.request(server)
            .get('/api/activities/' + activity._id)
            .send(activity)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.data.should.have.property('objectives');
              res.body.data.should.have.property('duration');
              res.body.data.should.have.property('competencies');
              res.body.data.should.have.property('templateType');
              res.body.data.should.have.property('type');
              res.body.data.should.have.property('thumbnail');
              res.body.data.should.have.property('modality');
              res.body.data.should.have.property('activitySteps');
              res.body.data.should.have.property('_id').eql(activity.id);
              done();
            });
      });
    });
  });

  describe('/POST activities', () => {
    it('it should not POST a activity without title shortDescription pages', (done) => {
      const activity = {
        objectives: 'test',
        duration: 12345,
        competencies: 'test',
        templateType: 'content',
        type: 'test',
        thumbnail: 'test',
        modality: 'pairs',
        activitySteps: ['5ace571b667d5d4ae7f22d6c']
      };
      chai.request(server)
          .post('/api/activities')
          .send(activity)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.data.should.have.property('error');
            res.body.data.error.should.be.a('array');
            res.body.data.error[0].message.should.have.eql('err required');
            done();
          });
    });

    it('it should POST a activity ', (done) => {
      const activity = {
        title: 'test',
        shortDescription: 'test',
        objectives: 'test',
        duration: 12345,
        competencies: 'test',
        templateType: 'content',
        type: 'test',
        thumbnail: 'test',
        modality: 'pairs',
        activitySteps: ['5ace571b667d5d4ae7f22d6c']
      };
      chai.request(server)
          .post('/api/activities')
          .send(activity)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Created');
            res.body.data.should.have.property('shortDescription');
            res.body.data.should.have.property('activitySteps');
            res.body.data.should.have.property('competencies');
            res.body.data.should.have.property('templateType');
            res.body.data.should.have.property('objectives');
            res.body.data.should.have.property('thumbnail');
            res.body.data.should.have.property('duration');
            res.body.data.should.have.property('title');
            res.body.data.should.have.property('type');
            done();
          });
    });
  });

  describe('/PUT/:id activity', () => {
    it('it should UPDATE a activity given the id', (done) => {
      const data = {
        title: 'test',
        shortDescription: 'test',
        objectives: 'test',
        duration: 12345,
        competencies: 'test',
        templateType: 'content',
        type: 'test',
        thumbnail: 'test',
        modality: 'pairs',
        activitySteps: ['5ace571b667d5d4ae7f22d6c']
      };
      const activity = new Activity(data);
      activity.save((err, activity) => {
        chai.request(server)
            .put('/api/activities/' + activity.id)
            .send(data)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('name').eql('Ok');
              res.body.data.should.have.property('modality').eql('pairs');
              done();
            });
      });
    });
  });

  describe('/DELETE/:id activity', () => {
    it('it should DELETE a activity given the id', (done) => {
      const activity = new Activity({
        title: 'test',
        shortDescription: 'test',
        objectives: 'test',
        duration: 12345,
        competencies: 'test',
        templateType: 'content',
        type: 'test',
        thumbnail: 'test',
        modality: 'pairs',
        activitySteps: ['5ace571b667d5d4ae7f22d6c']
      });
      activity.save((err, activity) => {
        chai.request(server)
            .delete('/api/activities/' + activity.id)
            .end((err, res) => {
              res.should.have.status(204);
              res.body.should.be.a('object');
              res.body.should.be.eql({});
              done();
            });
      });
    });
  });
});
