/**
 * Common Google Map Js API v3 additionnal lib js file
 * Created on January, the 12th 2010 at 21:26:14 by ronan
 *
 * @copyright Copyright (C) 2011 Ronan Guilloux. All rights reserved.
 * @license http://www.gnu.org/licenses/agpl.html GNU AFFERO GPL v3
 * Looking for another licence ? email me at ronan.guilloux@gmail.com 
 * @version //autogen//
 * @author Ronan Guilloux - coolforest.net
 * @package Datatables.net
 * @filesource gmapApiV3_helpers.js
 *
 * This lib provide common function enhancing the Common Google Map Js API v3,
 * & enhancing MarkerManager v3 lib et InfoBox lib
 * 
 * See http://code.google.com/p/google-maps-utility-library-v3/
 * 
 */

// PARAMS : 
// --------
// "cj_" stands for "common javascript gmap library", 
// this prefix avoid vars-name-conflicts since all the big refactoring process isn't already fully tested 

var cj_closed_bullet_url = 'myimagesdirectory/closed_bullet.png';
var cj_centerLatLong = new google.maps.LatLng(48.783682, -3.524321); // Pleumeur-Bodou, Center of the modern world.

var cj_map;
var cj_all_markers = [];
var cj_mgr_poi_layers = [];
var cj_bounds_poi_layers = [];
var cj_batches = [];
var cj_kmls = [];
var cj_displayedKmls = [];
var cj_contents = [];
var cj_infoboxes = [];
var cj_defaultMapZoom = 7;
var cj_defaultCityZoom = 12; // same value as in interactive map
var cj_defaultPOIZoom = 16;
var cj_maxZoom = 17;

// Nothing to be changed under this line
// ---------------------------------

// Cf. http://bit.ly/QsbA6
function cj_trace(s) {
  try { console.log(s) } catch (e) {  } // console.log()-unknown-in-IE trick
};

