var request = require('supertest');
var app = require('./app');

var restaurants = [{id:1, name:'Feijao', lastTimeVote:null, lastUser: null, totalVote: 0},
                   {id:2, name:'Sujinho', lastTimeVote:null, lastUser: null, totalVote: 0},
                   {id:3, name: 'Barba', lastTimeVote:null, lastUser: null, totalVote: 0}];
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

  it('Vote in one restaurant - success', function(done){
    var rest = {"id":1,"name":"Feijao","lastTimeVote":null,"lastUser":{"name":"Tony Stark"},"totalVote":0};
      request(app)
        .put('/restaurants/' + rest.id)
        .send(rest)
        .expect(200, done);

  });

  it('Vote in the same restaurant - error', function(done){
    var rest = {"id":1,"name":"Feijao","lastTimeVote":null,"lastUser":{"name":"Tony Stark"},"totalVote":0};
      request(app)
        .put('/restaurants/' + rest.id)
        .send(rest)
        .send(rest)
        .expect(400, done);
  });

  it('Choose restaurant to go', function(done){
    var rest = {"id":1,"name":"Feijao","lastTimeVote":null,"lastUser":{"name":"Tony Stark"},"totalVote":0};
    request(app)
      .post('/restaurants/' + rest.id + '/go')
      .send(rest)
      .expect(200, done);
  });

  it('Choose restaurant to go in the same week', function(done){
    request(app)
      .post('/restaurants/' + rest.id + '/go')
      .send(rest)
      .expect(400, done);
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
