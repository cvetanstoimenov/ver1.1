
document.addEventListener("deviceready", onDeviceReady, false);


function onDeviceReady() {

}

$(document).bind("mobileinit", function(){
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
});


function onLoad(){

	var unsuccessefullyAjaxSendData = [];
	var IdOfSelectedClan;
	var nameOfSelectedClan;
	var chosenTab;
	var mainArrayData = [];
	
	var idVotingPlace;
	$("#headerDiv").hide();
    $("#loading").hide();
	$("#pleaseWait").hide();
	$("#second #contentConfirmation #searchDiv").hide();
    $("#second #contentConfirmation .horizontal-group-buttons").hide();
	$("#headerDiv").hide();

	$("#btn_ok").click(function(e){
		var username = $("#inputEmail").val();
		var password = $("#password").val();
		if(!username || !password){
			$(".requiredFieldsValidation").text("Molimo ispunite sva potrebna polja");
			e.preventDefault();
			return;
		}		
		GetVotingPlaceIfClanExist(username, password);		
	});   // end of the function after login button click
      

     
	$('#second #contentConfirmation .btn-tab').click(function () {
	    chosenTab = $(this).attr('name');
		if(chosenTab == "refresh")
		{		
			$("#result").html("");
			GetAllClanoviOfThisVotingPlace(idVotingPlace);
		}
		else
		{
			DisplayResult(mainArrayData);
		}
	    
	});


	$("#second").on("click", "li", function () {
	    IdOfSelectedClan = $(this).attr('id');
		nameOfSelectedClan = $(this).attr('data-nameOfSeletedClan')
	    var currentTaskStatusOfSelectedClan = $(this).attr('name');
	    SetDataOnModal(currentTaskStatusOfSelectedClan, nameOfSelectedClan);
	    $.mobile.changePage('#dialog', 'pop', true, true);
	});

	
	    
	$('#dialog .ui-content a').on("click", function () {   // start of "click" event handler on selected Clan
	    $("#second #contentConfirmation #filterBasic-input").val("");
		 
		$("#dialog .ui-content #firstA").addClass("ui-disabled");
		$("#dialog .ui-content #secondA").addClass("ui-disabled");
		 //disable close button 
		$( "#dialog" ).dialog({ disabled: true });	 
		 
		var chosenTaskStatus = $(this).attr('name');
		GetChangeTaskActivityStatusOfThisUser(idVotingPlace, IdOfSelectedClan, chosenTaskStatus);	    
	});
	
	
	



	function DisplayResult(array) {
	    $("#result").html("");
		$("#loading").hide();
		$("#pleaseWait").hide();
		$("#second #contentConfirmation #searchDiv").show();
		$("#headerDiv").show();
		
		$("#second #contentConfirmation .horizontal-group-buttons").show();
	    if (chosenTab == "svi") {
	        $.each(array, function (index, element) {
	            $("#result").append('<li name="' + $.trim(element.TaskStatus) + '" id="' + $.trim(element.ClanId) + '" data-nameOfSeletedClan="' + element.Fullname + '" data-theme="c" class="parent-li ui-btn ui-li ui-li-has-count ui-li-has-icon ui-btn-up-c "><div class="ui-btn-inner ui-li" aria-hidden="true"><div class="ui-btn-text"><a href="#dialog"  class="ui-link-inherit li-my-style" data-rel="dialog" name="' + $.trim(element.TaskStatus) + '" ><div class="img-my-style ' + $.trim(element.TaskStatus) + '" >' + element.Fullname+ '</a></div></li>');
	            
	        });
	    }
	    else if (chosenTab == "preostali") {
	        $.each(array, function (index, element) {
	            if (element.TaskStatus == "open") {
	                $("#result").append('<li name="' + $.trim(element.TaskStatus) + '" id="' + $.trim(element.ClanId) + '" data-nameOfSeletedClan="' + element.Fullname + '" data-theme="c" class="parent-li ui-btn ui-li ui-li-has-count ui-li-has-icon ui-btn-up-c "><div class="ui-btn-inner ui-li" aria-hidden="true"><div class="ui-btn-text"><a href="#dialog"  class="ui-link-inherit li-my-style" data-rel="dialog" name="' + $.trim(element.TaskStatus) + '" ><div class="img-my-style ' + $.trim(element.TaskStatus) + '">' + element.Fullname+ '</a></div></li>');
	               
	            }
	        });
	    }
	    else if (chosenTab == "evidentirani") {
	        $.each(array, function (index, element) {
	            if (element.TaskStatus == "completed" || element.TaskStatus == "cancelled") {
	                $("#result").append('<li name="' + $.trim(element.TaskStatus) + '" id="' + $.trim(element.ClanId) + '" data-nameOfSeletedClan="' + element.Fullname + '" data-theme="c" class="parent-li ui-btn ui-li ui-li-has-count ui-li-has-icon ui-btn-up-c "><div class="ui-btn-inner ui-li" aria-hidden="true"><div class="ui-btn-text"><a href="#dialog"  class="ui-link-inherit li-my-style" data-rel="dialog" name="' + $.trim(element.TaskStatus) + '" ><div class="img-my-style ' + $.trim(element.TaskStatus) + '">' + element.Fullname+ '</a></div></li>');
	              
	            }
	        });
	    }
	    $('#result').listview('refresh');
	}
      

   



      function SetDataOnModal(currentTaskStatusOfSelectedClan, nameOfSelectedClan) {
		  $(".IdOfSelectedClan").text(nameOfSelectedClan);
		  
          if (currentTaskStatusOfSelectedClan == "open") {
              $("#dialog .ui-content #firstA").attr("name", "cancelled"); $("#firstImage").attr("src", "block.png"); $("#firstTextTd").html("cancelled");
              $("#dialog .ui-content #secondA").attr("name", "completed"); $("#secondImage").attr("src", "tick.png"); $("#secondTextTd").html("completed");
          }
          else if (currentTaskStatusOfSelectedClan == "completed") {
              $("#dialog .ui-content #firstA").attr("name", "open"); $("#firstImage").attr("src", "add.png"); $("#firstTextTd").html("open");
              $("#dialog .ui-content #secondA").attr("name", "cancelled"); $("#secondImage").attr("src", "block.png"); $("#secondTextTd").html("cancelled");
          }
          else if (currentTaskStatusOfSelectedClan == "cancelled") {
              $("#dialog .ui-content #firstA").attr("name", "open"); $("#firstImage").attr("src", "add.png"); $("#firstTextTd").html("open");
              $("#dialog .ui-content #secondA").attr("name", "completed"); $("#secondImage").attr("src", "tick.png"); $("#secondTextTd").html("completed");
          }
      }


      function ChangeTaskActivityStatusOfThisUser(array, selectedClan, chosenTaskStatus) {
       $('#dialog').dialog("close");
		$.grep(array, function(e)
			{ 
				if (e.ClanId == selectedClan) {
					  e.TaskStatus = chosenTaskStatus;
				}
			}
		);
	  DisplayResult(array,"svi");
	  }
	  
    
      //event handler for back button if there are still data
       function onBackKeyDown() {
           if (unsuccessefullyAjaxSendData.length != 0) {
               $("#stillData").modal('show');
           }
       }

    
      function GetAllClanoviOfThisVotingPlace(idVotingPlace) {
		  $("#pleaseWait").show();
		  $("#loading").show();
		  $("#second #contentConfirmation #searchDiv").hide();
		  $("#second #contentConfirmation .horizontal-group-buttons").hide();
		  $("#headerDiv").hide();
		
         var arr = [];
         $.ajax({
             type: "GET",
             url: "https://213.147.98.155/api/values/GetAllClanoviOfThisVotingPlace",
             dataType: "json",
             data: { idVotingPlace: idVotingPlace },
             contentType: "application/json; charset=utf-8",
             success: function (data, textStatus, XmlHttpRequest) {				  
					$.each(data, function (index, value) {
					arr.push({ 'Fullname': value.Fullname, 'ClanId': value.ClanId, 'TaskStatus': value.TaskStatus});
					});
					if(arr.length != 0)
					{
						mainArrayData = arr;
						setInterval(TrySendUnsuccessfullyAjaxSentData, 60000);  //call function to check if there are data which were not sent in previous ajax call for changing task status
						chosenTab = "svi";
						DisplayResult(arr);
						return;
					}
					else {
						$("#loading").hide();
						$("#pleaseWait").hide();
						$.mobile.changePage('#noDataMessage', { role: "dialog" });
					}
			},    // end of success
			error: function (xhr, textStatus, errorThrown) {
			}
          });
      }





      // this function is calling every 60 seconds
      function TrySendUnsuccessfullyAjaxSentData() {
          if (unsuccessefullyAjaxSendData.length != 0) {
              $.each(unsuccessefullyAjaxSendData, function (index, element) {
                  GetChangeTaskActivityStatusOfThisUser(element.idVotingPlace, element.IdOfSelectedClan, element.openCompletedCancelled, index);
              });
          }
      }






      // this function makes changes in CRM server via ajax calls
      function GetChangeTaskActivityStatusOfThisUser(idVotingPlace, IdOfSelectedClan, openCompletedCancelled, index) {
		
         $.ajax({
             type: "GET",
             url: "https://213.147.98.155/api/values/GetChangeTaskActivityStatusOfThisUser",
             dataType: "json",
             data: { votingPlaceId: idVotingPlace, contactId: IdOfSelectedClan, openCompletedCancelled: openCompletedCancelled },
             contentType: "application/json; charset=utf-8",
             success: function (data, textStatus, XmlHttpRequest) {	
				$("#dialog .ui-content #firstA").removeClass("ui-disabled");
				$("#dialog .ui-content #secondA").removeClass("ui-disabled");	
				$( "#dialog" ).dialog({ disabled: false });		  
				if(data == true)
				{				
					ChangeTaskActivityStatusOfThisUser(mainArrayData, IdOfSelectedClan,  openCompletedCancelled);   //this function change data directly in UI
					var exist = CheckIfElementExistInArray(unsuccessefullyAjaxSendData, IdOfSelectedClan);
					if (exist == true) {
						unsuccessefullyAjaxSendData.splice(index, 1);
					}
				}
				else
			    {					
				   $.mobile.changePage('#errorTaskChange', { role: "dialog" });
				}				  
              },
              error: function (xhr, textStatus, errorThrown) {
					$("#dialog .ui-content #firstA").removeClass("ui-disabled");
					$("#dialog .ui-content #secondA").removeClass("ui-disabled");
					$( "#dialog" ).dialog({ disabled: false });
                 var exist = CheckIfElementExistInArray(unsuccessefullyAjaxSendData, IdOfSelectedClan);
                 if (exist == false) {
				      ChangeTaskActivityStatusOfThisUser(mainArrayData, IdOfSelectedClan,  "loadingSmall");   //this function change data directly in UI
                     unsuccessefullyAjaxSendData.push({ 'idVotingPlace': idVotingPlace, 'IdOfSelectedClan': IdOfSelectedClan, 'openCompletedCancelled': openCompletedCancelled });
                 }
             }
         });
      }




      function CheckIfElementExistInArray(array, elementId) {
          var exist = false;
          $.each(array, function (index, element) {
              if (element.IdOfSelectedClan == elementId) {
                  exist = true;
              }
          });
          return exist;
      }






      function GetVotingPlaceIfClanExist(jusername, jpassword) {
         $.ajax({
             url: "https://213.147.98.155/api/values/GetVotingPlaceIfClanExist",
             dataType: "json",
             data:{username:jusername,password:jpassword},
             contentType: "application/json; charset=utf-8",
             success: function (data, textStatus, XmlHttpRequest) {
					idVotingPlace = data.VotingPlaceId;
					GetAllClanoviOfThisVotingPlace(data.VotingPlaceId);					
             },
             error: function (xhr, textStatus, errorThrown) {
				  $.mobile.changePage('#errorLogin', { transition: 'pop'});
             }
         });
      }


};