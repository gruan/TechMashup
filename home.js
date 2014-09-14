/**
 * javascript functions for home.html
 * 
 * JavaScript for class and link
 *  entry and table manipulation
 */

var c0 = ["Generic Class", "Generic Link"];
var classes = [c0]; //holds arrays of class info [[className0, link0, link1], [className1, link0, link1, etc.], etc.]
var d0 = [0, 0];
// var displayedClasses = [d0];
var loading = 1;
var loadingCount = 1; 

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

	if(cookieish == null){
		loading = 0;
		return; //the user has not visited before from this browser
	}

	//reassign classes its value from previous sessions
	classes = JSON.parse(cookieish);

	//remove initial row
	var tr = document.getElementById("row1");
	tr.parentNode.removeChild(tr);

	//repopulate the table
	populate();

	loading = 0;
}

/*
* populates the table using addClass() and addLink()
*/
function populate(){
	var count = classes.length;
	for(var i = 0; i < count; i++){
		//add each class and its links to the table
		var c = classes[i][0];
		c = clean(c);
		addClass(c); //add class
		var linkcount = classes[i].length - 1;
		for(var j = 1; j <= linkcount; j++){
			var link = JSON.stringify(classes[i][j]);
			var cname = JSON.stringify(classes[i][0]);
			link = clean(link);
			cname = clean(cname);
			if(link.substring(0,4) === "http"){
				addLink(cname, link); //add link
			}
		}
	}
}

/*
* adds a class, updating the page and the array 
*/
function addClass(className) {
	if(loading == 0){
		className = prompt("What is the name of the class you are trying to add?","Ex. RHET 105");
	}

	if(className == null){
		return;
	}

	var class0 = classes[0][0];
	if (class0 === "Generic Class") { //setting first class
		document.getElementById("p1").innerHTML = className;

		//keep the classes array updated
		classes[0][0] = className;
	} else {
		//keep classes array updated
		if(loading == 0){
			var newClass = [className, "Click \"Add Link\""];
			classes.push(newClass);
		}
		//add new row
		var table = document.getElementById("maintable");
		var row = table.insertRow(table.rows.length);

		if(loading == 1){
			row.id = "row" + loadingCount;
		} else {
			row.id = "row" + (classes.length); //may need to change if extra links are taking up more rows
		}

		//insert the new cells
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);

		//adding text and stuff
		var t = classes.length;
		if(loading == 1){
			t = loadingCount;
			loadingCount = loadingCount + 1;
		}

		pTag(cell1, t, className);
		cbox(cell2, t);
		aLink(cell3, t +"1", "abcdehijklmnopqrstuvwxyz", "Click \"Add Link\"");
	}
	save(); //update the cookie for the next time the user logs on
}

/*
* adds a link either removing a click add link/general link
* or adding a row beneath the corresponding class
*/
function addLink(className, link) {
	if(loading == 0){ //not called on page load
		className = prompt("To which class do you want to add another link?","Ex. RHET 105");
	}
	
	if(className == null){ //no user input
		return;
	}

	//in order to add we need to add a new row or replace a generic link
	for(var i = 0; i < classes.length; i++){
		if(classes[i][0] === className){
			if(classes[i][1] === "Click \"Add Link\"" || classes[i][1] === "Generic Link" || (loading == 1 && classes[i][1] == link)){
				//we do not need a new row change this link
				l1 = document.getElementById("l"+(i+1)+"1", "");
				linkIt(l1, link, i, 1);
				save();
				return;
			}
			var p = document.getElementById("p"+(i+1));

			// alert(p.innerHTML);
			if(p.innerHTML === className){
				//add a row here with the content in classes[i][j]
				var table = document.getElementById("maintable");
				var row0 = p.parentNode.parentNode;
				var row = table.insertRow(row0.rowIndex+1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				cbox(cell2, table.rows.length-1);
				var linkElement =  aLink(cell3, (i+1)+""+classes[i].length, link, "Click \"Add Link\"");
				linkIt(linkElement, link, i, classes[i].length);
				save();
				return;
			}
		}
	}
	save();
}

/*
* takes a link element and gives it a name and an href
*/
function linkIt(element, link, classIndex, linkIndex){
	var linkName = "";
	if(loading == 0){
		link = "";

		link = prompt("What is a website that your class uses. The more exact the better, so it is recommended that you go to the actual page you visit most often and copy the address.","");

		linkName = prompt("What would you like to call this link?");
		if(linkName === ""){
			linkName = link;
		}
		localStorage.setItem(link, linkName);
	} else {
		linkName = localStorage.getItem(link);
	}

	element.href = link;
	element.innerHTML = linkName;

	if(loading == 0){
		var c = classes[classIndex];
		if(linkIndex == c.length){
			c.push(link);
		} else {
			c[linkIndex] = link;
		}
	}	

	// displayed(link);
}

/*
* saves a cookie containg classes for easy page reconstruction on each visit
* should be called after each time classes is updated
*/
function save(){
	if(loading == 1) {
		return;
	}
	var classesString = JSON.stringify(classes);
 	localStorage.setItem("classes", classesString);
}

/*
* Updates what is displayed
* param is something that was just displayed
*/
// function displayed(content){
// 	for(var i = 0; i < classes.length; i++){
// 		for(var j = 0; j < classes[i].length; j++){
// 			if(classes[i][j] === content){
// 				displayedClasses[i][j] = 1; //displayed
// 			}
// 		}
// 	}
// }

/*
* adds a paragraph to the parent passed with the content
* passed
*/
function pTag(parent, id, content){
	var table = document.getElementById("maintable");
	var pCName = document.createElement("p");
	pCName.id = "p" + id; //will be different when adding new rows for links
	pCName.innerHTML = content;
	parent.appendChild(pCName);
	return pCName;
}

/*
* adds a checkBox to the parent passed as a parameter and 
* sets its attributes to the standard with the unique id
* passed preceded by cd
*/
function cbox(parent, id){
		var checkBox = document.createElement("input");
		checkBox.id = "cb" + id;
		checkBox.type = "checkbox";
		checkBox.style.cssFloat = "right";
		parent.appendChild(checkBox);
		return checkBox;
}

/*
* adds a <a> element to the passed parent with
* the params added as attributes
*/
function aLink(parent, id, href, innerHTML){
		var link = document.createElement("a");
		link.href = href;
		link.innerHTML = innerHTML;
		link.id = "l" + id; //l11 or l21 or l31 ... first number increments by number of classes second increments by number of links in that class
		parent.appendChild(link);
		return link;
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