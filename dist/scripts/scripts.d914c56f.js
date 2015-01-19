"use strict";function getNextPathIndex(a,b,c){for(var d=a,e=0;void 0!==c[d+1]&&b>e;)e+=google.maps.geometry.spherical.computeDistanceBetween(c[d],c[d+1]),d++;return d}function setupResults(a){a.tab="food",a.marker=null,a.markedResult=null,a.addedResults=[],a.setTab=function(a){a!==this.tab&&(this.tab=a)},a.moneyString=function(a){for(var b="",c=1;a>=c;c++)b+="$";return b},a.addResult=function(b){var c=a.directionsDisplay.directions;a.directionsDisplay.setDirections(a.altDirectionsDisplay.directions),a.altDirectionsDisplay.setDirections(c),a.routeStats=a.directionsDisplay.directions.routes[0].legs[0].distance.text+", "+a.directionsDisplay.directions.routes[0].legs[0].duration.text,updateInfoWindowContent(a.directionsDisplay.directions.routes[0],a.altDirectionsDisplay.directions.routes[0],a.infowindow),a.addedResults.push(b)},a.removeResult=function(b){var c=a.directionsDisplay.directions;a.directionsDisplay.setDirections(a.altDirectionsDisplay.directions),a.altDirectionsDisplay.setDirections(c),a.routeStats=a.directionsDisplay.directions.routes[0].legs[0].distance.text+", "+a.directionsDisplay.directions.routes[0].legs[0].duration.text,updateInfoWindowContent(a.directionsDisplay.directions.routes[0],a.altDirectionsDisplay.directions.routes[0],a.infowindow),a.addedResults.splice(a.addedResults.indexOf(b),1)},a.showPinForRes=function(b){function c(){a.altDirectionsDisplay.setMap(a.resultMap);var c={origin:a.request.origin,destination:a.request.destination,travelMode:google.maps.TravelMode.DRIVING,waypoints:getWaypoints(a.addedResults,b),optimizeWaypoints:!0};a.directionsService.route(c,function(b,c){c==google.maps.DirectionsStatus.OK&&(a.altDirectionsDisplay.setDirections(b),updateInfoWindowContent(a.directionsDisplay.directions.routes[0],b.routes[0],a.infowindow),a.infowindow.open(a.resultMap,a.marker))})}null===a.marker?(a.markedResult=b,a.marker=new google.maps.Marker({position:b.geometry.location,map:this.resultMap}),a.infowindow=new google.maps.InfoWindow({}),c()):b===a.markedResult?(a.markedResult=null,a.marker.setMap(null),a.marker=null,a.infowindow.setMap(null),a.infowindow=null,a.altDirectionsDisplay.setMap(null)):(a.markedResult=b,a.marker.setPosition(b.geometry.location),c())}}function updateInfoWindowContent(a,b,c){var d=(62137e-8*(b.legs[0].distance.value-a.legs[0].distance.value)).toFixed(1),e=b.legs[0].duration.value-a.legs[0].duration.value;d>0&&(d="+"+d);var f=d+" mi, "+timeToString(e);c.setContent('<div style="width: '+7*f.length+'px; height: 30px;">'+f+"</div>")}function timeToString(a){var b="";if(a>0?b="+":0>a&&(b="-"),a=Math.abs(a),a/60/60>24){var c=Math.floor(a/60/60/24);a-=60*Math.floor(a/60/60/24)*60*24,b+=c>1?c+" days ":c+" day "}if(a/60>60&&a>0){var d=Math.floor(a/60/60);a-=60*Math.floor(a/60/60)*60,b+=d>1?d+" hrs ":d+" hr "}if(a>=0){var e=Math.ceil(a/60);b+=e>1?e+" mins":e+" min"}return b}function getWaypoints(a,b){var c=[];if(-1===a.indexOf(b)){for(var d=0;d<a.length;d++)c.push({location:a[d].geometry.location,stopover:!1});c.push({location:b.geometry.location,stopover:!1})}else for(var d=0;d<a.length;d++)a[d]!==b&&c.push({location:a[d].geometry.location,stopover:!1});return c}function updateDisplayedResults(a,b){function c(a,b){for(var c=0;c<a.types.length;c++)if(-1!==b.indexOf(a.types[c]))return!0;return!1}function d(a,b){return void 0!==a.rating&&(null===b||a.rating>b.rating)}function e(a,b){return 0===b.length||b[b.length-1].id!==a.id}for(var f=null,g=null,h=null,i=0;i<b.length;i++)e(b[i],a.foodResults)&&c(b[i],FOOD_TYPES)&&d(b[i],f)?f=b[i]:e(b[i],a.attractionResults)&&c(b[i],ATTRACTION_TYPES)&&d(b[i],g)?g=b[i]:e(b[i],a.lodgingResults)&&c(b[i],LODGING_TYPES)&&d(b[i],h)&&(h=b[i]);(null!==f||null!==g||null!==h)&&(null!==f&&a.foodResults.push(f),null!==g&&a.attractionResults.push(g),null!==h&&a.lodgingResults.push(h),a.$apply())}angular.module("passByApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/form.html",controller:"FormCtrl"}).when("/results",{templateUrl:"views/results.html",controller:"ResultsCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("passByApp").controller("FormCtrl",["$scope","$location",function(a,b){a.originAutocomplete=new google.maps.places.Autocomplete(document.getElementById("origin")),a.destinationAutocomplete=new google.maps.places.Autocomplete(document.getElementById("destination")),a.originModel=null,a.destinationModel=null,a.directionsError=!1;var c=new google.maps.DirectionsService;a.handleFormSubmit=function(){var d={};d.o=void 0!==this.originAutocomplete.getPlace()?this.originAutocomplete.getPlace().formatted_address:this.originModel,d.d=void 0!==this.destinationAutocomplete.getPlace()?this.destinationAutocomplete.getPlace().formatted_address:this.destinationModel;var e={origin:d.o,destination:d.d,travelMode:google.maps.TravelMode.DRIVING};c.route(e,function(c,e){e!==google.maps.DirectionsStatus.OK?a.directionsError=!0:b.path("/results").search(d),a.$apply()})}}]);var FOOD_TYPES=["restaurant","cafe","food"],ATTRACTION_TYPES=["amusement_park","aquarium","art_gallery","park","zoo"],LODGING_TYPES=["lodging"];angular.module("passByApp").controller("ResultsCtrl",["$scope","$routeParams",function(a,b){a.routeStats="",a.directionsDisplay=new google.maps.DirectionsRenderer,a.altDirectionsDisplay=new google.maps.DirectionsRenderer({polylineOptions:{strokeColor:"grey"}}),a.directionsService=new google.maps.DirectionsService;var c={disableDefaultUI:!0};a.resultMap=new google.maps.Map(document.getElementById("results-map-canvas"),c),setupResults(a),a.directionsDisplay.setMap(a.resultMap),a.request={origin:b.o,destination:b.d,travelMode:google.maps.TravelMode.DRIVING,waypoints:[]},a.directionsService.route(a.request,function(b,c){if(c==google.maps.DirectionsStatus.OK){a.directionsDisplay.setDirections(b),a.routeStats=b.routes[0].legs[0].distance.text+", "+b.routes[0].legs[0].duration.text;var d=new google.maps.places.PlacesService(a.resultMap),e=b.routes[0].legs[0].distance.value,f=b.routes[0].overview_path,g=Math.ceil((e+Math.ceil(e/10))/10),h=0,i=!1,j=FOOD_TYPES.concat(ATTRACTION_TYPES).concat(LODGING_TYPES);for(a.foodResults=[],a.attractionResults=[],a.lodgingResults=[];!i;){var k={location:f[h],radius:g,types:j};d.nearbySearch(k,function(b,c){c==google.maps.places.PlacesServiceStatus.OK&&updateDisplayedResults(a,b)}),h===f.length-1&&(i=!0),h=getNextPathIndex(h,g,f)}}})}]);