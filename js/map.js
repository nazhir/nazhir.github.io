var myMap = L.map('map-canvas',{ zoomControl:false }).setView([-6.2582000,106.77620], 11);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: 'Openstreetmap'
}).addTo(myMap);

new L.Control.Zoom({ position: 'bottomright' }).addTo(myMap);

var markers = L.markerClusterGroup({ chunkedLoading: true });

var markerList = [];

var school_csv = "https://raw.githubusercontent.com/ramdaffe/opendikbud/master/jakarta.csv";

$.ajax({
      url: school_csv,
      async: false,
      dataType: "text",
      success: function (csvd) {
          var data = $.csv.toObjects(csvd);
          data.forEach(function (k) {
            var title = k.name;
            var marker = L.marker(L.latLng(k.lat, k.long), { title: title });
            marker.bindPopup(title);
            markerList.push(marker);
          });
      }
});

markers.addLayers(markerList);
myMap.addLayer(markers);