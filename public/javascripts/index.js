
function Hanger(pHangerName, pConstruction, pColor, pSturdiness, pPantClips) {
    this.hangerName = pHangerName;
    this.construction = pConstruction;
    this.color = pColor;
    this.sturdiness = pSturdiness;
    this.pantClips = pPantClips;
  }
  
var HangerList = [];  // our local copy of the cloud data

//  modified by Khalid Mohamed
document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tHangerName = document.getElementById("hangerName").value;
        var tconstruction = document.getElementById("construction").value;
        var tcolor = document.getElementById("color").value;
        var tsturdiness = document.getElementById("sturdiness").value;
        var tpantClips = document.getElementById("pantClips").value;
        var oneHanger = new Hanger(tHangerName, tconstruction, tcolor, tsturdiness, tpantClips);

        $.ajax({
            url: '/NewHanger' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(oneHanger),
            success: function (result) {
                console.log("added new hanger")
            }

        });
    });

    document.getElementById("get").addEventListener("click", function () {
        updateList()
    });
  


    // Code for deleting a single hanger - modified by Ken Evans
    document.getElementById("delete").addEventListener("click", function () {
        
        var whichHanger = document.getElementById('deleteName').value;
        var idToDelete = "";
        for(i=0; i< HangerList.length; i++){
            if(HangerList[i].hangerName === whichHanger) {
                idToDelete = HangerList[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({  
                    url: 'DeleteHanger/'+ idToDelete,
                    type: 'DELETE',  
                    contentType: 'application/json',  
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
        }
        else {
            console.log("NO matching Hanger Name! Unable to DELETE");
        } 
    });



    var idToFind = ""; // using the same value from the find operation for the modify

    // Code to find one hanger to change - modified by Ken Evans
    document.getElementById("find").addEventListener("click", function () {
        var tName = document.getElementById("modName").value;
        idToFind = "";
        for(i=0; i< HangerList.length; i++){
            if(HangerList[i].hangerName === tName) {
                idToFind = HangerList[i]._id;
           }
        }
        console.log(idToFind);
 
        $.get("/FindHanger/"+ idToFind, function(data, status){ 
            console.log(data[0].hangerName);
            document.getElementById("mname").value = data[0].hangerName;
            document.getElementById("mconstruction").value= data[0].construction;
            document.getElementById("mcolor").value = data[0].color;
            document.getElementById("msturdiness").value = data[0].sturdiness;
            document.getElementById("mpantclips").value = data[0].pantClips;
           
        });
    });



    // Code for modifying a single hanger - modified by Ken Evans
    document.getElementById("msubmit").addEventListener("click", function () {
        var tName = document.getElementById("mname").value;
        var tConstruction = document.getElementById("mconstruction").value;
        var tColor = document.getElementById("mcolor").value;
        var tSturdiness = document.getElementById("msturdiness").value;
        var tPantClips = document.getElementById("mpantclips").value;

        if (tPantClips != true || tPantClips != 'True') {
            tPantClips = false;
        } else {
            tPantClips = true;
        }


        var oneHanger = new Hanger(tName, tConstruction, tColor, tSturdiness, tPantClips);
        
            $.ajax({
                url: 'UpdateHanger/'+idToFind,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(oneHanger),
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Update Operation');  
                    }  
                });   
       
    });

    

    // get the server data into the local array
    updateList();

});


function updateList() {
var ul = document.getElementById('listUl');
ul.innerHTML = "";  // clears existing list so we don't duplicate old ones

//var ul = document.createElement('ul')

//  modified by Khalid Mohamed
$.get("/Hanger", function(data, status){  // AJAX get
    HangerList = data;  // put the returned server json data into our local array

    // sort array by one property
    //HangerList.sort(compare);  // see compare method below
    console.log(data);
    //listDiv.appendChild(ul);
    HangerList.forEach(ProcessOneToDo); // build one li for each item in array
    function ProcessOneToDo(item, index) {
        var li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML=li.innerHTML + index + ": " + " Hanger Name: " + item.hangerName + " Construction: " + item.construction + " Color: " + item.color + " Sturdiness: " + item.sturdiness +  " Pant Clips? "+ item.pantClips;
    }
});
}

function compare(a,b) {
    if (a.completed == false && b.completed== true) {
        return -1;
    }
    if (a.completed == false && b.completed== true) {
        return 1;
    }
    return 0;
}
