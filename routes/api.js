/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var database = require('../helper/database.js');

/*const CONNECTION_STRING = process.env.DB;
MongoClient.connect(CONNECTION_STRING, function(err, db) {
  console.log("connected");
});*/

module.exports = function (app) {

  app.route('/api/issues/:project')
    // I can GET /api/issues/{projectname} for an array of all issues on that specific project
    // I can filter my get request by also passing along any field and value in the query
    .get(function (req, res){
      const projectname = req.params.project;
      // TODO: maybe some checks; allowed field ?
      const filter = req.query;
      const project = database.getProject(projectname, (err, doc)=>{
        if(err==null) {
          doc.error=false;
          res.json(doc);
        } else {
          console.log(err);
          res.json({error:true, msg:err});
        }
      }, filter);
    })
    
    // I can POST /api/issues/{projectname} with form data containing
    // required issue_title, issue_text, created_by, and optional assigned_to and status_text
    .post(function (req, res){
      req.body.projectname=req.params.project;
      req.body.open=true;
    
      database.insertIssue(req.body, (err, doc) => {
        if(err==null) res.json(doc);
        else {
          err.error=true;
          res.json(err);
        }
      });
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
