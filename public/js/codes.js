var code_selected = undefined;
var codes_status = "view";
var codes_cache;

// =========================================
// extract codes
// =========================================
function extractCodes (data, id)
{
	if (typeof(data) == "string") 
	{
		$("#codes_list").html(data);
		$("#cityNameInput").html("<OPTION VALUE='-1' SELECTED>Выберите город</OPTION>");
		return;
	}
	var tmp = "";
	data.sort(function (a, b)
	{
		if (a.cityName.toLowerCase() < b.cityName.toLowerCase()) return -1;
		if (a.cityName.toLowerCase() > b.cityName.toLowerCase()) return  1;
	});
	
	for (var a = 0; a < data.length; a++)
	{
		if (id != undefined && id == data[a].id)
		{
			tmp += "<DIV CLASS='ccode_selected' ID='" + data[a].id + "'>" + data[a].cityName + " " + data[a].cityCode + "</DIV>";
		}
		else
		{
			tmp += "<DIV CLASS='ccode' ID='" + data[a].id + "'>" + data[a].cityName + " " + data[a].cityCode + "</DIV>";
		}
	}
	
	$("#codes_list").html(tmp);
	
	// FILL <SELECT> <OPTION>
	tmp = "<OPTION VALUE='-1'>Выберите город</OPTION>";
	var flag = true;
	
	for (var a = 0; a < data.length; a++)
	{
		if ($("#cityNameInput").val() == data[a].id)
		{
			tmp += "<OPTION SELECTED VALUE='" + data[a].id + "'>" + data[a].cityName + "</OPTION>\r";
			flag = false;
		}
		else
		{
			tmp += "<OPTION VALUE='" + data[a].id + "'>" + data[a].cityName + "</OPTION>\r";
		}
	}
	
	$("#cityNameInput").html(tmp);
	if (flag) 
	{
		$("#cityNameInput").val(undefined);
		$("#cityCodeInput").val(undefined);
	}

}

// =========================================
// view code
// =========================================
$("DIV[CLASS^='ccode']").click(view_code);

function view_code ()
{
	code_selected = parseInt($(this).attr("ID"));
	console.log("CODE: " + code_selected);
	
	$("div[class^='ccode']").attr("CLASS","ccode");
	$(this).attr("CLASS","ccode_selected");
	
	$("#delCode"    ).attr("DISABLED", false);
	$("#editCode"   ).attr("DISABLED", false);
	$("#addSaveCode").attr("VALUE","Добавить код");
	
	$(".code_info_input").val("").attr({"DISABLED": true, "PLACEHOLDER":""});
	$(".code_info_text" ).css("color","black");

	codes_status = "view";
	
	$.ajax(
	{
		url: '/getCode',
		async: true,
		type: "get",
		data: {id: code_selected},
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				$("#codes_cityNameInput").val(respond.code.cityName);
				$("#codes_cityCodeInput").val(respond.code.cityCode);
			}
		}
	});
};

// =========================================
// delete code
// =========================================
$("#delCode").click(function ()
{
	console.log("Try delete code# " + code_selected);
	$("div[class^='ccode']").attr("CLASS","ccode");
	
	$(".code_info_input").val("");
	
	$.ajax(
	{
		url: '/delCode',
		async: true,
		type: "get",
		data: {id: code_selected},
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				codes_cache = respond.list;
				extractCodes(respond.list);
				$(".ccode").click(view_code);
				$("#delCode"    ).attr("DISABLED", true);
				$("#editCode"   ).attr("DISABLED", true);
			}
		}
	});
});

// =========================================
// change code
// =========================================
$("#editCode").click(function ()
{
	codes_status = "edit";
	
	$(".code_info_input").attr("DISABLED", false);
	$("#delCode"        ).attr("DISABLED", true);
	$("#editCode"       ).attr("DISABLED", true);
	$("#addSaveCode"    ).attr("VALUE","Сохранить код");
});

// =========================================
// add code
// =========================================
$("#addSaveCode").click(function()
{
	if (codes_status == "view") 
	{
		$(".code_info_input").val("").attr("DISABLED", false);
		$("div[class^='ccode']").attr("CLASS","ccode");
		
		$("#addSaveCode").attr("VALUE","Сохранить код");
		$("#delCode"    ).attr("DISABLED", true);
		$("#editCode"   ).attr("DISABLED", true);
	
		codes_status = "add";
		return;
	}
	
	var cityName = $.trim($("#codes_cityNameInput").val());
	var cityCode = $.trim($("#codes_cityCodeInput").val());

	var error = false;
	
	// check for city name
	if (!cityName.length)
	{
		$("#codes_cityName").css("color","red");
		$("#codes_cityNameInput").val("").attr("PLACEHOLDER","Введите название!");
		error = true;
	}
	else
	{
		$("#codes_cityName").css("color","green");
	}
	
	// check for city code
	if (!cityCode.length || isNaN(parseInt(cityCode)))
	{
		$("#codes_cityCode").css("color","red");
		$("#codes_cityCodeInput").val("").attr("PLACEHOLDER","Введите код!");
		error = true;
	}
	else
	{
		$("#codes_cityCode").css("color","green");
	}

	if (error) return;
	
	$.ajax(
	{
		url: "/" + codes_status + "Code",
		async: true,
		type: "post",
		data:
		{
			cityName: cityName,
			cityCode: cityCode,
			id:       code_selected
		},
		
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				codes_cache = respond.list;
				
				if (codes_status == "edit")
				{	
					$(".code_info_input").attr({"DISABLED": true, "PLACEHOLDER":""});
					extractCodes(respond.list, code_selected);
					
					$("#delCode" ).attr("DISABLED", false);
					$("#editCode").attr("DISABLED", false);
				}
				else
				{
					$(".code_info_input").val("").attr({"DISABLED": true, "PLACEHOLDER":""});
					extractCodes(respond.list);
				}
				$(".code_info_text" ).css("color","black");
				$("#addSaveCode").attr("VALUE","Добавить код");

				$("DIV[CLASS^='ccode']").click(view_code);
				codes_status = "view";
			}
		}
	});
});


// AFTER LOAD

$(document).ready(function ()
{
	$.ajax(
	{
		url: "/getCodes",
		async: true,
		type: "get",
		
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				codes_cache = respond.list;
			}
		}
	});
});
