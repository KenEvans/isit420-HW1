
function Hanger(pHangerName, pConstruction, pColor, pSturdiness, pPantClips) {
    this.hangerName = pHangerName;
    this.construction = pConstruction;
    this.color = pColor;
    this.sturdiness = pSturdiness;
    this.pantClips = pPantClips;
  }
  
var HangerList = [];  // our local copy of the cloud data

document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tTitle = document.getElementById("title").value;
        var tDetail = document.getElementById("detail").value;
        var tPriority = document.getElementById("priority").value;
        var oneToDo = new Hanger(tTitle, tDetail, tPriority);

        $.ajax({
            url: '/NewToDo' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(oneToDo),
            success: function (result) {
                console.log("added new note")
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

    // Code for modifying a single hanger - modified by Ken Evans
    document.getElementById("msubmit").addEventListener("click", function () {
        var tTitle = document.getElementById("mtitle").value;
        var tDetail = document.getElementById("mdetail").value;
        var tPriority = document.getElementById("mpriority").value;
        var oneToDo = new Hanger(tTitle, tDetail, tPriority);
        oneToDo.completed =  document.getElementById("mcompleted").value;
        
            $.ajax({
                url: 'UpdateToDo/'+idToFind,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(oneToDo),
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
            
       
    });

    
    
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
            document.getElementById("mtitle").value = data[0].title;
            document.getElementById("mdetail").value= data[0].detail;
            document.getElementById("mpriority").value = data[0].priority;
            document.getElementById("mcompleted").value = data[0].completed;
           

        });
    });

    // get the server data into the local array
    updateList();

});


function updateList() {
var ul = document.getElementById('listUl');
ul.innerHTML = "";  // clears existing list so we don't duplicate old ones

//var ul = document.createElement('ul')

$.get("/ToDos", function(data, status){  // AJAX get
    HangerList = data;  // put the returned server json data into our local array

    // sort array by one property
    HangerList.sort(compare);  // see compare method below
    console.log(data);
    //listDiv.appendChild(ul);
    HangerList.forEach(ProcessOneToDo); // build one li for each item in array
    function ProcessOneToDo(item, index) {
        var li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML=li.innerHTML + index + ": " + " Priority: " + item.priority + "  " + item.title + ":  " + item.detail + " Done? "+ item.completed;
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
