/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
     var globalBody={}; 
  
     // tdd-variant of bdd: before() - once before all suites, NOT each
     suiteSetup(function() {      
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'before-title',
            issue_text: 'before-text',
            status_text: 'before-status-text',
            created_by: 'before-created-by',
            assigned_to: 'before-assigned-to'
          })
          .end(function(err, res){
            globalBody = res.body;        
          });  
     });
  
  
    // suite 1
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);         
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');

          assert.equal(res.body.open, true);
          assert.approximately(new Date(res.body.created_on).getTime(), new Date().getTime(), 9000);
          assert.approximately(new Date(res.body.updated_on).getTime(), new Date().getTime(), 9000);

          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);         
            //assert.equal(res.params.project, 'test'); -> don't work
            assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'text');
            assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');

            assert.equal(res.body.open, true);
            assert.approximately(new Date(res.body.created_on).getTime(), new Date().getTime(), 9000);
            assert.approximately(new Date(res.body.updated_on).getTime(), new Date().getTime(), 9000);
            done();
          });        
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
             status_text: 'Functional Test - Missing required fields'
          })
          .end(function(err, res){
            assert.equal(res.status, 500); 
            assert.equal(res.text, 'Missing required fields: issue_title, issue_text, created_by'); 
            done();
          
          });         
      });      
    });
    
  
    // suite 2
    suite('PUT /api/issues/{project} => text', function() {        
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send()
          .end(function(err, res){
            console.log(res.text); // No document was updated. Maybe "_id" doesn't exist.
            assert.equal(res.status, 500); 
            done();
          });         
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: globalBody._id,
            issue_text: 'issue_text - updated'
          })
          .end(function(err, res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.issue_text, 'issue_text - updated'); 
            done();
          }); 
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: globalBody._id,
            issue_title: 'issue_title - updated - 2',
            issue_text: 'issue_text - updated - 2'
          })
          .end(function(err, res){
            assert.equal(res.status, 200); 
            assert.equal(res.body.issue_title, 'issue_title - updated - 2');
            assert.equal(res.body.issue_text, 'issue_text - updated - 2'); 
            done();
          }); 
      });
      
    });
  
    
    // suite 3
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){       
          // entries with projectname=test must be deleted before testing
          // to be sure all fields are set by suiteSetup() for res.body[0]
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({"issue_title":"before-title"})
        .end(function(err, res){       
          assert.equal(res.status, 200);
          assert.isArray(res.body);        
          assert.equal(res.body[0]['issue_title'], 'before-title');
         done();
        });        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({"issue_title":"before-title","issue_text":"before-text"})
        .end(function(err, res){       
          assert.equal(res.status, 200);
          assert.isArray(res.body);    
          assert.isAtLeast(res.body.length, 1);
          assert.equal(res.body[0]['issue_title'], 'before-title');
          assert.equal(res.body[0]['issue_text'], 'before-text');
         done();
        });         
      });
      
      // extra-test
      test('Multiple filters - no results', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({"issue_title":"before-title","issue_text":"DOESN'T EXIST"})
        .end(function(err, res){       
          assert.equal(res.status, 200);
          assert.isArray(res.body);        
          assert.equal(res.body.length, 0);
         done();
        });         
      });
      
    });
    
  
    // suite 4
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){ 
          //console.log(res.status, res.text)
          assert.equal(res.status, 200);
          assert.equal(JSON.parse(res.text).failed, "could not delete undefined");
         done();
        });         
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id:globalBody._id})
        .end(function(err, res){ 
          assert.equal(res.status, 200);
          assert.equal(JSON.parse(res.text).success, "deleted "+globalBody._id);
         done();
        });          
      });
      
      // extra
      test('Nonsense _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({_id:'NONSENSE'})
        .end(function(err, res){ 
          // Cast to ObjectId failed for value "NONSENSE" at path "_id" for model "issue"
          assert.equal(res.status, 500);
         done();
        });          
      });      
      
    });

});
