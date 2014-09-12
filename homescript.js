/**
 * javascript functions for home.html
 * 
 * JavaScript for class and link
 *  entry and table manipulation
 */

var c0 = ["Generic Class", "Generic Link"];
var classes = [c0]; //holds arrays of class info [[className0, link0, link1], [className1, link0, link1, etc.], etc.]
var scratch = 2;
var classCount = 1;


/*
* when the page loads, this function is called
* it checks for any previously stored data
* if there is previously stored data, the generic
* first row is removed, then the classes array is 
* looped through to restore the appearance from
* the user's last session
*/
function startup(){
	var cookieish = localStorage.getItem("classes"); //like, but not a cookie
	// localStorage.clear(); //used to delete stored data

	if(cookieish == null){
		return; //the user has not visited before from this browser
	}

	//reassign classes its value from previous sessions
	classes = JSON.parse(cookieish);

	//remove initial row
	var tr = document.getElementById("row1")
	tr.parentNode.removeChild(tr);

	//repopulate the table
	var count = classes.length;
	// alert("classes.length = " + count);
	for(var i = 0; i < count; i++){
		//add each class and its links to the table
		var c = classes[i][0];
		c = clean(c);
		addClass(c); //add class
		var linkcount = classes[i].length - 1;
		for(var j = 1; j <= linkcount; j++){
			var actualLink = JSON.stringify(classes[i][j]);
			var cname = JSON.stringify(classes[i][0]);
			actualLink = clean(actualLink);
			cname = clean(cname);
			// alert("cname is " + cname);
			addLink(cname, actualLink); //add link
		}
	}
}

/*
* saves a cookie containg classes for easy page reconstruction on each visit
* should be called after each time classes is updated
*/
function save(){
	var classesString = JSON.stringify(classes);
	// alert(classesString);
 	// createCookie("cookie", "test", 30);
 	localStorage.setItem("classes", classesString);
	// alert("Attempted to save");
}

/*
* adds a class, updating the page and the array 
*/
function addClass(className) {
	var alreadyAdded = 1;
	if(className === ""){
		className = prompt("What is the name of the class you are trying to add?","Ex. RHET 105");
		alreadyAdded = 0;
	}

	var class1 = classes[0][0];

	if(className == null){
		return;
	}

	if (class1 === "Generic Class") { //setting first class
		document.getElementById("p1").innerHTML = className;

		classCount = classCount + 1;
		//keep the classes array updated
		classes[0][0] = className;
	} else {
		//add new row
		var table = document.getElementById("maintable");
		var row = table.insertRow(table.rows.length);
		row.id = "row" + (table.rows.length - 1); //may need to change if extra links are taking up more rows

		//insert the new cells
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		// 		var cell4 = row.insertCell(3);

		//adding text and stuff
		var pCName = document.createElement("p");
		pCName.id = "p" + (table.rows.length - 1); //will be different when adding new rows for links
		pCName.innerHTML = className;
		cell1.appendChild(pCName);

		var checkBox = document.createElement("input");
		checkBox.id = "cb" + table.rows.length - 1;
		checkBox.type = "checkbox";
		checkBox.style.cssFloat = "right";
		cell2.appendChild(checkBox);

		var link = document.createElement("a");
		link.href = "http://www.google.com";
		link.innerHTML = "Click \"Add Link\"";
		// alert("Class count " +classCount);
		link.id = "l" + classCount + "1"; //l11 or l21 or l31 ... first number increments by number of classes second increments by number of links in that class
		classCount = classCount + 1;
		// alert("Class count " +classCount);
		// alert("link.id = " + link.id);
		cell3.appendChild(link);
		
		//keep classes array updated
		if(alreadyAdded == 0){
			var newClass = [className, "Click \"Add Link\""];
			classes.push(newClass);
		}
	}
	save(); //update the cookie for the next time the user logs on
}

