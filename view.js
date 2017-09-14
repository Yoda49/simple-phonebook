var fs = require('fs');

function render (params, res)
{
	// ================================================
	// CREATE HTML FOR USERS LIST
	// ================================================
	if (params.users_list == undefined || params.users_list.length == 0)
	{
		params.users_list = "Записи отсутствуют";
	}
	else
	{	
		var tmp = "";
		
		params.users_list.sort(function (a, b)
		{
			if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) return -1;
			if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) return  1;
		});
		
		for (var a = 0; a < params.users_list.length; a++)
		{
			tmp += "<DIV CLASS='abonent' ID='" + params.users_list[a].id + "'>" + " " + params.users_list[a].lastName + " " + params.users_list[a].firstName + " " + params.users_list[a].fatherName + "</DIV>";
		}
		params.users_list = tmp;
	}
	
	// ================================================
	// CREATE HTML FOR CODES LIST
	// ================================================
	if (params.codes_list == undefined || params.codes_list.length == 0)
	{
		params.codes_list = "Записи отсутствуют";
		params.cities_select = "";
	}
	else
	{
		var tmp = "";
		params.cities_select = "<OPTION VALUE='-1' SELECTED>Выберите город</OPTION>"; // for <SELECT> <OPTION>
		
		params.codes_list.sort(function (a, b)
		{
			if (a.cityName.toLowerCase() < b.cityName.toLowerCase()) return -1;
			if (a.cityName.toLowerCase() > b.cityName.toLowerCase()) return  1;
		});

		for (var a = 0; a < params.codes_list.length; a++)
		{
			tmp += "<DIV CLASS='ccode' ID='" + params.codes_list[a].id + "'>" + params.codes_list[a].cityName + " " + params.codes_list[a].cityCode + "</DIV>";
			params.cities_select += "<OPTION VALUE='" + params.codes_list[a].id + "'>" + params.codes_list[a].cityName + "</OPTION>";
		}
		params.codes_list = tmp;
	}
	
	
	// ================================================
	// CREATE HTML FOR COUNTRIES LIST
	// ================================================
	if (params.countries_list == undefined || params.countries_list.length == 0)
	{
		params.countries_list = "Записи отсутствуют";
		params.countries_select = "";
	}
	else
	{
		var tmp  = "";
		params.countries_select = "<OPTION VALUE='-1' SELECTED>Выберите страну</OPTION>"; // for <SELECT> <OPTION>
		
		params.countries_list.sort(function (a, b)
		{
			if (a.countryName.toLowerCase() < b.countryName.toLowerCase()) return -1;
			if (a.countryName.toLowerCase() > b.countryName.toLowerCase()) return  1;
		});

		for (var a = 0; a < params.countries_list.length; a++)
		{
			tmp += "<DIV CLASS='ccountry' ID='" + params.countries_list[a].id + "'>" + params.countries_list[a].countryName + "</DIV>";
			params.countries_select += "<OPTION VALUE='" + params.countries_list[a].id + "'>" + params.countries_list[a].countryName + "</OPTION>\r";
		}
		params.countries_list = tmp;
	}
	
	// ================================================
	// RENDER
	// ================================================
	fs.readFile("./view/index.html", function (error, buffer)
	{
		if (error) throw error;
		else
		{
			buffer = "" + buffer;
			for (var key in params) buffer = buffer.replace(new RegExp('{{{' + key + '}}}', 'g'), params[key]);
			res.send(buffer);
		}
	});
	
}


module.exports = render;