function cj_initialize() {
	var options = {
		zoom: cj_defaultMapZoom,
		center: cj_centerLatLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	cj_map = new google.maps.Map(document.getElementById("map_canvas"), options);
	
	// loading finished : adding markermanagers, filling poi & kml arrays, arranging UI :
	var listener = google.maps.event.addListener(cj_map, 'bounds_changed', function(){
		buildManagers(); // this function is defined in each view template that calls this js lib.
		google.maps.event.removeListener(listener);
	});	
	
	// managing unzooming/rezooming
	google.maps.event.addListener(cj_map, 'zoom_changed', function() {
		cj_trace('zoom_changed to ' + cj_map.getZoom());
		cj_hideAllInfoBoxes();
	});
	
	// preventing .hide() or .show() issues on the map tiles. API v3 compatible only 
    google.maps.event.addListener(cj_map, "idle", function(){
		google.maps.event.trigger(cj_map, 'resize');
	});
}

// jQuery's hide/show bug work-around
function checkResize()
{
	cj_initialize();
}

$(document).ready(function() {
	cj_initialize();
	
	
	initialize();// your own custom initialize function
	
//		Ci-dessous la gestion des évènements "cacher/révéler un KML ou un semis de point (poi_layer)
//		Les tableaux mgr_poi_layers sont populés au chargement de la page, cf. js/cartointeractive.tpl
//		Le tout est basé sur Google Map Js API v3 + google-maps-utility-library-v3  
//		Remarques :
//		-----------			
//		Attention au .refresh() sur les markerManagers
//		Attention au zoom fixing si un seul marker dans le markerManager
//		Attention à ne jamais rien supprimer des tableaux mgr_poi_layers (inutile)
//		Attention à bien respecter le 'loaded' event des MarkerManagers, cf. la docs et les exemples
//		Lire la doc : http://code.google.com/apis/maps/documentation/javascript/reference.html
//		+ http://code.google.com/p/google-maps-utility-library-v3/ 
//		Consulter les exemples : http://gmaps-samples-v3.googlecode.com/svn/trunk/
	
	
});

// Show poi layer using MarkerManagers array + zoom fixing to an acceptable zoom index
function cj_showPoiLayer(layerID)
{
	cj_trace('cj_showPoiLayer(' + layerID + ')');
	cj_mgr_poi_layers[layerID].show();
	cj_mgr_poi_layers[layerID].refresh();
 	if(cj_map.getZoom() > cj_maxZoom)
	{
		cj_map.setZoom(cj_maxZoom);
	} 
}

function cj_hidePoiLayer(layerID)
{
	cj_trace('cj_hidePoiLayer(' + layerID + ')');
	cj_mgr_poi_layers[layerID].hide();
	cj_mgr_poi_layers[layerID].refresh();
}

// Removes the overlays from the map, but keeps them in the array
function cj_clearPOILayers() {
  if (cj_mgr_poi_layers) {
    for (i in cj_mgr_poi_layers) {
      cj_mgr_poi_layers[i].setMap(null);
    }
  }
}

function cj_displayKml(id, preserveViewport)
{	
	cj_trace('cj_displayKml('+ id + ')');
	if((cj_kmls[id] != null) && (cj_displayedKmls[id] == null))
	{
		cj_displayedKmls[id] = new google.maps.KmlLayer(cj_kmls[id]);
		cj_displayedKmls[id].preserveViewport = preserveViewport;
		cj_displayedKmls[id].setMap(cj_map);
	}
}

function cj_hideKml(id)
{
	cj_trace('cj_hideKml('+ id + ')');
	if(cj_displayedKmls[id] != null)
	{
		cj_displayedKmls[id].setMap(null);
		cj_displayedKmls[id] = null;
	}	
}

// Hide certain layer when current zoom level overtakes a maxZoom level
// Note : KML schema offers a min/maxAltitude display level, 
// TODO : Find a way to easely convert such altitudes into google map levels  
function cj_maxZoomHidesLayer(layerNature, layerID, maxZoom)
{
	cj_trace('ch_maxZoomHidesLayer('+ layerID + ', ' + layerNature + ', ' + maxZoom  + ')');
	if(maxZoom < cj_map.getZoom())
	{
		cj_trace('max zoom overtaken (greater than ' + maxZoom + ')');
		switch (layerNature) {
			case 'kml':
				cj_hideKml(layerID);
				cj_trace('hiding kml #' + layerID);
			break;
			case 'poiLayer':
				cj_hidePoiLayer(layerID);
				cj_trace('hiding poiLayer #' + layerID);
			break;
			default: 
				// nothing
				cj_trace('hiding nothing');
			break;
		}
	} 
	else 
	{
		cj_trace('max zoom not overtaken (less or equal to ' + maxZoom + ')');
		switch (layerNature) {
			case 'kml':
				cj_displayKml(layerID, true);
				cj_trace('max zoom not overtaken, displaying kml #' + layerID);
			break;
			case 'poiLayer':
				cj_showPoiLayer(layerID);
				cj_trace('displaying poiLayer #' + layerID);
			break;
			default: 
				// nothing
				cj_trace('displaying nothing');
			break;
		}
	}
}

// zooming = true/false
function cj_panTo(poiID, zooming)
{
	cj_trace('cj_panTo('+ poiID + ') with optional zoom level ' + cj_defaultPOIZoom + ' setted to ' + zooming);
	cj_hideAllInfoBoxes();
	cj_map.panTo(cj_all_markers[poiID].getPosition());
	if(zooming)
	{
		cj_map.setZoom(cj_defaultPOIZoom);
	}
	cj_infoboxes[poiID].open(cj_map, cj_all_markers[poiID]);
}

// Yet Another "createMarker" function 
function cj_createMarker(poiID, latLong, title, html, icon) {
	
	var markerOptions = {
		position: latLong,
		title: title
	};
	if(icon !== ''){		
		markerOptions.icon = icon;		
	}
	
	var marker = new google.maps.Marker(markerOptions);
	cj_all_markers[poiID] = marker;
	var contentString = '<div class="infoWindowContent">' + html + '</div>';        
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	 
	// Version 1 : classical infowindow
	//google.maps.event.addListener(marker, "click", function (e) {
	//	infowindow.open(cj_map, marker);		
	//});
	// /Version 1
	
	// Version 2 : custom infobox, see http://code.google.com/p/google-maps-utility-library-v3/
	var boxText = document.createElement("div");
    boxText.style.cssText = "border: 0; color:#fff; margin-top: 8px; background: #D9321F; padding: 5px;";
    boxText.innerHTML = contentString;
    cj_infoboxes[poiID] = new InfoBox(cj_infoBoxOptionsArray(boxText));

	google.maps.event.addListener(marker, "click", function(e) {
		cj_panTo(poiID, false);
	});
	// /Version 2
    
	return marker;
	
}

function cj_hideAllInfoBoxes()
{
	cj_trace('cj_hideAllInfoBoxes()');
	for(var i= 0; i < cj_infoboxes.length; i++)
	{
	     if(cj_infoboxes[i] != null)
	     {
	     	cj_infoboxes[i].close();
	     }
	}	
}

// replacing "http://www.google.com/intl/en_us/mapfiles/close.gif"
function cj_infoBoxOptionsArray(boxText)
{
	return {
		 content: boxText
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-140, 0)			
		,zIndex: null
		,boxStyle: { 
			background: "url('http://code.google.com/p/google-maps-utility-library-v3/source/browse/trunk/infobox/examples/tipbox.gif?r=162') no-repeat"
			,opacity: 0.85
			,width: "280px"
		 }
		,closeBoxMargin: "10px 2px 2px 2px"
		,closeBoxURL: cj_closed_bullet_url
		,infoBoxClearance: new google.maps.Size(1, 1)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
	};
}

