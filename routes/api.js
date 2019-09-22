/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var database = require('../helper/database.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
    // I can GET /api/issues/{projectname} for an array of all issues on that specific project
    // I can filter my get request by also passing along any field and value in the query
    .get(function (req, res){
      const projectname = req.params.project;
// TODO: maybe some checks; allowed field ?
      const filter = req.query;
      const project = database.getProject(projectname, (err, doc)=>{
        if(err==null) res.json(doc);
        else {
          console.log(err);
          res.status(500).send(err.message);
        }
      }, filter);
    })
    
// TODO: check mandatory fields and send 500
    // I can POST /api/issues/{projectname} with form data containing
    // required issue_title, issue_text, created_by, and optional assigned_to and status_text
    .post(function (req, res){
      req.body.projectname=req.params.project;
      req.body.open=true;
    
      database.insertIssue(req.body, (err, doc) => {
        if(err==null) res.json(doc);
        else {
          console.log(err);
          res.status(500).send(err.message);
        }
      });
    })
    
    // I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object
    .put(function (req, res){
      //cannot be updated - at least not here (danger of inconsistent issues)
      //var projectname = req.params.project;
    
      database.updateIssue(req.body._id, req.body, (err, doc) => {
        if(err==null) res.json(doc);
        else {
          console.log(err);
          res.status(500).send(err.message);
        }
      });
    })
    
    // I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. 
    // If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
    .delete(function (req, res){
      var projectname = req.params.project;
      database.deleteIssue(req.body._id, (err, resultObject) => {
        if(err==null) {
          if(resultObject.deletedCount==0) res.json({failed: 'could not delete ' + req.body._id});
          else res.json({success: 'deleted ' + req.body._id});
        } else {
          console.log(err);
          res.status(500).send(err.message);
        }
      });
    });
    
};
