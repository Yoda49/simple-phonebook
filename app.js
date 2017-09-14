// SIMPLE PHONEBOOK
// VER: 0.0.1

'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var app = express();

// server static content
app.use(express.static('./public'));

// for sequelize postgreSQL
var db = require('./db.js');
db.init();

// for rended
var view = require('./view.js');

app.use(function (req, res, next) 
{
  console.log("REQUEST: " + req.url);
  next();
});

// ==============================================================================
// index
// ==============================================================================
app.get('/', async function (req, res)
{
	var params = {};

	try
	{
		params.users_list = await db.User.findAll();
	}
	catch(e) {} // for empty table
	
	try
	{
		params.codes_list = await db.Code.findAll();
	}
	catch(e){} // for empty table
	
	try
	{
		params.countries_list = await db.Country.findAll();
	}
	catch(e){} // for empty table
	
	view(params, res); // render

});

// ==============================================================================
// users
// ==============================================================================
app.post('/addUser' , urlencodedParser, db.addUser );
app.post('/editUser', urlencodedParser, db.editUser);
app.get ('/getUser' , db.getUser);
app.get ('/delUser' , db.delUser);

// ==============================================================================
// codes
// ==============================================================================
app.post('/addCode'  , urlencodedParser, db.addCode );
app.post('/editCode' , urlencodedParser, db.editCode);
app.get ('/getCode'  , db.getCode);
app.get ('/getCodes' , db.getCodes);
app.get ('/delCode'  , db.delCode);

// ==============================================================================
// coutries
// ==============================================================================
app.post('/addCountry' , urlencodedParser, db.addCountry );
app.post('/editCountry', urlencodedParser, db.editCountry);
app.get ('/delCountry' , db.delCountry);



var port = 3002;
app.listen(port);
console.log("Server started at localhost. Port: " + port);
