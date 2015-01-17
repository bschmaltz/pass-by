var FOOD_TYPES = ['restaurant', 'cafe', 'food'];
var ATTRACTION_TYPES = ['amusement_park', 'aquarium', 'art_gallery', 'park', 'zoo'];
var LODGING_TYPES = ['lodging'];

angular.module('passByApp')
  .controller('ResultsCtrl', function ($scope, $routeParams) {
    $scope.directionsDisplay = new google.maps.DirectionsRenderer();
    $scope.altDirectionsDisplay = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "grey"
      }
    });
    $scope.directionsService = new google.maps.DirectionsService();
    var mapOptions = {
      disableDefaultUI: true
    }
    $scope.resultMap = new google.maps.Map(document.getElementById('results-map-canvas'), mapOptions);
    setupResults($scope);
    $scope.directionsDisplay.setMap($scope.resultMap);
    
    $scope.request = {
      origin: $routeParams.o,
      destination: $routeParams.d,
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints: []
    };
    $scope.directionsService.route($scope.request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        $scope.directionsDisplay.setDirections(result);

        var placesService = new google.maps.places.PlacesService($scope.resultMap);
        var totalDistance = result.routes[0].legs[0].distance.value;
        var path = result.routes[0].overview_path;
        var radius = Math.ceil((totalDistance + Math.ceil(totalDistance/10))/10);
        var pathIndex = 0;
        var atEndOfPath = false;
        var requestTypes = FOOD_TYPES.concat(ATTRACTION_TYPES).concat(LODGING_TYPES);
        $scope.foodResults = [];
        $scope.attractionResults = [];
        $scope.lodgingResults = [];

        while(!atEndOfPath){
          var request = {
            location: path[pathIndex],
            radius: radius,
            types: requestTypes
          };
          placesService.nearbySearch(request, function(results, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              updateDisplayedResults($scope, results);
            }
          });

          if(pathIndex===path.length-1){atEndOfPath = true;}
          pathIndex = getNextPathIndex(pathIndex, radius, path);
        }
      }
    });
  });

function getNextPathIndex(cur, dist, path){
  var res = cur;
  var addedDistance = 0;
  while(path[res+1] !== undefined && addedDistance < dist){
    addedDistance += google.maps.geometry.spherical.computeDistanceBetween(path[res], path[res+1]);
    res++;
  }
  return res;
}
function setupResults($scope){
  $scope.tab = 'food';
  $scope.marker = null;
  $scope.markedResult = null;
  $scope.addedResults = [];
  $scope.setTab = function(tabName){
    if(tabName !== this.tab){
      this.tab = tabName;
    }
  }
  $scope.addResult = function(res){
    var oldRoute = $scope.directionsDisplay.directions;
    $scope.directionsDisplay.setDirections($scope.altDirectionsDisplay.directions);
    $scope.altDirectionsDisplay.setDirections(oldRoute);
    updateInfoWindowContent($scope.directionsDisplay.directions.routes[0], $scope.altDirectionsDisplay.directions.routes[0], $scope.infowindow);
    //$scope.addedResults.push(res);
    //add waypoint to maintain farthest from dest to closest order
    
    var dest = oldRoute.routes[0].legs[0].end_location;
    var resDistanceToDest = google.maps.geometry.spherical.computeDistanceBetween(res.geometry.location, dest);
    var insertBeforeIndex = $scope.addedResults.length;
    for(var i=0; i<$scope.addedResults.length; i++){
      if(resDistanceToDest > google.maps.geometry.spherical.computeDistanceBetween($scope.addedResults[i].geometry.location, dest)){
        console.log(resDistanceToDest, "insert before", i);
        insertBeforeIndex = i;
        break;
      }
      console.log(i, "=", google.maps.geometry.spherical.computeDistanceBetween($scope.addedResults[i].geometry.location, dest));
    }
    if(insertBeforeIndex === $scope.addedResults.length){
      $scope.addedResults.push(res);
    }else if (insertBeforeIndex === 0){
      $scope.addedResults.unshift(res);
    }else{
      $scope.addedResults.splice(insertBeforeIndex-1, 0, res);
    }
  }
  $scope.removeResult = function(res){
    var oldRoute = $scope.directionsDisplay.directions;
    $scope.directionsDisplay.setDirections($scope.altDirectionsDisplay.directions);
    $scope.altDirectionsDisplay.setDirections(oldRoute);
    updateInfoWindowContent($scope.directionsDisplay.directions.routes[0], $scope.altDirectionsDisplay.directions.routes[0], $scope.infowindow);
    $scope.addedResults.splice($scope.addedResults.indexOf(res), 1);
  }

  $scope.showPinForRes = function(res){
    if($scope.marker === null){
      $scope.markedResult = res;
      $scope.marker = new google.maps.Marker({
        position: res.geometry.location,
        map: this.resultMap
      });
      $scope.infowindow = new google.maps.InfoWindow({});
      showAltRoute();
    }else{
      if(res === $scope.markedResult){
        $scope.markedResult = null;
        $scope.marker.setMap(null);
        $scope.marker = null;
        $scope.infowindow.setMap(null);
        $scope.infowindow = null;
        $scope.altDirectionsDisplay.setMap(null);
      }else{
        $scope.markedResult = res;
        $scope.marker.setPosition(res.geometry.location);
        showAltRoute();
      }
    }

    function showAltRoute(){
      $scope.altDirectionsDisplay.setMap($scope.resultMap);
      var dest = $scope.directionsDisplay.directions.routes[0].legs[0].end_location;

      var altRequest ={
        origin: $scope.request.origin,
        destination: $scope.request.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: getWaypoints($scope.addedResults, res, dest),
        optimizeWaypoints: false
      };
      $scope.directionsService.route(altRequest, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          $scope.altDirectionsDisplay.setDirections(result);
          updateInfoWindowContent($scope.directionsDisplay.directions.routes[0], result.routes[0], $scope.infowindow)
          $scope.infowindow.open($scope.resultMap,$scope.marker);
        }
      });
    }
  }
}

