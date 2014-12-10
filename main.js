var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = 'ois.seminar';
var password = 'ois4fri';

function getSessionId(){
	var response = $.ajax({
		type: "POST",
		url: baseUrl + '/session?username='+ encodeURIComponent(username) + '&password=' + encodeURIComponent(password),
		async: false
	});

	return response.responseJSON.sessionId;
}

function generirajTestnePodatke(){
	var test1 = {
		firstName: 'Santa',
		lastName: 'Claus'
	};
	var test2 = {
		firstName: 'John',
		lastName: 'Smith'
	};
	var test3= {
		firstName: 'Janez',
		lastName: 'Novak'
	};

	$('.dropdown-menu').append($('<li>').append($('<button>').text(test1.firstName+' '+test1.lastName).addClass('btn dropdown-btn')));
	$('.dropdown-menu').append($('<li>').append($('<button>').text(test2.firstName+' '+test2.lastName).addClass('btn dropdown-btn')));
	$('.dropdown-menu').append($('<li>').append($('<button>').text(test3.firstName+' '+test3.lastName).addClass('btn dropdown-btn')));

	$('#test-gen').hide();

	createNewPatient(test1);
}

function createNewPatient(patient){
	var sessionId = getSessionId();
	console.log(sessionId);

	$.ajaxSetup({
		headers: {
			"Ehr-Session": sessionId
		}
	});
	$.ajax({
		url: baseUrl + '/ehr',
		type: 'POST',
		success: function(data){
			var ehrId = data.ehrId;
			$('#data').html("EHR id: "+ehrId);

			var partyData = {
				firstNames: patient.firstName,
				lastNames: patient.lastName,
				partyAdditionalInfo: [{key: 'ehrId',value: ehrId}]
			};
			$.ajax({
				url: baseUrl + 'demographics/party',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(partyData),
				success: function(party){
					if(party.action == 'CREATE'){
						$('#data-visual').html('Created: '+party.meta.href);
					}
				}
			});
		}
	});
}
