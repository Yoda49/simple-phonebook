var country_selected = undefined;
var country_status = "view";

// =========================================
// extract countries
// =========================================
function extractCountries (data, id)
{
	// if empty
	if (typeof(data) == "string") 
	{
		$("#countries_list"  ).html(data);
		$("#countryNameInput").html("<OPTION VALUE='-1' SELECTED>Выберите страну</OPTION>");
		return;
	}
	
	var tmp = "";
	data.sort(function (a, b)
	{
		if (a.countryName.toLowerCase() < b.countryName.toLowerCase()) return -1;
		if (a.countryName.toLowerCase() > b.countryName.toLowerCase()) return  1;
	});
	
	// FILL COUNTRIES LIST
	for (var a = 0; a < data.length; a++)
	{
		if (id != undefined && id == data[a].id)
		{
			tmp += "<DIV CLASS='ccountry_selected' ID='" + data[a].id + "'>" + data[a].countryName  + "</DIV>";
		}
		else
		{
			tmp += "<DIV CLASS='ccountry' ID='" + data[a].id + "'>" + data[a].countryName  + "</DIV>";
		}	
	}
	$("#countries_list").html(tmp);
	
	// FILL <SELECT> <OPTION>
	tmp = "<OPTION VALUE='-1'>Выберите страну</OPTION>";
	var flag = true;
	
	for (var a = 0; a < data.length; a++)
	{
		if ($("#countryNameInput").val() == data[a].id)
		{
			tmp += "<OPTION SELECTED VALUE='" + data[a].id + "'>" + data[a].countryName + "</OPTION>\r";
			flag = false;
		}
		else
		{
			tmp += "<OPTION VALUE='" + data[a].id + "'>" + data[a].countryName + "</OPTION>\r";
		}
	}
	
	$("#countryNameInput").html(tmp);
	if (flag) $("#countryNameInput").val(undefined);
}


// =========================================
// view code
// =========================================
$("DIV[CLASS^='ccountry']").click(view_country);

function view_country ()
{
	country_selected = parseInt($(this).attr("ID"));
	
	$("div[class^='ccountry']").attr("CLASS","ccountry");
	$(this).attr("CLASS","ccountry_selected");
	
	$("#delCountry"    ).attr("DISABLED", false);
	$("#editCountry"   ).attr("DISABLED", false);
	$("#addSaveCountry").attr("VALUE","Добавить страну");
	
	$("#country_input").val("").attr({"DISABLED": true, "PLACEHOLDER":""});
	$("#country_text" ).css("color","black");

	country_status = "view";
	
	$("#country_input").val($(this).html());
};

// =========================================
// delete code
// =========================================
$("#delCountry").click(function ()
{
	$("div[class^='ccountry']").attr("CLASS","ccountry");
	
	$("#country_input").val("");

	$.ajax(
	{
		url: '/delCountry',
		async: true,
		type: "get",
		data: {id: country_selected},
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				extractCountries(respond.list);
				$(".ccountry").click(view_country);
				$("#delCountry"  ).attr("DISABLED", true);
				$("#editCountry" ).attr("DISABLED", true);
			}
		}
	});
});

// =========================================
// change code
// =========================================
$("#editCountry").click(function ()
{
	country_status = "edit";
	
	$("#country_input" ).attr("DISABLED", false);
	$("#delCountry"    ).attr("DISABLED", true);
	$("#editCountry"   ).attr("DISABLED", true);
	$("#addSaveCountry").attr("VALUE","Сохранить страну");
});

// =========================================
// add code
// =========================================
$("#addSaveCountry").click(function()
{
	if (country_status == "view")
	{
		$("#country_input").val("").attr("DISABLED", false);
		$("div[class^='ccountry']").attr("CLASS","ccountry");
		
		$("#addSaveCountry").attr("VALUE","Сохранить страну");
		$("#delCountry"    ).attr("DISABLED", true);
		$("#editCountry"   ).attr("DISABLED", true);
	
		country_status = "add";
		return;
	}
	
	var countryName = $.trim($("#country_input").val());

	var error = false;
	
	// check for country name
	if (!countryName.length)
	{
		$("#country_text").css("color","red");
		$("#country_input").val("").attr("PLACEHOLDER","Введите название!");
		error = true;
	}
	else
	{
		$("#country_text").css("color","green");
	}


	if (error) return;
	
	$.ajax(
	{
		url: "/" + country_status + "Country",
		async: true,
		type: "post",
		data:
		{
			countryName: countryName,
			id:          country_selected
		},
		
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				if (country_status == "edit")
				{
					extractCountries(respond.list, country_selected);
					$("#country_input" ).attr({"DISABLED": true, "PLACEHOLDER":""});
					
					$("#delCountry" ).attr("DISABLED", false);
					$("#editCountry").attr("DISABLED", false);
				}
				else
				{
					extractCountries(respond.list);
					$("#country_input" ).val("").attr({"DISABLED": true, "PLACEHOLDER":""});
				}
				$("#country_text"  ).css("color","black");
				$("#addSaveCountry").attr("VALUE","Добавить страну");

				$("DIV[CLASS^='ccountry']").click(view_country);
				country_status = "view";
			}
		}
	});
});

