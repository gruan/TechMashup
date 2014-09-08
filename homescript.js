/**
 * javascript functions for home.html
 * 
 * JavaScript for class and link
 *  entry and table manipulation
 */

		var extraLinksAdded = 0;
		var c0 = ["Generic Class", "Generic Link"];
		var classes = [c0]; //holds arrays of class info [[className0, link0, link1], [className1, link0, link1, etc.], etc.]
		
		/*
		* takes a link from addLink (<a href="http://www.website.com")
		* assigns the href of the link and the name that the user sees when
		* viewing the page
		*/
		function linkIt(link1, classIndex, linkIndex) {
			var link = prompt("What is a website that your class uses. The more exact the better, so it is recommended that you go to the actual page you visit most often and copy the address.","");
			link1.href = link;
			var linkName = prompt("What would you like to call this link?");
			if (linkName.length > 0) {
				link1.innerHTML = linkName;
				alert(linkName);
			} else {
				link1.innerHTML = link;
			}

			var c = classes[classIndex];
			if(linkIndex == c.length){
				c.push(link);
			} else {
				c[linkIndex] = link;
			}
		}
		
		/*
		* adds a class, updating the page and the array 
		*/
		function addClass() {
			// 	alert("You are trying to add a class.");
			var className = prompt("What is the name of the class you are trying to add?","Ex. RHET 105");
			var class1 = classes[0][0];

			if(className == null){
				return;
			}

			if (class1 === "Generic Class") { //setting first class
				document.getElementById("p1").innerHTML = className;

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
				link.id = "l" + classes.length + "1"; //l11 or l21 or l31 ...
				cell3.appendChild(link);
				
				//keep classes array updated
				var newClass = [className, "Click \"Add Link\""];
				classes.push(newClass);
			}
		}

		function addLink() {
			// 	alert("You are trying to add a link");
			var className = prompt("To which class do you want to add another link?","Ex. RHET 105");

			for (var i = 0; i < classes.length; i++) {
				var name = classes[i][0]; //get the class name from the array
				alert(name);
				if (name === className) { //this is the class to change
					var l1 = classes[i][1]; //check first link to see if it has been assigned
					var link1 = document.getElementById("l"+(i+1)+"1");
					alert(l1);

					if (l1 === "Click \"Add Link\"" || l1 === "Generic Link") { //prompt for Link Name and hyperlink
							linkIt(link1, i, 1);
					} else { //find out which number link we need to add and prompt for link name and hyperlink
						//any additional links will require additional rows to be added to the table beneath a class
						
						var table = document.getElementById("maintable");
						var row = table.insertRow(table.rows.length);
						row.id = "row" + (table.rows.length - 1); //may need to change if extra links are taking up more rows

						//insert the new cells
						var cell1 = row.insertCell(0);
						var cell2 = row.insertCell(1);
						var cell3 = row.insertCell(2);

						var prevRows = 0;
						for(var j = 0; j <= i; j++){
							prevRows += classes[j].length;
						}
						//check box and link 
						var checkBox = document.createElement("input");
						checkBox.id = "cb" + prevRows;
						checkBox.type = "checkbox";
						checkBox.style.cssFloat = "right";
						cell2.appendChild(checkBox);

						var link = document.createElement("a");
						linkIt(link, i, classes[i].length); //find out after user input
						link.id = "l" + (i+1) + "" + classes[i].length;
						cell3.appendChild(link);
					}
				}
			}
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
				str0 = str0 + " \n ";
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