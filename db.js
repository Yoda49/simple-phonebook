var Sequelize = require("sequelize");
var filter = {};

var db = 
{
	sequelize: undefined,
	User: undefined,
	Code: undefined,
	Country: undefined,
	
	//===================================================
	// INIT
	//===================================================
	
	init: function ()
	{
		this.sequelize = new Sequelize('test', 'postgres', 'password', {
			host: 'localhost',
			dialect: 'postgres',

			pool: {
				max: 5,
				min: 0,
				idle: 10000
			},
		});
		
		this.User = this.sequelize.define('user', {
			firstName: {
				type: Sequelize.STRING
			},
			lastName: {
				type: Sequelize.STRING
			},
			fatherName: {
				type: Sequelize.STRING
			},
			phoneNumber: {
				type: Sequelize.INTEGER
			},
			cityCode: {
				type: Sequelize.INTEGER
			},
			cityName: {
				type: Sequelize.STRING
			},
			countryName: {
				type: Sequelize.INTEGER
			}
		});

		this.Code = this.sequelize.define('code', {
			cityName: {
				type: Sequelize.STRING
			},
			cityCode: {
				type: Sequelize.INTEGER
			}
		});
		
		this.Country = this.sequelize.define('country', {
			countryName: {
				type: Sequelize.STRING
			}
		});
		
		this.sequelize.authenticate()
		.then(() => {
			console.log('Connection has been established successfully.');
		})
		.catch(err => {
			console.error('Unable to connect to the database:', err);
		});
	},
	
	//===================================================
	// ADD USER
	//===================================================
	addUser: async function (req, res)
	{
		var user_data = 
		{
			firstName:   req.body.firstName,
			lastName:    req.body.secondName,
			fatherName:  req.body.fatherName,
			phoneNumber: req.body.phoneNumber,
			cityCode:    req.body.cityCode,
			cityName:    req.body.cityName,
			countryName: req.body.countryName
		}
		
		await db.User.sync();	
		await db.User.create(user_data);
		
		var list = await db.User.findAll();
		res.json({status: "OK", list: list});
	},
	
	//===================================================
	// EDIT USER
	//===================================================
	editUser: async function (req, res)
	{
		var user_data = 
		{
			firstName:   req.body.firstName,
			lastName:    req.body.secondName,
			fatherName:  req.body.fatherName,
			phoneNumber: req.body.phoneNumber,
			cityCode:    req.body.cityCode,
			cityName:    req.body.cityName,
			countryName: req.body.countryName
		}
		
		filter.where = {id: req.body.id};
		
		await db.User.sync();
		await db.User.update(user_data, filter);
		
		var list = await db.User.findAll();
		res.json({status: "OK", list: list});
	},
	
	
	
	//===================================================
	// GET USER
	//===================================================
	getUser: async function (req, res)
	{
		filter.where = {id: req.query.id};
		
		var user = await db.User.findOne(filter);
		res.json({status: "OK", user: user});
	},
	
	//===================================================
	// DELETE USER
	//===================================================
	delUser: async function (req, res)
	{
		filter.where = {id: req.query.id};
		await db.User.destroy(filter);
		
		var list = await db.User.findAll();
		res.json({status: "OK", list: (list.length == 0 ? "Записи отсутствуют": list)});
	},
	
	//===================================================
	// GET CODE
	//===================================================
	getCode: async function (req, res)
	{
		filter.where = {id: req.query.id};
		var code = await db.Code.findOne(filter);
		res.json({status: "OK", code: code});
	},
	
	//===================================================
	// GET ALL CODES
	//===================================================
	getCodes: async function (req, res)
	{
		var list = await db.Code.findAll();
		res.json({status: "OK", list: list});
	},
	
	//===================================================
	// ADD CODE
	//===================================================
	addCode: async function (req, res)
	{
		var code_data = 
		{
			cityName: req.body.cityName,
			cityCode: req.body.cityCode,
		}
		
		await db.Code.sync();	
		await db.Code.create(code_data);
		
		var list = await db.Code.findAll();
		res.json({status: "OK", list: list});
	},
	
	//===================================================
	// EDIT CODE
	//===================================================
	editCode: async function (req, res)
	{
		var code_data = 
		{
			cityName: req.body.cityName,
			cityCode: req.body.cityCode,
		}
		
		filter.where = {id: req.body.id};
		
		await db.Code.sync();
		await db.Code.update(code_data, filter);
		
		var list = await db.Code.findAll();
		res.json({status: "OK", list: list});
	},
	
	//===================================================
	// DELETE CODE
	//===================================================
	delCode: async function (req, res)
	{
		filter.where = {id: req.query.id};
		await db.Code.destroy(filter);
		
		var list = await db.Code.findAll();
		res.json({status: "OK", list: (list.length == 0 ? "Записи отсутствуют": list)});
	},
	
	//===================================================
	// ADD COUNTRY
	//===================================================
	addCountry: async function (req, res)
	{
		var country_data = 
		{
			countryName: req.body.countryName
		}
		
		await db.Country.sync();	
		await db.Country.create(country_data);
		
		var list = await db.Country.findAll();
		res.json({status: "OK", list: list});
	},
	
	//===================================================
	// EDIT COUNTRY
	//===================================================
	editCountry: async function (req, res)
	{
		var country_data = 
		{
			countryName: req.body.countryName
		}
		
		filter.where = {id: req.body.id};
		
		await db.Country.sync();
		await db.Country.update(country_data, filter);
		
		var list = await db.Country.findAll();
		res.json({status: "OK", list: list});
	},
	
	//===================================================
	// DELETE COUNTRY
	//===================================================
	delCountry: async function (req, res)
	{
		filter.where = {id: req.query.id};
		await db.Country.destroy(filter);
		
		var list = await db.Country.findAll();
		res.json({status: "OK", list: (list.length == 0 ? "Записи отсутствуют": list)});
	}


}

module.exports = db;