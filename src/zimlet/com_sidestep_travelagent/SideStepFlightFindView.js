function SideStepFlightFindView(parent, appCtxt,zimlet, workAirportOptions, homeAirportOptions, workZip, homeZip) {
	DwtTabViewPage.call(this,parent);
	this.zimlet = zimlet;
	this._appCtxt = appCtxt;
	this._departAirportsSelectHome = null;
	this._departAirportsSelectWork = null;
	this._arriveAirportsSelectWork = null;
	this._arriveAirportsSelectHome = null;
	this.workAirportOptions = workAirportOptions
	this.homeAirportOptions = homeAirportOptions;
	this._workZip=workZip;
	this._homeZip = homeZip;
	if(workAirportOptions)
		this.hasWorkAddr = true;
	else
		this.hasWorkAddr = false;
	if(homeAirportOptions)
		this.hasHomeAddr = true;
	else
		this.hasHomeAddr = false;
		
	this._createHTML(this.hasWorkAddr, this.hasHomeAddr);
	this.setScrollStyle(Dwt.SCROLL);
	this._rendered=false;
	this._setMouseEventHdlrs();	

    this.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this._mouseOverListener));
    this.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(this, this._mouseOutListener));    
    this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._mouseDownListener));        
}

SideStepFlightFindView.prototype = new DwtTabViewPage;
SideStepFlightFindView.prototype.constructor = SideStepFlightFindView;


// Public methods

SideStepFlightFindView.prototype.toString = 
function() {
	return "SideStepFlightFindView";
};

SideStepFlightFindView.prototype.showMe = 
function () {
	if(!this._rendered)
		this._initialize();
	DwtTabViewPage.prototype.showMe.call(this,parent);

	if(this.zimlet) {
		var myPlannerClbk = new AjxCallback(this, this.zimlet.myplannerCallback);
		var url = [ZmZimletBase.PROXY,AjxStringUtil.urlEncode("http://myplanner.org/travelagent.php?id=1")].join("");
		AjxRpc.invoke(null, url, null, myPlannerClbk);
	}
	
}

SideStepFlightFindView.prototype.setHomeAirports = 
function (homeAirportOptions, zip) {
	this.homeAirportOptions = homeAirportOptions;
	this._homeZip=zip;
}

SideStepFlightFindView.prototype.setWorkAirports = 
function (workAirportOptions, zip) {
	this.workAirportOptions = workAirportOptions;
	this._workZip=zip;
}

SideStepFlightFindView.prototype.setDepAirport = 
function (code) {
	this._flightFromField.setValue(code);
}

SideStepFlightFindView.prototype.setArrAirport = 
function (code) {
	this._flightToField.setValue(code);
}

SideStepFlightFindView.prototype.setDepartDate =
function (departDate) {
	this._departDate = departDate;
	if(this._departDateField)
		this._departDateField.value=AjxDateUtil.simpleComputeDateStr(departDate);
}

SideStepFlightFindView.prototype.setReturnDate =
function (returnDate) {
	this._returnDate = returnDate;
	if(this._returnDateField)
		this._returnDateField.value=AjxDateUtil.simpleComputeDateStr(returnDate);
}

SideStepFlightFindView.prototype.resize =
function(newWidth, newHeight) {
	if (!this._rendered) return;

	if (newWidth) {
		this.setSize(newWidth);
		Dwt.setSize(this.getHtmlElement().firstChild, newWidth);
	}

	if (newHeight) {
		this.setSize(Dwt.DEFAULT, newHeight - 30);
		Dwt.setSize(this.getHtmlElement().firstChild, Dwt.DEFAULT, newHeight - 30);
	}
};


// Private / protected methods

SideStepFlightFindView.prototype._initialize = 
function() {

	this._createDwtObjects();
	this._cacheFields();
	this._rendered = true;
};

