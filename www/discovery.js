//  Declare Varibales which are using in AJAX method.

var Type;
var Url;
var Data;
var ContentType;
var DataType;
var ProcessData;
var PremFois=0;
var	login="";
var  pw="";
var url = "";
var PWCrypte="";

// save authentification in localstorage

function SaveAuth()
{
$('#busy').show();	

 var login =$('#name').val();
	   var pw= $('#password').val();
CryptagePW();	
window.localStorage.setItem("login", login);
 window.localStorage.setItem("pw", PWCrypte);
 window.localStorage.setItem("urlOrg", "http://10.13.50.2/crmfrm");
getFormEntitiesMobile();	

 


 // "offlineChangeRecords" comporte les modifications effectuées dans les enregistrements en mode offline
 // "NumberOfflineChangeRecords" est le nombre de modifications effectuées en mode offline
var FormatOfflineVide = { };
var FormatOfflineVideString = JSON.stringify(FormatOfflineVide);
localStorage.setItem('offlineChangeRecords', FormatOfflineVideString);
localStorage.setItem('NumberOfflineChangeRecords', 0);




}
// enregistrer les paramétres d'authentification dans le smartphone
function recordAuth()
{

// vérifier si l'utilisateur a choisi une organisation ou pas
if(document.getElementById("orgName").options[document.getElementById("orgName").selectedIndex].value=="")
{
alert("Veuillez choisir une organisation");

}
else
{
$('#busy').show();	
SaveAuth();
getFormEntitiesMobile();

}
}
// Cryptage Password
function CryptagePW()
{
	
 var request ={ u: {pw:$('#password').val()}};
    var jsondata = JSON.stringify(request);
    Type = "POST";
    Url = "http://"+sessionStorage.getItem("hostName")+"/WcfMobileHLI/Service1.svc/CryptagePW";
    Data = jsondata;
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    // Call the Web Service....
    CallCrypPW();

}
function  CallCrypPW()
{
$.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: Data, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False
        crossDomain: true,
		   async:false,
        success: function (msg) {
            //On Successfull service call
            ServiceSucceededCryptPW(msg);
        },
        error: ServiceFailed  // When Service call fails
    });


}
function ServiceSucceededCryptPW(result) {

    if (DataType == "json") {
        resultObject = result.CryptagePWResult;
        if (resultObject) {

		
PWCrypte=resultObject;


        }
        else {

            alert("erreur");
			}
    }

    else {
        alert("Result Data type is not JSON");
    }
}


// get form of all entities
var nameFile="";
var formDesciption= new Array(10);
var tabNameEntity = new Array(10);

var numTabEnCours=0;
tabNameEntity[0]="task";
tabNameEntity[1]="appointment";
tabNameEntity[2]="hli_alerte";
tabNameEntity[3]="hli_sms";
tabNameEntity[4]="lead";
tabNameEntity[5]="opportunity";
tabNameEntity[6]="contact";

tabNameEntity[7]="phonecall";
tabNameEntity[8]="quote";
tabNameEntity[9]="account";




function getFormEntitiesMobile()
{


getFormEntityMobile("task");

}
function getFormEntityMobile(entityName)
{

 var request ={ u: {login: window.localStorage.getItem("login"), pw: window.localStorage.getItem("pw"),url:window.localStorage.getItem("urlOrg") ,entity:entityName}};
    var jsondata = JSON.stringify(request);
    Type = "POST";
    Url = "http://"+sessionStorage.getItem("hostName")+"/WcfMobileHLI/Service1.svc/formulaireEntity";
    Data = jsondata;
    ContentType = "application/json; charset=utf-8";
    DataType = "json";
    ProcessData = true;
    // Call the Web Service....
    CallgetFormEntityMobile();

}
function CallgetFormEntityMobile()
{
$.ajax({
        type: Type, //GET or POST or PUT or DELETE verb
        url: Url, // Location of the service
        data: Data, //Data sent to server
        contentType: ContentType, // content type sent to server
        dataType: DataType, //Expected data format from server
        processdata: ProcessData, //True or False
        crossDomain: true,
		   async:true,
        success: function (msg) {
            //On Successfull service call
            ServiceSucceededGetForm(msg);
        },
        error: ServiceFailed  // When Service call fails
    });

}

function ServiceSucceededGetForm(result) {

    if (DataType == "json") {
        resultObject = result.formulaireEntityResult;
    
        if (resultObject) {

      
        formDesciption[numTabEnCours]=resultObject;

 window.localStorage.setItem(tabNameEntity[numTabEnCours], formDesciption[numTabEnCours]);
numTabEnCours=numTabEnCours+1;
//alert(nameFile);
     next();
	
    



        }
        else {

            alert("erreur");
			}
    }

    else {
        alert("Result Data type is not JSON");
    }
}

   var Num=0;
function next()
{
if(numTabEnCours<10)
{
	
//alert(tabNameEntity[numTabEnCours]);
getFormEntityMobile(tabNameEntity[numTabEnCours]);

}
if(numTabEnCours==10)
{
numTabEnCours=0;
fillDB();
$('#busy').hide();	
window.location = "accueil.html";

}
}

// enregistrer les comptes actifs , contact actif et les rendre dans le smartphone(Mémoire interne)

function fillDB()
{
	 document.addEventListener("deviceready", constructionBaseLocal , false);
	
}

function constructionBaseLocal()
{
   initDB("account");
   initDB("contact");
   initDB("appointment");
  navigator.notification.alert("BD created with Succes!");
}

var donnees ;
var entityName ;

function initDB(entity)
{
  entityName = entity ;
  console.log("Appel initdb");
  $request = { u: {login:window.localStorage.getItem("login"), pw: window.localStorage.getItem("pw"),urlOrg : window.localStorage.getItem("urlOrg"), entity:entity } };
          $.ajax({
			type: 'POST',
            async: false,
            url:'http://'+sessionStorage.getItem("hostName")+'/WcfMobileHLI/Service1.svc/GetRecordsOffline',
			data: JSON.stringify($request),
			contentType: "application/json",
            dataType:'json',
            crossDomain: true,
            success: function(data) {
			   
				donnees = JSON.stringify(data.GetRecordsOfflineResult);

				console.log("Appel Ajax avec succes");
				console.log("donnees :"+donnees);
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




function ServiceFailed(result) {
 $('#busy').hide();
  var elem=document.getElementById('List');
   alert("Erreur d'authentification");  
   window.location="discovery.html";
   Type = null; Url = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
}

function ServiceFailed1(result) {
 $('#busy').hide();
  var elem=document.getElementById('List');
   alert("erreur de chargement");  
   window.location="discovery.html";
   Type = null; Url = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
}
$(document).ready
(
function () {


    $('#submitAuth').click
(
function (event) {

	sessionStorage.setItem('hostName', 'www.crmhli.com:81');

    event.preventDefault();	
	
   SaveAuth();
		

}
);
}
);
