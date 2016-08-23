var defaultAddr = 'Jakarta';
var defaultLatLng;
var geocoder = new google.maps.Geocoder();
var markerArray = [];

$(document).on( "pagecreate", "#map-page", function() {	
	//defaultLatLng = geoCoder(defaultAddr);

    geocoder.geocode({'address': defaultAddr}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      defaultLatLng = results[0].geometry.location;
        if ( navigator.geolocation ) {
            function success(pos) {
                // Location found, show map with these coordinates
                drawMap(12,new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            }

           function fail(error) {
            drawMap(12,defaultLatLng);  // Failed to find location, show default map
           }

          // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
          navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});  
        } else {
          drawMap(12,defaultLatLng);  // No geolocation support, show default map
        }
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
    });
})

function geoCoder(addr) {
	geocoder.geocode({'address': addr}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      return results[0].geometry.location;
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  	});
}

function drawMap(size,latlng) {

      var myOptions = {
            zoom: size,
            center: latlng,
        disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

      var controlDiv = document.getElementById("level");
      controlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
		
		  var school_csv = "https://raw.githubusercontent.com/ramdaffe/opendikbud/master/jakarta.csv";

  		$.ajax({
            url: school_csv,
            async: false,
            dataType: "text",
            success: function (csvd) {
                var data = $.csv.toObjects(csvd);
                drawMarker(map,data);
            }
        });

      var url = "https://ryanurzha.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20jakarta_school"
}

function drawMarker(map,data){
    data.forEach(function (k) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(k.lat, k.long),
            optimized: true,
            map: map
        });
        markerArray.push(marker);
    });
    var markerCluster = new MarkerClusterer(map,markerArray);	
}