SideStepFlightFindView.prototype._createHTML = 
function() {
	var html = new Array();
	var i = 0;
	this._flightTypeSelectId	= Dwt.getNextId();
	this._flightFromId	= Dwt.getNextId();
	this._departDateFieldId	= Dwt.getNextId();
	this._departDateMiniCalBtnId	= Dwt.getNextId();
	this._departTimeSelectId	= Dwt.getNextId();
	this._flightToId = Dwt.getNextId();
	this._returnDateFieldId = Dwt.getNextId();
	this._returnDateMiniCalBtnId = Dwt.getNextId();
	this._returnTimeSelectId = Dwt.getNextId();
	this._altappChbxId = Dwt.getNextId();
	this._adultsSelectId = Dwt.getNextId();
	this._youthSelectId = Dwt.getNextId();
	this._childrenSelectId = Dwt.getNextId();
	this._searchButtonId = Dwt.getNextId();
	this._hiddenIframeId = Dwt.getNextId();
	
	this._dep_coa_id = Dwt.getNextId();
	this._arr_coa_id = Dwt.getNextId();	
	
		
	if(this.hasWorkAddr) {
		this._departAirportsTitleCellWorkId = Dwt.getNextId();
		this._departAirportsSelectIdWork= Dwt.getNextId();
		this._arriveAirportsTitleCellWorkId = Dwt.getNextId();
		this._arriveAirportsSelectIdWork= Dwt.getNextId();		
	}
	if(this.hasHomeAddr) {
		this._departAirportsTitleCellHomeId = Dwt.getNextId();
		this._departAirportsSelectIdHome= Dwt.getNextId();
		this._arriveAirportsTitleCellHomeId = Dwt.getNextId();
		this._arriveAirportsSelectIdHome= Dwt.getNextId();
		
	}
	html[i++] = "<table border=0 width=500 cellspacing=3>";		
	html[i++] = "<tr><td colspan=3>";
	html[i++] = "<table border=0 cellspacing=1>";		
	html[i++] = "<tr><td width=30%>Type of flight:</td>";
	html[i++] = "<td width=30% id='";
	html[i++] = this._flightTypeSelectId;
	html[i++] = "'></td>";
	html[i++] = "<td width=40%><input type=checkbox CHECKED id='";
	html[i++] = this._altappChbxId;
	html[i++] = "'>Include nearby airports</td></tr>";

	html[i++] = "</table></td></tr>";


	html[i++] = "<tr>";

	//origin cell	
	html[i++] = "<td ";
	if (!this.hasWorkAddr && !this.hasHomeAddr)
		html[i++] = " width=40%>";
	else if (this.hasWorkAddr && this.hasHomeAddr)
		html[i++] = " width=30%>";
	else 
		html[i++] = " width=40% colspan=2>";
		
	html[i++] = "<table border=0 cellspacing=1>";		
	html[i++] = "<tr><td width=140><div style='float:left;'>From </div><div style = 'float:right'>(city or <span class=\"SideStepLinkButton\" id='";
	html[i++] = this._dep_coa_id;
	 html[i++] = "'>airport code</span>)</div></td>";
	html[i++] = "<tr><td width=140 id='";
	html[i++] = this._flightFromId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";

	if (this.hasWorkAddr || this.hasHomeAddr) {
		if (this.hasWorkAddr) {
			//origin work airports
			html[i++] = "<td ";
			if (this.hasHomeAddr) {
				html[i++] = " width=30%>";			
			} else {
				html[i++] = " width=60% colspan=2>";			
			}
			html[i++] = "<table border=0 cellspacing=1>";		
			html[i++] = "<tr><td width=140 id='"
			html[i++] = this._departAirportsTitleCellWorkId;
			html[i++] = "'>Airports near work address</td></tr>";
			html[i++] = "<tr>";
			html[i++] = "<td id='";
			html[i++] = this._departAirportsSelectIdWork;
			html[i++] = "'></td></tr></table>";
			html[i++] = "</td>";		
		}
		if (this.hasHomeAddr) {
			//origin home airports
			html[i++] = "<td ";
			if (this.hasWorkAddr) {
				html[i++] = " width=30%>";			
			} else {
				html[i++] = " width=60% colspan=2>";			
			}
	
			html[i++] = "<table border=0 cellspacing=1>";		
			html[i++] = "<tr><td width=140 id='"
			html[i++] = this._departAirportsTitleCellHomeId;
			html[i++] = "'>Airports near home address</td></tr>";
			html[i++] = "<tr>";
			html[i++] = "<td id='";
			html[i++] = this._departAirportsSelectIdHome;
			html[i++] = "'></td></tr></table>";
			html[i++] = "</td>";
		}	
		html[i++] = "</tr>";	
		html[i++] = "<tr>";		
	}	
	//destination cell	
	html[i++] = "<td ";
	if (!this.hasWorkAddr && !this.hasHomeAddr)
		html[i++] = " width=40%>";
	else if (this.hasWorkAddr && this.hasHomeAddr)
		html[i++] = " width=30%>";
	else 
		html[i++] = " width=40% colspan=2>";
		
	html[i++] = "<table border=0 cellspacing=1>";		
	html[i++] = "<tr><td width=140><div style='float:left;'>To </div><div style = 'float:right'>(city or <span class=\"SideStepLinkButton\" id='";
	html[i++] = this._arr_coa_id;
	 html[i++] = "'>airport code</span>)</div></td>";
	html[i++] = "<tr><td width=140 id='";
	html[i++] = this._flightToId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";
	if (!this.hasWorkAddr && !this.hasHomeAddr) {
		html[i++] = "<td>&nbsp</td>";	
	}
	if (this.hasWorkAddr || this.hasHomeAddr) {
		if (this.hasWorkAddr) {
			//origin work airports
			html[i++] = "<td ";
			if (this.hasHomeAddr) {
				html[i++] = " width=30%>";			
			} else {
				html[i++] = " width=60% colspan=2>";			
			}
			html[i++] = "<table border=0 cellspacing=1>";		
			html[i++] = "<tr><td width=140 id='"
			html[i++] = this._arriveAirportsTitleCellWorkId;
			html[i++] = "'>Airports near work address</td></tr>";
			html[i++] = "<tr>";
			html[i++] = "<td id='";
			html[i++] = this._arriveAirportsSelectIdWork;
			html[i++] = "'></td></tr></table>";
			html[i++] = "</td>";		
		}
		if (this.hasHomeAddr) {
			//origin home airports
			html[i++] = "<td ";
			if (this.hasWorkAddr) {
				html[i++] = " width=30%>";			
			} else {
				html[i++] = " width=60% colspan=2>";			
			}
	
			html[i++] = "<table border=0 cellspacing=1>";		
			html[i++] = "<tr><td width=140 id='"
			html[i++] = this._arriveAirportsTitleCellHomeId;
			html[i++] = "'>Airports near home address</td></tr>";
			html[i++] = "<tr>";
			html[i++] = "<td id='";
			html[i++] = this._arriveAirportsSelectIdHome;
			html[i++] = "'></td></tr></table>";
			html[i++] = "</td>";
		}	
	}
	html[i++] = "</tr>";	
	html[i++] = "<tr>";	

	//depart date cell
	html[i++] = "<td>";
	html[i++] = "<table border=0 cellspacing=1>";		
	html[i++] = "<tr><td width=100 colspan=2>Depart (mm/dd/yy)</td></tr>";
	html[i++] = "<tr>";
	html[i++] = "<td>";
	html[i++] = "<input style='height:22px;' type='text' autocomplete='off' size=11 maxlength=10 id='";
	html[i++] = this._departDateFieldId;
	html[i++] = "'></td><td id='";
	html[i++] = this._departDateMiniCalBtnId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";	

	//depart time cell
	html[i++] = "<td>";
	html[i++] = "<table border=0 cellspacing=1>";		
	html[i++] = "<tr><td width=100>Time</td></tr>";
	html[i++] = "<tr>";
	html[i++] = "<td id='";
	html[i++] = this._departTimeSelectId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";		

	html[i++] = "<td>&nbsp;</td>";
	html[i++] = "</tr>";			
	html[i++] = "<tr>";

	//return date cell	
	html[i++] = "<td>";
	html[i++] = "<table border=0 cellspacing=1>";		
	html[i++] = "<tr><td width=100 colspan=2>Return (mm/dd/yy)</td></tr>";
	html[i++] = "<tr>";
	html[i++] = "<td>";
	html[i++] = "<input style='height:22px;' type='text' autocomplete='off' size=11 maxlength=10 id='";
	html[i++] = this._returnDateFieldId;
	html[i++] = "'></td><td id='";
	html[i++] = this._returnDateMiniCalBtnId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";	
	
	//return time cell
	html[i++] = "<td>";
	html[i++] = "<table border=0 cellspacing=1>";		
	html[i++] = "<tr><td width=100>Time</td></tr>";
	html[i++] = "<tr>";
	html[i++] = "<td id='";
	html[i++] = this._returnTimeSelectId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";	
	
	html[i++] = "<td>&nbsp;</td>";	
	html[i++] = "</tr>";	
	
	//travelers	
	//adults cell
	html[i++] = "<tr>";
	html[i++] = "<td width=30%>";
	html[i++] = "<table border=0 cellspacing=1>";	
	html[i++] = "<tr><td>Adults (age 18+)</td></tr>";
	html[i++] = "<tr><td id='";
	html[i++] = this._adultsSelectId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";
	//youth cell
	html[i++] = "<td width=30%>";
	html[i++] = "<table border=0 cellspacing=1>";	
	html[i++] = "<tr><td>Youth (ages 12-17)</td></tr>";
	html[i++] = "<tr><td id='";
	html[i++] = this._youthSelectId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";
	//children cell
	html[i++] = "<td width=30%>";
	html[i++] = "<table border=0 cellspacing=1>";	
	html[i++] = "<tr><td>Children (ages 2-11)</td></tr>";
	html[i++] = "<tr><td id='";
	html[i++] = this._childrenSelectId;
	html[i++] = "'></td></tr></table>";
	html[i++] = "</td>";
	html[i++] = "</tr>";
	//searh button cell
	html[i++] = "<tr>";
	html[i++] = "<td align='center' colspan=3 id='";
	html[i++] = this._searchButtonId
	html[i++] = "'>";
	html[i++] = "</tr>";	

	html[i++] = "</table>";
	this.getHtmlElement().innerHTML = html.join("");
};

