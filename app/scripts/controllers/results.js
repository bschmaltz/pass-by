/**
 * @ngdoc function
 * @name passByApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the passByApp
 */
angular.module('passByApp')
  .controller('ResultsCtrl', function ($scope, $routeParams) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var mapOptions = {}
    $scope.resultMap = new google.maps.Map(document.getElementById('results-map-canvas'), mapOptions);
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
        var radius = 5000;  //todo: more dynamic radius and/or use of bounds
        var pathIndex = 0;
        var atEndOfPath = false;

        while(!atEndOfPath){
          var request = {
            location: path[pathIndex],
            radius: radius,
            types: "amusement_park|aquarium|art_gallery|museum|park|zoo|cafe|food|meal_takeaway|restaurant|lodging"
          };
          placesService.nearbySearch(request, function(results, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              console.log("search results=", results);
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
//pick best place per search. if it was in last search, get next best.
//load elements to dom as you get them.
//if there's nothing or shit results, just don't add anything