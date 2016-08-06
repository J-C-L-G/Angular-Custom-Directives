angular.module("angExc")
       .factory("highchartsService",function($window){
            // Pull from the Global Object the highcharts function
            var highcharts = $window.$().highcharts;
            return {
                highcharts : highcharts
            }
       });