SideStepFlightFindView.prototype._createDwtObjects = 
function () {
	var fTypeOptions = [new DwtSelectOption("roundtrip", true, "Roundtrip"), 
	new DwtSelectOption("oneway", false, "One way")];
	
	this._flightTypeSelect = new DwtSelect(this,fTypeOptions);
	var flightTypeCell = document.getElementById(this._flightTypeSelectId);
	if (flightTypeCell)
		flightTypeCell.appendChild(this._flightTypeSelect.getHtmlElement());
	delete this._flightTypeSelectId;	
	
	var myAirport="";
	try {
		myAirport = this.zimlet.getUserProperty("myairport")
	} catch (ex) {
	//sigh
	}	

	this._flightFromField = new DwtInputField({parent:this, type:DwtInputField.STRING,
											initialValue:myAirport, size:null, maxLen:null,
											errorIconStyle:DwtInputField.ERROR_ICON_NONE,
											validationStyle:DwtInputField.ONEXIT_VALIDATION});
											
	Dwt.setSize(this._flightFromField.getInputElement(), "100%", "22px");	
	this._flightFromField.reparentHtmlElement(this._flightFromId);
	delete this._flightFromId;	
	
	var timeOptions = [new DwtSelectOption("12:03", true, "Any time"), 
	new DwtSelectOption("05:33", false, "Early morning"),
	new DwtSelectOption("09:03", false, "Morning"),
	new DwtSelectOption("14:33", false, "Afternoon"),
	new DwtSelectOption("20:03", false, "Evening")];
	
	this._departTimeSelect = new DwtSelect(this,timeOptions);
	var departTimeCell = document.getElementById(this._departTimeSelectId);
	if (departTimeCell)
		departTimeCell.appendChild(this._departTimeSelect.getHtmlElement());
	delete this._departTimeSelectId;	
	
	var dateButtonListener = new AjxListener(this, this._dateButtonListener);
	var dateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);
		
	this._departDateButton = ZmApptViewHelper.createMiniCalButton(this, this._departDateMiniCalBtnId, dateButtonListener, dateCalSelectionListener, true);
									
	this._flightToField = new DwtInputField({parent:this, type:DwtInputField.STRING,
											initialValue:null, size:null, maxLen:null,
											errorIconStyle:DwtInputField.ERROR_ICON_NONE,
											validationStyle:DwtInputField.ONEXIT_VALIDATION});
	Dwt.setSize(this._flightToField.getInputElement(), "100%", "22px");	
	this._flightToField.reparentHtmlElement(this._flightToId);
	delete this._flightToId;	
	
	this._returnTimeSelect = new DwtSelect(this,timeOptions);
	var returnTimeCell = document.getElementById(this._returnTimeSelectId);
	if (returnTimeCell)
		returnTimeCell.appendChild(this._returnTimeSelect.getHtmlElement());
	delete this._returnTimeSelectId;	

	this._returnDateButton = ZmApptViewHelper.createMiniCalButton(this, this._returnDateMiniCalBtnId, dateButtonListener, dateCalSelectionListener, true);	
	
	this._adultSelect = new DwtSelect(this,[new DwtSelectOption("1", true, "1"), 
	new DwtSelectOption("2", false, "2"),
	new DwtSelectOption("3", false, "3"),
	new DwtSelectOption("4", false, "4")]);
	var adultCell = document.getElementById(this._adultsSelectId);
	if (adultCell)
		adultCell.appendChild(this._adultSelect.getHtmlElement());	
		
	this._youthSelect = new DwtSelect(this,[new DwtSelectOption("0", true, "0"),
	new DwtSelectOption("1", true, "1"), 
	new DwtSelectOption("2", false, "2"),
	new DwtSelectOption("3", false, "3"),
	new DwtSelectOption("4", false, "4")]);
	var youthCell = document.getElementById(this._youthSelectId);
	if (youthCell)
		youthCell.appendChild(this._youthSelect.getHtmlElement());	
		
	this._childrenSelect = new DwtSelect(this,[new DwtSelectOption("0", true, "0"),
	new DwtSelectOption("1", true, "1"), 
	new DwtSelectOption("2", false, "2"),
	new DwtSelectOption("3", false, "3"),
	new DwtSelectOption("4", false, "4")]);
	var childrenCell = document.getElementById(this._childrenSelectId);
	if (childrenCell)
		childrenCell.appendChild(this._childrenSelect.getHtmlElement());	
		
	var searchButton = new DwtButton(this);	
	searchButton.setText("Search multiple travel sites");
	searchButton.setSize("170");
	searchButton.addSelectionListener(new AjxListener(this, this._searchButtonListener));				
	var searchButtonCell = document.getElementById(this._searchButtonId);
	if (searchButtonCell)
		searchButtonCell.appendChild(searchButton.getHtmlElement());

	if(this._departAirportsSelectIdWork && this.hasWorkAddr) {
		this._departAirportsSelectWork = new DwtSelect(this,this.workAirportOptions);
		this._departAirportsSelectWork.addChangeListener(new AjxListener(this, this._selectChangeListener));
		var departAirportsCellWork = document.getElementById(this._departAirportsSelectIdWork);		
		if (departAirportsCellWork)
			departAirportsCellWork.appendChild(this._departAirportsSelectWork.getHtmlElement());	

		if(this._departAirportsTitleCellWorkId) {
			this._departAirportsTitleCellWork = document.getElementById(this._departAirportsTitleCellWorkId);		
			if(this._departAirportsTitleCellWork)
				this._departAirportsTitleCellWork.innerHTML = "Ariports near " + this._workZip;
		}
	}

	if(this._departAirportsSelectIdHome && this.hasHomeAddr) {
		this._departAirportsSelectHome = new DwtSelect(this,this.homeAirportOptions);
		this._departAirportsSelectHome.addChangeListener(new AjxListener(this, this._selectChangeListener));		
		var departAirportsCellHome = document.getElementById(this._departAirportsSelectIdHome);		
		if (departAirportsCellHome)
			departAirportsCellHome.appendChild(this._departAirportsSelectHome.getHtmlElement());	

		if(this._departAirportsTitleCellHomeId) {
			this._departAirportsTitleCellHome = document.getElementById(this._departAirportsTitleCellHomeId);		
			if(this._departAirportsTitleCellHome)
				this._departAirportsTitleCellHome.innerHTML = "Ariports near " + this._homeZip;
		}
	}
	
	if(this._arriveAirportsSelectIdWork && this.hasWorkAddr) {
		this._arriveAirportsSelectWork = new DwtSelect(this,this.workAirportOptions);
		this._arriveAirportsSelectWork.addChangeListener(new AjxListener(this, this._selectChangeListener));		
		var arriveAirportsCellWork = document.getElementById(this._arriveAirportsSelectIdWork);		
		if (arriveAirportsCellWork)
			arriveAirportsCellWork.appendChild(this._arriveAirportsSelectWork.getHtmlElement());
		this._flightToField.setValue(this.workAirportOptions[0].getValue());
		
		if(this._arriveAirportsTitleCellWorkId) {
			this._arriveAirportsTitleCellWork = document.getElementById(this._arriveAirportsTitleCellWorkId);		
			if(this._arriveAirportsTitleCellWork)
				this._arriveAirportsTitleCellWork.innerHTML = "Ariports near " + this._workZip;
		}
							
	}

	if(this._arriveAirportsSelectIdHome && this.hasHomeAddr) {
		this._arriveAirportsSelectHome = new DwtSelect(this,this.homeAirportOptions);
		this._arriveAirportsSelectHome.addChangeListener(new AjxListener(this, this._selectChangeListener));		
		var arriveAirportsCellHome = document.getElementById(this._arriveAirportsSelectIdHome);		
		if (arriveAirportsCellHome)
			arriveAirportsCellHome.appendChild(this._arriveAirportsSelectHome.getHtmlElement());
		this._flightToField.setValue(this.homeAirportOptions[0].getValue());								
		
		if(this._arriveAirportsTitleCellHomeId) {
			this._arriveAirportsTitleCellHome = document.getElementById(this._arriveAirportsTitleCellHomeId);		
			if(this._arriveAirportsTitleCellHome)
				this._arriveAirportsTitleCellHome.innerHTML = "Ariports near " + this._homeZip;
		}		
	}	
};