function addLink(className, actualLink) {
	// 	alert("You are trying to add a link");
	if(actualLink == "" || className == ""){ //not called on page load
		className = prompt("To which class do you want to add another link?","Ex. RHET 105");
	}
	
	if(className == null){ //no user input
		return;
	}

	for (var i = 0; i < classes.length; i++) {
		var name = classes[i][0]; //get the class name from the array
		// var name = "\""+name+"\"";
		// alert(name + " " + className);
		if (name === className) {
			var l1 = classes[i][1]; //check first link to see if it has been assigned
			var link1 = document.getElementById("l"+(i+1)+"1");
			// alert("before logic link1.innerHTML = " + link1.innerHTML + " and l1 = " + l1);
			if (l1 === "Click \"Add Link\"" || l1 === "Generic Link" || link1.innerHTML != l1) { //prompt for Link Name and hyperlink
				// alert("linking generic link "+actualLink);
				var keepGoing = linkIt(link1, i, 1, actualLink);

				if(keepGoing === 0){
					return;
				}
			} else { //find out which number link we need to add and prompt for link name and hyperlink
				//any additional links will require additional rows to be added to the table beneath a class
				//row will be inserted beneath last link already present in the class's group
				var index = 0;
				for(var j = 0; j <= i; j++){
					index += classes[j].length;
				}
				var table = document.getElementById("maintable");
				var row = table.insertRow(index-1);
				row.id = "row" + (i+1) + "" + classes[i].length; //may need to change if extra links are taking up more rows

				//insert the new cells
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);

				var prevRows = index;

				//check box and link 
				var checkBox = document.createElement("input");
				checkBox.id = "cb" + prevRows;
				checkBox.type = "checkbox";
				checkBox.style.cssFloat = "right";
				cell2.appendChild(checkBox);

				// alert("linking link in new row " + actualLink);
				var link = document.createElement("a");
				linkIt(link, i, classes[i].length, actualLink); //find out after user input
				link.id = "l" + scratch + "" + classes[i].length;
				scratch = scratch + 1;
				cell3.appendChild(link);
			}
		}
	}

	save(); //update the cookie for the next time that the user logs on
}

/*
* takes a link from addLink (<a href="http://www.website.com")
* assigns the href of the link and the name that the user sees when
* viewing the page
*/
function linkIt(link1, classIndex, linkIndex, link) {
	var haveLinkName = 1;
	// alert("good spot");

	var length = link.length;
	//link needs to be cleaned up
	var cleaned = link.substring(1, link.length-1);
	// alert("fixed = ? " + cleaned);

	if(link === "Generic Link" || link === ""){ //this is not a page page reload
		// alert("in here");
		link = prompt("What is a website that your class uses. The more exact the better, so it is recommended that you go to the actual page you visit most often and copy the address.","");

		if(link == null){ //tells add link to return before making extra rows
			return 0;
		}
		haveLinkName = 0;
	}


	link1.href = link;

	var linkName = "";

	//if we do not already have the preferred name of the link ask
	if(haveLinkName == 0){
		linkName = prompt("What would you like to call this link?");
		// alert(linkName);
		if(linkName === ""){
			linkName = link;
		}
		localStorage.setItem(link, linkName);
	} else { //acquire the link name from storage
		linkName = localStorage.getItem(link);
	}

	if (linkName == null) {
		link1.innerHTML = link;
	} else {
		link1.innerHTML = linkName;
	}

	var c = classes[classIndex];
	if(linkIndex == c.length){
		c.push(link);
	} else {
		c[linkIndex] = link;
	}

	return 1;
}


/*
* shows the classes array in an alert box
*/
function show() {
	var str0 = " ";
	for(var i = 0; i < classes.length; i++){
		for(var j = 0; j < classes[i].length; j++){
			str0 = str0 +  " " + classes[i][j]; 
		}
		str0 = str0 + " || \n ";
	}
	
	alert(str0);
}

/*
* alerts the number of row in the table
*/
function numberOfRows() {
	var table = document.getElementById("maintable");
	alert("table rows " + table.rows.length);
}

/*
* cleans off extra JSON stringified " and \
*/
function clean(str){
	var str1 = str.substring(0,1);
	if(str1 === "\"" || str1 === "\\"){
		str = str.substring(1, str.length-1);
		clean(str);
	}
	return str;
}

/*
* deletes saved information
*/
function deleteLocalStorage(){
	localStorage.clear();
}