var request = require('supertest');
var app = require('./app');

var restaurants = [{name:'Feijao'}, {name:'Sujinho'},{ name: 'Barba'}];
var users = [{name:'Tony Stark'}, {name:'Bruce Banner'},{name: 'That guy with wings'}];

describe('Request to the root path', function(){
  it('Returns 200 status code', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Returns HTML index', function(done){
    request(app)
      .get('/')
      .expect('Content-Type', /html/, done);
  });

  it('Returns an index file', function(done){
    request(app)
      .get('/')
      .expect(/restaurants/i, done);
  });

});

describe('Listing restaurants', function(){
  it('Returns 200', function(done){
    request(app)
        .get('/restaurants')
        .expect(200,done);
  });

  it('Returns JSON', function(done){
    request(app)
        .get('/restaurants')
        .expect('Content-Type',/json/)
        .end(function(error){
          if(error) throw error;
          done();
        });
  });

  it('Return restaurants', function(done){
    request(app)
      .get('/restaurants')
      .expect(JSON.stringify(restaurants), done);
  });
});

describe('Listing users', function(){
  it('Returns 200', function(done){
    request(app)
      .get('/users')
      .expect(200, done);
  });

  it('Returns JSON', function(done){
    request(app)
      .get('/users')
      .expect('Content-Type',/json/)
      .end(function(error){
        if(error) throw error;
        done();
      });
  });

  it('Returns users', function(done){
    request(app)
      .get('/users')
      .expect(JSON.stringify(users), done);
  });
});
