var abonent_selected = undefined;
var users_status = "view";

// =========================================
// extract users
// =========================================
function extractUsers (data, id)
{
	if (typeof(data) == "string") 
	{
		$("#users_list").html(tmp);
		return;
	}
	var tmp = "";
	
	data.sort(function (a, b)
	{
		if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) return -1;
		if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) return  1;
	});
	
	for (var a = 0; a < data.length; a++)
	{
		if (id != undefined && id == data[a].id)
		{
			tmp += "<DIV CLASS='abonent_selected' ID='" + data[a].id + "'>" + data[a].lastName + " " + data[a].firstName + " " + data[a].fatherName + "</DIV>";
		}
		else
		{
			tmp += "<DIV CLASS='abonent' ID='" + data[a].id + "'>" + data[a].lastName + " " + data[a].firstName + " " + data[a].fatherName + "</DIV>";
		}
	}
	$("#users_list").html(tmp);
}

// =========================================
// SELECT CITY INPUT
// =========================================
$("#cityNameInput").change(function ()
{
	var value = $(this).val();
	
	for (var a = 0; a < codes_cache.length; a++)
	{
		if (codes_cache[a].id == value) $("#cityCodeInput").val(codes_cache[a].cityCode);
	}
});

// =========================================
// view user
// =========================================
$("DIV[CLASS^='abonent']").click(view_user);

function view_user ()
{
	abonent_selected = parseInt($(this).attr("ID"));
	
	$("div[class^='abonent']").attr("CLASS","abonent");
	$(this).attr("CLASS","abonent_selected");
	
	$("#delUser"    ).attr("DISABLED", false);
	$("#editUser"   ).attr("DISABLED", false);
	$("#addSaveUser").attr("VALUE","Добавить абонента");
	
	$(".user_info_input" ).val("").attr({"DISABLED": true, "PLACEHOLDER":""});
	$("#countryNameInput").attr("DISABLED", true);
	$("#cityNameInput"   ).attr("DISABLED", true);
	$(".user_info_text"  ).css("color","black");

	users_status = "view";
	
	$.ajax(
	{
		url: '/getUser',
		async: true,
		type: "get",
		data: {id: abonent_selected},
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				$("#firstNameInput"  ).val(respond.user.firstName  );
				$("#secondNameInput" ).val(respond.user.lastName   );
				$("#fatherNameInput" ).val(respond.user.fatherName );
				$("#phoneNumberInput").val(respond.user.phoneNumber);
				$("#cityCodeInput"   ).val(respond.user.cityCode   );
				$("#cityNameInput"   ).val(respond.user.cityName   );
				$("#countryNameInput").val(respond.user.countryName);
			}
			
			if ($("#cityNameInput").val() == null) $("#cityCodeInput").val("");
		}
	});
};

// =========================================
// delete user
// =========================================
$("#delUser").click(function ()
{
	console.log("Try delete user# " + abonent_selected);
	$("div[class^='abonent']").attr("CLASS","abonent");
	
	$(".user_info_input").val("");
	
	$.ajax(
	{
		url: '/delUser',
		async: true,
		type: "get",
		data: {id: abonent_selected},
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				extractUsers(respond.list);
				$(".abonent").click(view_user);
				$("#delUser"    ).attr("DISABLED", true);
				$("#editUser"   ).attr("DISABLED", true);
				$("#countryNameInput").val("-1");
				$("#cityNameInput"   ).val("-1");
			}
		}
	});
});