/*!
 * Google Maps Fonctions Javascript v1.0
 *
 * Date: Fri Aug 13 16:20:00 2010 +0100
 */

/**
 * The HomeControl adds a control to the map that simply
 * returns the user to Chicago. This constructor takes
 * the control DIV as an argument.
 */
 
 // see http://code.google.com/apis/maps/documentation/javascript/examples/control-custom.html
function cj_HomeControl(controlDiv, map, padding, backgroundColor, borderStyle, borderWidth, cursor, 
textAlign, title, fontFamily, fontSize, paddingLeft, paddingRight, innerHTML, center) {
 
	// Set CSS styles for the DIV containing the control
	// Setting padding to [pagging] px will offset the control
	// from the edge of the map
	controlDiv.style.padding = padding; //'5px'
	
	// Set CSS for the control border
	var controlUI = document.createElement('DIV');
	controlUI.style.backgroundColor = backgroundColor; //'white';
	controlUI.style.borderStyle = borderStyle; //'solid';
	controlUI.style.borderWidth = borderWidth; //'2px';
	controlUI.style.cursor = cursor; //'pointer';
	controlUI.style.textAlign = textAlign; //'center';
	controlUI.title = title; //'Click to set the map to Home';
	controlDiv.appendChild(controlUI);
	
	// Set CSS for the control interior
	var controlText = document.createElement('DIV');
	controlText.style.fontFamily = fontFamily; //'Arial,sans-serif';
	controlText.style.fontSize = fontSize; //'12px';
	controlText.style.paddingLeft = paddingLeft; //'4px';
	controlText.style.paddingRight = paddingRight; //'4px';
	controlText.innerHTML = innerHTML; //'<b>Home</b>';
	controlUI.appendChild(controlText);
	
	// Setup the click event listeners: simply set the map to
	// [center]
	google.maps.event.addDomListener(controlUI, 'click', function() {
	  map.setCenter(center)
	});
}

// eZ Publish's eZGmapLocation extension helper
function cj_eZGmapLocation_MapView( attributeId, latitude, longitude, markerTitle, infoWindowContent, icon, name )
{
/*
    cj_trace(attributeId);
    cj_trace(latitude);
    cj_trace(longitude);
    cj_trace(markerTitle);
    cj_trace(infoWindowContent);
    cj_trace(icon);
    cj_trace(name);    
*/    
    var startPoint = new google.maps.LatLng( latitude, longitude );
    cj_map.setCenter(startPoint);
    cj_map.setZoom(cj_defaultCityZoom);

    // Create the DIV to hold the control and call the HomeControl() constructor passingin this DIV.
	var homeControlDiv = document.createElement('DIV');
	var homeControl = new cj_HomeControl(homeControlDiv, cj_map, '5px', 'white', 'solid', '2px', 'pointer', 'center',  "Cliquer pour revenir au point " + name, 'Arial,sans-serif', '12px', '4px', '4px', "<strong>" + name + "</strong>", startPoint);
    homeControlDiv.index = 1;
  	cj_map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
  	
  	// Create the infoWindowContent bubble
    var contentString = '<div class="infoWindowContent">' + infoWindowContent + '</div>';        
    var infowindow = new google.maps.InfoWindow({
    	content: contentString
	});
	
	// Create the marker
	var marker = new google.maps.Marker({
    	position: startPoint,
        map: cj_map,
        title: markerTitle,
        icon: icon
    });
    // Add a click event handler
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(cj_map,marker);
    });
}