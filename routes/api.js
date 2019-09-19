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
  
    .get(function (req, res){
      const projectname = req.params.project;
      const project = database.getSingleProject(projectname, (err, doc)=>{
        if(err!==null) {
          console.log(err);
          res.json({error:true, msg:err});
        } else {
          doc.error=false;
          
          console.log(doc)
          res.json(doc);
        }
      });
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
