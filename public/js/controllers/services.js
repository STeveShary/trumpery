var scoresService = function($http, $location, $q) {
    var service = {};

    var gameCode = $location.search().gameCode;
  
    service.all = function () {
        return $http.get("/api/game/" + gameCode + "/scores")
            .then(
                function(response) {
                    return response.data;
                });
    }
    
    service.sorted = function() {
        return $http.get("/api/game/" + gameCode + "/scores")
            .then(
                function(response) {
                    return _.sortBy(response.data, 'totalScore').reverse();
                });
    }
    
    return service;
}