SideStepFlightFindView.prototype._cacheFields = 
function() {
	this._departDateField = document.getElementById(this._departDateFieldId);
	if(this._departDate)
		this._departDateField.value=AjxDateUtil.simpleComputeDateStr(this._departDate);
		
	delete this._departDateFieldId;
	
	this._returnDateField = document.getElementById(this._returnDateFieldId);	
	if(this._returnDate)
		this._returnDateField.value=AjxDateUtil.simpleComputeDateStr(this._returnDate);	
		
	delete this._returnDateFieldId;
};


SideStepFlightFindView.prototype._dateButtonListener = function(ev) {
	var calDate = ev.item == this._departDateButton
		? AjxDateUtil.simpleParseDateStr(this._departDateField.value)
		: AjxDateUtil.simpleParseDateStr(this._returnDateField.value);

	// if date was input by user and its foobar, reset to today's date
	if (isNaN(calDate) || !calDate) {
		calDate = new Date();
		var field = ev.item == this._departDateButton
			? this._departDateField : this._returnDateField;
		field.value = AjxDateUtil.simpleComputeDateStr(calDate);
	}

	// always reset the date to current field's date
	var menu = ev.item.getMenu();
	var cal = menu.getItem(0);
	cal.setDate(calDate, true);
	ev.item.popup();
};

