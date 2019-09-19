var mongo = require('mongodb');
var mongoose = require('mongoose');
// https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var Schema = mongoose.Schema;

// connect --------------------------------
exports.connect = () => {
  // connect to database
  mongoose.connect(process.env.DB, {
      useNewUrlParser: true
    }).catch(err => { // Promise
      console.log(err);
    });
}

// check connection -----------------------
exports.checkConnection = () => {
  /*
  0: disconnected
  1: connected
  2: connecting
  3: disconnecting
  */
  if(mongoose.connection.readyState==0 || mongoose.connection.readyState==3) {
    console.log("no-connection: "+mongoose.connection.readyState);
    return false;
  }  
  return true;
}

// schema --------------------------------
const issuesSchema = new Schema({
  projectname: {type: String, unique:true}, //* -> not-relational
	issue_title: {type: String}, //* -> unique in combination with projectname ???
  issue_text: {type: String}, //*
	created_on: {type: Date, default: Date.now},//auto
  updated_on: {type: Date, default: Date.now},//auto
  created_by: {type: String},//*
  assigned_to: {type: String},//mand
  open: {type: Boolean},//???
  status_text: {type: String}//mand
});

// model --------------------------------
const Issues = mongoose.model('issue', issuesSchema ); // Mongoose:issue <=> MongoDB:issues


// read --------------------------------
// get project by projectname
// next(projectname|false)
exports.getSingleProject = (projectname, next) => {
  // doc is a Mongoose-object that CAN'T be modified
  // lean()+exec() will return a plain JS-object instead
  Issues.findOne({projectname: projectname}).lean().exec((err, docs) => { 
    if(docs==null) { // entry doesn't exist
      next('no entry found', null);      
    } else {
      next(null, docs);
    }
  });
}
