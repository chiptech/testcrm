var donnees ;
var entityName ;

$(document).ready( function () {
  
	document.addEventListener("deviceready", init , false);
}
);


function init() {
	if(navigator.network.connection.type == Connection.NONE) {
		navigator.notification.alert("You are OffLine!");
		window.location = "offline.html";
	}else {
		navigator.notification.alert("You are OnLine!");
		fillDB();
		window.location = "online.html";
	}
}
function fillDB()
{
	 initDB("account");
 	 initDB("contact");
	 initDB("appointment");
	 navigator.notification.alert("BD created with Succes!");
}
function initDB(entity , viewId)
{
  entityName = entity ;
  console.log("Appel initdb");
  $request = { u: {login:'admincrm', pw: 'Operating0', entity:entity } };
          $.ajax({
			type: 'POST',
            async: false,
            url:'http://10.13.121.74:80/WcfMobileHLI/Service1.svc/offLine/GetRecords',
			data: JSON.stringify($request),
			contentType: "application/json",
            dataType:'json',
            crossDomain: true,
            success: function(data) {
			   
				donnees = JSON.stringify(data.GetRecordsResult);
				console.log("Appel Ajax avec succes");
				
				store();
            },
                error: function (xhr) {
                    console.log(xhr.responseText);
                    alert(xhr.responseText);
                }
          });
}

function store()
{
	console.log("appel fonction store");
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}
function gotFS(fileSystem) {

		var fileName = entityName+"s.txt";
        fileSystem.root.getFile(fileName, {create: true, exclusive: false}, gotFileEntry, fail);
    }
function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

function gotFileWriter(writer) {
    
        writer.write(donnees);
        writer.onwriteend = function(evt) {
           console.log("end writing "); }
		   
}

 function fail(error) {
        console.log(error.code);
    }