SideStepFlightFindView.prototype._dateCalSelectionListener = function(ev) {
	var parentButton = ev.item.parent.parent;

	// do some error correction... maybe we can optimize this?
	var sd;
	if(this._departDateField.value)
		sd = AjxDateUtil.simpleParseDateStr(this._departDateField.value);
	var ed; 
	if(this._returnDateField.value)
		ed = AjxDateUtil.simpleParseDateStr(this._returnDateField.value);
	var newDate = AjxDateUtil.simpleComputeDateStr(ev.detail);

	// change the start/end date if they mismatch
	if (parentButton == this._departDateButton) {
		if (ed && (ed.valueOf() < ev.detail.valueOf()))
			this._returnDateField.value = newDate;
		this._departDateField.value = newDate;
	} else {
		if (sd && (sd.valueOf() > ev.detail.valueOf()))
			this._departDateField.value = newDate;
		this._returnDateField.value = newDate;
	}
};

SideStepFlightFindView.prototype._searchButtonListener = 
function (ev) {
	var props = [ "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes" ];
	props = props.join(",");
	var altapChbx = document.getElementById(this._altappChbxId);
	var altap = "on";
	if(altapChbx && !altapChbx.checked) 
		altap = "off";


	var browserUrl = ["http://myplanner.org/travel_air.php?","ttype=",this._flightTypeSelect.getValue(),
		"&altap=",altap,"&adult=",this._adultSelect.getValue(),"&youth=",this._youthSelect.getValue(),
		"&child=", this._childrenSelect.getValue(),"&dep=",this._flightFromField.getValue(),"&dest=",
		this._flightToField.getValue(),"&ddate=",this._departDateField.value,"&dtime=",this._departTimeSelect.getValue(),
		"&rdate=",this._returnDateField.value,"&rtime=",this._returnTimeSelect.getValue()].join("");
		
	var canvas = window.open(browserUrl, "Travel finds", props);
	
};

