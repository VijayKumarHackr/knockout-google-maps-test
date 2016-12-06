/** 
  * All the data required for Google Maps
  */
var map;
var locations = [
        {name: 'Lingaraj Temple', location: {lat: 20.2382383, lng: 85.8315622}},
        {name: 'Odisha State Museum', location: {lat: 20.2562, lng: 85.8415}},
        {name: 'Dhauli', location: {lat: 20.1923517, lng: 85.8372062}},
        {name: 'Nandankanan Zoological Park', location: {lat: 20.395775, lng: 85.8237923}},
        {name: 'Udayagiri Caves', location: {lat: 20.2631, lng: 85.7857}},
        {name: 'Kalinga Stadium', location: {lat: 20.2879847, lng: 85.8215891}}
    ];
var center =[{lat : 20.2961, lng : 85.8245}]
var markers = []; // Creating a new blank array for all the listing markers.
var styles = [
  {
    featureType: 'water',
    stylers: [
      { color: '#1580a8' }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#ffffff' },
      { weight: 6 }
    ]
  },{
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -40 }
    ]
  },{
    featureType: 'transit.station',
    stylers: [
      { weight: 9 },
      { hue: '#e85113' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      { visibility: 'off' }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      { lightness: 100 }
    ]
  },{
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { lightness: -100 }
    ]
  },{
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { visibility: 'on' },
      { color: '#f0e4d3' }
    ]
  },{
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#efe9e4' },
      { lightness: -25 }
    ]
  }
];

/* Ending Google Maps config*/

function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: center[0],
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location; // Get the position from the location array.
    var title = locations[i].name;
    wikiLink(locations[i]);

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i,
    });

    markers.push(marker); // Push the marker to our array of markers.
    bounds.extend(markers[i].position);
  }

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
  	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(map);
   	}
  }

function refreshMarkers(mkrs) {
	setMapOnAll(null);
    markers = [];
    for( var i = 0; i < mkrs.length; i++) {
       var marker = new google.maps.Marker({
          map: map,
          position: mkrs[i].location,
          title: mkrs[i].name,
          animation: google.maps.Animation.DROP,
          id: i,
        });
        markers.push(marker);
    }
    setMapOnAll(map);
};


  function wikiLink(location) {
    location.url = '';
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + title + '&format=json&callback=wikiCallback';

    //If you cant get a wiki request, throw an error message.
    var wikiError = setTimeout(function() {
      location.url = 'Unable to find the request';
    }, 8000);

    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      jsonp: "callback",
      success: function(response) {
        var url = response[3][0];
        location.url = url;
        clearTimeout(wikiError);
      }
    });
  };


  /*
   * View Models and KnockOutJS 
   */
  var viewModel = {
      places: locations
  };

  viewModel.query = ko.observable('');

  viewModel.searchResults = ko.computed(function() {
      var q = viewModel.query().toLowerCase();
      // if( q == "") return "";    // no results if null input
      mkrs = viewModel.places.filter(function(i) {
         return i.name.toLowerCase().indexOf(q) >= 0;
      });
      refreshMarkers(mkrs);
      return mkrs;
  });
  ko.applyBindings(viewModel);
}

