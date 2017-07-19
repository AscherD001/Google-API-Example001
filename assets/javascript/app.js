// API key
var mapsKey = "AIzaSyCdasgXLKtxe1vhh8nU7KP3tgCYB8o2yZg";
var map, icon;
var markers = [];
var markerArr = [];
var newMap = {
	center: {lat: 35.2271, lng: -80.8431},
	zoom: 8
};
function windowInfoCreate(marker, location, content) {
	var info = {
		content: content,
		position: location
	};
	var infoWindow = new google.maps.InfoWindow(info);
	google.maps.event.addListener(marker, "click", function() {
		infoWindow.open(map);
	});
}
function addMarker() {
	icon = {
	    url: "assets/images/markBear.png",
	    scaledSize: new google.maps.Size(50, 50),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(25, 50)
	}
	var count = 10;
	if(markers.length < 10) {
		count = markers.length;
	}
	var displayMarkers = setInterval(function() {
		count --;
		var location = markers[count].geometry.location;
		var marker = new google.maps.Marker({
		    position: location,
		    map: map,
		    icon: icon,
		    animation: google.maps.Animation.DROP,
		    clickable: true
		});
		markerArr.push(marker);
		if(markers[count]) {
			console.log(markers[count]);
			var content = markers[count].name + "<br>" + markers[count].vicinity + "<br>" + markers[count].types;
			windowInfoCreate(marker, location, content);
		}
		if(count == 0) {
			clearInterval(displayMarkers);
		}
		$(".display2").append($("<div class='itemDisplay'>" + markers[count].name + "</div>"))
	}, 125);
		
}
function searchPlaces(results, status) {
	if(status == google.maps.places.PlacesServiceStatus.OK) {
		for(var i = 0; i < results.length; i++) {
			var place = results[i];
			markers.push(place);
		}
		addMarker();
	}
}
function addPlaces(latLng) {
	var places = new google.maps.places.PlacesService(map);
	// 1609.34 is one mile in meters
	var request = {
		location: latLng,
		radius: 5000,
		types: ["food"]
	};
	places.nearbySearch(request, searchPlaces);
}
function initMap() {
  	map = new google.maps.Map(document.getElementById("map"), newMap);
  	// map.setClickableIcons(true);
}
function updateMap(lat, lng, zLevel) {
  	var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    map.setZoom(zLevel);
}
// geocode api request for lat lng of input field value
function citySearch() {
	$(".display2").empty();
	clearMarkers();
	markers = [];
	markerArr = [];
	var query = $(".searchInput").val();
	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&sensor=false";
	$.get(queryURL, function(data) {
		// holds lat and lng values
		var loc = data.results[0].geometry.location;
		// prepares the zoom level
		// var zLevel = scope(data);
		var zLevel = 13;
		updateMap(loc.lat, loc.lng, zLevel);
		var latLng = new google.maps.LatLng(loc.lat, loc.lng);
		addPlaces(latLng);
		// enables CSE search off for testing
		// cseSearch(query);
	});
	// capatilizes the first letter and updates headline html
	$(".headline").html(query.charAt(0).toUpperCase() + query.slice(1));
	// clears the search box after submit
	$(".searchInput").val("");
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
	for (var i = 0; i < markerArr.length; i++) {
	  markerArr[i].setMap(map);
	}
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
	setMapOnAll(null);
}
// loads the map into html after the page has loaded
$("body").append($('<script class="customMap" async defer src="https://maps.googleapis.com/maps/api/js?key=' + mapsKey + '&libraries=places&callback=initMap"></script>'));
// geocode api request for lat lng of input field value
$(".searchButton").on("click", citySearch);
// allows for Enter key to submit input field value
$(".searchInput").keyup(function(event){
    if(event.keyCode == 13){
        $(".searchButton").click();
    }
});
// CSE search for images temporarily disabled
function cseSearch(query) {
	var cseKey = "AIzaSyBQWDimnA-AjyNZlXIsh_R3Ld8wYlAksfA";
	// var cseKey = "AIzaSyDrufMCRtOuOdYgbTXT-piKR3A-hZb5YvU";
	var SEid = "004303949972187002826:5vg83odxtam";
	// var query = prompt("Enter a Search");
	var queryURL = "https://www.googleapis.com/customsearch/v1?&key=" + cseKey + "&cx=" + SEid + "&q=" + query + "+hotels";
	$.get(queryURL, function(data) {
		$(".display2").empty();
		console.log(data);
		$("#banner").attr("background-image", "");
		$("#banner").attr("style", "background-image: url('" + data.items[0].pagemap.cse_image[0].src + "')");
		for(var i = 0; i < data.items.length; i ++) {
			if(data.items[i].pagemap.cse_image) {
				for(var j = 0; j < data.items[i].pagemap.cse_image.length; j ++) {
					var temp = $("<div class='imgWrap col-xs-12'><img class='image col-xs-12' src='" + data.items[i].pagemap.cse_image[0].src + "'></div>");
					$(".display2").append(temp);
				}
			}
		}
	});	
}

// Old Code That May Be Useful

// function scope(data) {
// 	// Country
// 	if(data.results[0].address_components.length === 1) {
// 		var zLevel = 4;
// 	// State
// 	} else if(data.results[0].address_components.length === 2) {
// 		var zLevel = 6;
// 	// County
// 	} else if(data.results[0].address_components.length === 3) {
// 		var zLevel = 9;
// 	// City
// 	} else if(data.results[0].address_components.length === 5) {
// 		var zLevel = 10;
// 	// Street
// 	} else if(data.results[0].address_components.length === 7) {
// 		var zLevel = 14;
// 	// Business
// 	} else if(data.results[0].address_components.length === 10) {
// 		var zLevel = 17;
// 	// Default
// 	} else {
// 		var zLevel = 8;
// 	}
// 	return zLevel;
// }

// function addMarker(lat, lng) {
// 	icon = {
// 	    url: "assets/images/markBear.png",
// 	    scaledSize: new google.maps.Size(50, 50),
// 	    origin: new google.maps.Point(0, 0),
// 	    anchor: new google.maps.Point(25, 50)
// 	}
// 	var marker = new google.maps.Marker({
// 	    position: new google.maps.LatLng(lat, lng),
// 	    map: map,
// 	    icon: icon,
// 	    animation: google.maps.Animation.DROP
// 	});
// 	markers.push(marker);
// }