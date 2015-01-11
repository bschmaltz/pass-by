var FOOD_TYPES = ['restaurant', 'cafe', 'food'];
var ATTRACTION_TYPES = ['amusement_park', 'aquarium', 'art_gallery', 'park', 'zoo'];
var LODGING_TYPES = ['lodging'];

angular.module('passByApp')
  .controller('ResultsCtrl', function ($scope, $routeParams) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var mapOptions = {
      disableDefaultUI: true
    }
    $scope.resultMap = new google.maps.Map(document.getElementById('results-map-canvas'), mapOptions);
    setupResults($scope);
    directionsDisplay.setMap($scope.resultMap);
    
    var request = {
      origin: $routeParams.o,
      destination: $routeParams.d,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);

        var placesService = new google.maps.places.PlacesService($scope.resultMap);
        var totalDistance = result.routes[0].legs[0].distance.value;
        var path = result.routes[0].overview_path;
        var radius = Math.ceil((totalDistance + Math.ceil(totalDistance/10))/10);  //todo: more dynamic radius and/or use of bounds
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
  $scope.setTab = function(tabName){
    if(tabName !== this.tab){
      this.tab = tabName;
    }
  }
  $scope.showPinForRes = function(res){
    if($scope.marker === null){
      $scope.markedResult = res;
      $scope.marker = new google.maps.Marker({
        position: res.geometry.location,
        map: this.resultMap
      });
    }else{
      if(res === $scope.markedResult){
        $scope.markedResult = null;
        $scope.marker.setMap(null);
        $scope.marker = null;
      }else{
        $scope.markedResult = res;
        $scope.marker.setPosition(res.geometry.location);
      }
    }
  }
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