// =========================================
// change user
// =========================================
$("#editUser").click(function ()
{
	users_status = "edit";
	
	$(".user_info_input" ).attr("DISABLED", false);
	$("#cityCodeInput"   ).attr("DISABLED", true );
	
	$("#countryNameInput").attr("DISABLED", false);
	$("#cityNameInput"   ).attr("DISABLED", false);
	
	$("#delUser"         ).attr("DISABLED", true );
	$("#editUser"        ).attr("DISABLED", true );
	$("#addSaveUser"     ).attr("VALUE","Сохранить абонента");
});
// =========================================
// add user
// =========================================
$("#addSaveUser").click(function()
{
	if (users_status == "view") 
	{
		$(".user_info_input" ).val("").attr("DISABLED", false);
		$("#cityCodeInput"   ).val("").attr("DISABLED", true);
		
		$("#countryNameInput").val("-1").attr("DISABLED", false);
		$("#cityNameInput"   ).val("-1").attr("DISABLED", false);
		
		$("div[class^='abonent']").attr("CLASS","abonent");
		
		$("#addSaveUser").attr("VALUE","Сохранить абонента");
		$("#delUser"    ).attr("DISABLED", true);
		$("#editUser"   ).attr("DISABLED", true);
	
		users_status = "add";
		return;
	}
	
	var firstName   = $.trim($("#firstNameInput"  ).val());
	var secondName  = $.trim($("#secondNameInput" ).val());
	var fatherName  = $.trim($("#fatherNameInput" ).val());
	var phoneNumber = $.trim($("#phoneNumberInput").val());
	var cityCode    = $.trim($("#cityCodeInput"   ).val());
	var cityName    = $("#cityNameInput"   ).val();
	var countryName = $("#countryNameInput").val();

	var error = false;
	
	// check for first name
	if (!firstName.length)
	{
		$("#firstNameText").css("color","red");
		$("#firstNameInput").val("").attr("PLACEHOLDER","Введите имя!");
		error = true;
	}
	else
	{
		$("#firstNameText").css("color","green");
	}
	
	// check for second name
	if (!secondName.length)
	{
		$("#secondNameText").css("color","red");
		$("#secondNameInput").val("").attr("PLACEHOLDER","Введите фамилию!");
		error = true;
	}
	else
	{
		$("#secondNameText").css("color","green");
	}
	
	// check for phone number
	if (!phoneNumber.length || isNaN(phoneNumber))
	{
		$("#phoneNumberText").css("color","red");
		$("#phoneNumberInput").val("").attr("PLACEHOLDER","Введите корректный номер!");
		error = true;
	}
	else
	{
		$("#phoneNumberText").css("color","green");
	}
	
	// check for city code
	if (!cityCode.length || isNaN(cityCode))
	{
		$("#cityCodeText").css("color","red");
		$("#cityCodeInput").val("").attr("PLACEHOLDER","Введите код города!");
		error = true;
	}
	else
	{
		$("#cityCodeText").css("color","green");
	}
	
	// check for city name
	if (cityName == "-1" || cityName == null)
	{
		$("#cityNameText").css("color","red");
		error = true;
	}
	else
	{
		$("#cityNameText").css("color","green");
	}
	
	// check for country name
	if (countryName == "-1" || countryName == null)
	{
		$("#countryNameText").css("color","red");
		error = true;
	}
	else
	{
		$("#countryNameText").css("color","green");
	}
	
	if (error) return;
	
	
	$.ajax(
	{
		url: "/" + users_status + "User",
		async: true,
		type: "post",
		data:
		{
			firstName:   firstName,
			secondName:  secondName,
			fatherName:  fatherName,
			phoneNumber: phoneNumber,
			cityCode:    cityCode,
			cityName:    cityName,
			countryName: countryName,
			id: abonent_selected
		},
		
		success: function (respond)
		{
			if (respond.status == "OK")
			{
				if (users_status == "edit")
				{
					$(".user_info_input" ).attr({"DISABLED": true, "PLACEHOLDER":""});
					$("#countryNameInput").attr("DISABLED", true);
					$("#cityNameInput"   ).attr("DISABLED", true);
					extractUsers(respond.list, abonent_selected);
					
					$("#delUser" ).attr("DISABLED", false);
					$("#editUser").attr("DISABLED", false);
				}
				else
				{
					$(".user_info_input" ).val(""  ).attr({"DISABLED": true, "PLACEHOLDER":""});
					$("#countryNameInput").val("-1").attr("DISABLED", true);
					$("#cityNameInput"   ).val("-1").attr("DISABLED", true);
					extractUsers(respond.list);
				}
				
				$(".user_info_text" ).css("color","black");
				$("#addSaveUser").attr("VALUE","Добавить абонента");

				$("DIV[CLASS^='abonent']").click(view_user);
				users_status = "view";
			}
		}
	});
});