function updateInfoWindowContent(mainRoute, altRoute, infowindow){
  var miles = ((altRoute.legs[0].distance.value - mainRoute.legs[0].distance.value)*0.00062137).toFixed(1);
  var minutes = ((altRoute.legs[0].duration.value - mainRoute.legs[0].duration.value)/60).toFixed(0);
  if(miles>0){
    miles = "+"+miles;
  }
  if(minutes>0){
    minutes = "+"+minutes;
  }

  infowindow.setContent(miles +" miles, "+ minutes+" min");
}

function getWaypoints(addedResults, res, dest){
  var waypoints = [];
  if(addedResults.indexOf(res)===-1){ //alt route includes marker
    var addedRes = false;
    var resDistanceToDest = google.maps.geometry.spherical.computeDistanceBetween(res.geometry.location, dest);
    for(var i=0; i<addedResults.length; i++){
      if(!addedRes && resDistanceToDest > google.maps.geometry.spherical.computeDistanceBetween(addedResults[i].geometry.location, dest)){
        addedRes = true;
        console.log("insert here", resDistanceToDest);
        waypoints.push({
          location: res.geometry.location,
          stopover: false
        });
      }      
      console.log(i, "distance", google.maps.geometry.spherical.computeDistanceBetween(addedResults[i].geometry.location, dest));
      waypoints.push({
        location: addedResults[i].geometry.location,
        stopover: false
      });
    }
    if(!addedRes){
      console.log("push here", resDistanceToDest);
      waypoints.push({
        location: res.geometry.location,
        stopover: false
      });
    }
  }else{ //alt route excludes marker
    for(var i=0; i<addedResults.length; i++){
      if(addedResults[i] !== res){
        waypoints.push({
          location: addedResults[i].geometry.location,
          stopover: false
        });
      }
    }
  }
  console.log("\n")
  return waypoints;
}

function updateDisplayedResults($scope, results){
  var bestFood = null;
  var bestAttraction = null;
  var bestLodging = null;
  for(var i=0; i<results.length; i++){
    if(lastElementIsNot(results[i], $scope.foodResults) && resultIsOfType(results[i], FOOD_TYPES) && resultImproved(results[i], bestFood)){
      bestFood = results[i];
    }else if(lastElementIsNot(results[i], $scope.attractionResults) && resultIsOfType(results[i], ATTRACTION_TYPES) && resultImproved(results[i], bestAttraction)){
      bestAttraction = results[i];
    }else if(lastElementIsNot(results[i], $scope.lodgingResults) && resultIsOfType(results[i], LODGING_TYPES) && resultImproved(results[i], bestLodging)){
      bestLodging = results[i];
    }
  }
  if(bestFood!==null || bestAttraction!==null || bestLodging!==null){
    if(bestFood !== null){
      $scope.foodResults.push(bestFood);
    }
    if(bestAttraction !== null){
      $scope.attractionResults.push(bestAttraction);
    }
    if(bestLodging !== null){
      $scope.lodgingResults.push(bestLodging);
    }
    $scope.$apply();
  }

  function resultIsOfType(res, type){
    for(var j=0; j<res.types.length; j++){
      if(type.indexOf(res.types[j]) !== -1){
        return true;
      }
    }
    return false;
  }

  function resultImproved(res, curBest){
    return res.rating !== undefined && (curBest === null || res.rating > curBest.rating);
  }

  function lastElementIsNot(res, arr){
    return arr.length === 0 || arr[arr.length-1].id !== res.id;
  }
}