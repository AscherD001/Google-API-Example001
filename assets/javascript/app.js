// API key
var mapsKey = "AIzaSyCdasgXLKtxe1vhh8nU7KP3tgCYB8o2yZg";
var map;
var newMap = {
	center: {lat: 35.2271, lng: -80.8431},
	zoom: 8
};

function initMap() {
  	map = new google.maps.Map(document.getElementById("map"), newMap);
  	map.setClickableIcons(false);
}
function updateMap(lat, lng, zLevel) {
  	var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
    map.setZoom(zLevel);
}
function scope(data) {
	// Country
	if(data.results[0].address_components.length === 1) {
		var zLevel = 4;
	// State
	} else if(data.results[0].address_components.length === 2) {
		var zLevel = 6;
	// County
	} else if(data.results[0].address_components.length === 3) {
		var zLevel = 9;
	// City
	} else if(data.results[0].address_components.length === 5) {
		var zLevel = 10;
	// Street
	} else if(data.results[0].address_components.length === 7) {
		var zLevel = 14;
	// Business
	} else if(data.results[0].address_components.length === 10) {
		var zLevel = 17;
	// Default
	} else {
		var zLevel = 8;
	}
	return zLevel;
}
// geocode api request for lat lng of input field value
function citySearch() {
	var query = $(".searchInput").val();
	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&sensor=false";
	$.get(queryURL, function(data) {
		// holds lat and lng values
		var loc = data.results[0].geometry.location;
		// prepares the zoom level
		var zLevel = scope(data);
		updateMap(loc.lat, loc.lng, zLevel);
		cseSearch(query);
	});
	// capatilizes the first letter and updates headline html
	$(".headline").html(query.charAt(0).toUpperCase() + query.slice(1));
	// clears the search box after submit
	$(".searchInput").val("");
}
// loads the map into html after the page has loaded
$("body").append($('<script class="customMap" async defer src="https://maps.googleapis.com/maps/api/js?key=' + mapsKey + '&callback=initMap"></script>'));
// geocode api request for lat lng of input field value
$(".searchButton").on("click", citySearch);
// allows for Enter key to submit input field value
$(".searchInput").keyup(function(event){
    if(event.keyCode == 13){
        $(".searchButton").click();
    }
});
// CSE search for images temporarily
function cseSearch(query) {
	var cseKey = "AIzaSyBQWDimnA-AjyNZlXIsh_R3Ld8wYlAksfA";
	// var cseKey = "AIzaSyDrufMCRtOuOdYgbTXT-piKR3A-hZb5YvU";
	var SEid = "004303949972187002826:5vg83odxtam";
	// var query = prompt("Enter a Search");
	var queryURL = "https://www.googleapis.com/customsearch/v1?&key=" + cseKey + "&cx=" + SEid + "&q=" + query;
	$.get(queryURL, function(data) {
		$(".display2").empty();
		console.log(data.items[0].pagemap.cse_image[0].src);
		$("#banner").attr("background-image", "");
		$("#banner").attr("style", "background-image: url('" + data.items[0].pagemap.cse_image[0].src + "')");
		for(var i = 0; i < data.items.length; i ++) {
			if(data.items[i].pagemap.cse_image) {
				for(var j = 0; j < data.items[i].pagemap.cse_image.length; j ++) {
					var temp = $("<div class='imgWrap col-xs-6'><img class='image col-xs-12' src='" + data.items[i].pagemap.cse_image[0].src + "'></div>");
					$(".display2").append(temp);
				}
			}
		}
	});	
}