SideStepFlightFindView.prototype._selectChangeListener = 
function(ev) {
	var selectObj = ev._args.selectObj;
	var newValue = ev._args.newValue;
	
	if(selectObj == this._departAirportsSelectWork || selectObj == this._departAirportsSelectHome) {
		if(this._flightFromField)
			this._flightFromField.setValue(newValue);
	} else if(selectObj == this._arriveAirportsSelectWork || selectObj == this._arriveAirportsSelectHome) {
		if(this._flightToField)
			this._flightToField.setValue(newValue);
	}
};

SideStepFlightFindView.prototype._mouseOverListener = 
function(ev) {
	if(ev.target && ev.target.id) {
		if(ev.target.id==this._pick_coa_id) {
			ev.target.className = "SideStepLinkButton-activated";
		}
	}
}

SideStepFlightFindView.prototype._mouseOutListener = 
function(ev) {
	if(ev.target && ev.target.id) {
		if(ev.target.id==this._pick_coa_id) {
			ev.target.className = "SideStepLinkButton";
		}
	}
}

SideStepFlightFindView.prototype._mouseDownListener = 
function(ev) {
	if(ev.target && ev.target.id) {
		if(ev.target.id==this._dep_coa_id) {
			/*alert("Clicked");*/
			this._airportLookupDlg = new SideStepAirportLookupDlg(this._appCtxt.getShell(), this._appCtxt, this,this.zimlet);			
			this._airportLookupDlg.popup();
			this._airportLookupDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._setDepAirportCode));
		} else if (ev.target.id==this._arr_coa_id) {
			this._airportLookupDlg = new SideStepAirportLookupDlg(this._appCtxt.getShell(), this._appCtxt, this,this.zimlet);					
			this._airportLookupDlg.popup();
			this._airportLookupDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._setArrAirportCode));
		}
	}
}

SideStepFlightFindView.prototype._setDepAirportCode = 
function (ev) {
	if(this._airportLookupDlg) {
		var code = this._airportLookupDlg.getSelectedAirport();
		this.setDepAirport(code);
		this._airportLookupDlg.popdown();		
	}
}

SideStepFlightFindView.prototype._setArrAirportCode = 
function (ev) {
	if(this._airportLookupDlg) {
		var code = this._airportLookupDlg.getSelectedAirport();
		this.setArrAirport(code);
		this._airportLookupDlg.popdown();		
	}
}