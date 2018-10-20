var users = [];
var inhtml;
var userId = -1;

function getInput(){

	var user = new Object();

	user.from = new Date(document.getElementById("date-from").value);
	user.to = new Date(document.getElementById("date-to").value);
	user.leaveTime = (Math.abs(user.to.getTime() - user.from.getTime()))/ (1000 * 3600 * 24) + 1; 
	var radio = document.getElementsByName("leaveType");
	user.leaveType = "";

	if(radio[0].checked) user.leaveType = radio[0].value;
	else user.leaveType = radio[1].value;

	user.leaveReason = document.getElementById("leave-reason").value;
	user.emarContact = document.getElementById("emergency-contact").value;
	var imgInput = document.getElementById('imgFile').files[0];

	var onSuccess = function(e){

		user.img = e;

		if(userId!=-1){
			users[userId] = user;
			userId = -1;
		}
		else{
			users.push(user);
		}

		console.log(users);

		sessionStorage.setItem("users",JSON.stringify(users));

		window.location.href = "listOfLeave.html";

	};

  	var onError = function(e){
    	alert(e.message);
  	};

  	var reader  = new FileReader();

    reader.onload = function(){
    	getImageDataURL(reader.result, onSuccess, onError);
    };

    reader.readAsDataURL(imgInput);

}

function showTable(){

    console.log('show table');

    users = JSON.parse(sessionStorage.users);

    console.log(users);

	for(var i=0;i<users.length;i++){
		var user = users[i];

		//console.log('right here');
		//console.log(user);

		var table = document.getElementById("myTable");
	    var row = table.insertRow(i+1);
	    var cell1 = row.insertCell(0);
	    var cell2 = row.insertCell(1);
	    var cell3 = row.insertCell(2);
	    var cell4 = row.insertCell(3);
	    var cell5 = row.insertCell(4);
	    var cell6 = row.insertCell(5);
	    cell1.innerHTML = user.leaveTime;
	    cell2.innerHTML = user.leaveType;
	    cell3.innerHTML = user.leaveReason;
	    cell4.innerHTML = user.emarContact;
	    cell5.innerHTML = "<img src='"+user.img+"' height=50 width=50 alt='hello'/>";
	    cell6.innerHTML = "<button class='delete' value='"+i+"'onclick='deleteUser(this)'>Delete</button><button class='edit' value='"+i+"'onclick='editUser(this)'>Edit</button>";
		

	}

}

function deleteUser(objButton){  
    var index = objButton.value;
    console.log(index);
    users.splice(index, 1);
    sessionStorage.setItem("users",JSON.stringify(users));
	window.location.href = "listOfLeave.html";
}

function editUser(objButton){  
    userId = objButton.value;
    reqPage();
}

function reqPage(){
	sessionStorage.setItem("users",JSON.stringify(users));
	sessionStorage.setItem("userId",JSON.stringify(userId));
	window.location.href = "reqForm.html";
}

function dataForEdit(){
	
	if (sessionStorage.getItem("users") !== null) {
		users = JSON.parse(sessionStorage.users);
		if (sessionStorage.getItem("userId") !== null) {
		  	userId = JSON.parse(sessionStorage.userId);
		  	console.log('here edit datas');
		  	console.log(users);
		  	if(userId!=-1){
		    	document.getElementById("leave-reason").value = users[userId].leaveReason;
		    	document.getElementById("emergency-contact").value = users[userId].emarContact;
		    	document.getElementById(users[userId].leaveType).checked = true;
		    	document.getElementById("date-from").value = users[userId].from.slice(0,10);
		    	document.getElementById("date-to").value = users[userId].to.slice(0,10);	
		    	console.log(typeof users[userId].from);
		    }
		}
	}

}

function getImageDataURL(url, success, error) {
    var data, canvas, ctx;
    var img = new Image();
    img.onload = function(){
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        try{
            data = canvas.toDataURL();
            success(data);
        }catch(e){
            error(e);
        }
    }
    // Load image URL.
    try{
        img.src = url;
    }catch(e){
        error(e);
    }
}