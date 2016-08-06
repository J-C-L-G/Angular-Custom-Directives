angular.module("angExc")
       .config(function($routeProvider, $locationProvider){

            $locationProvider.html5Mode();

            $routeProvider.when("/form",{
                templateUrl: 'app/Form/form.html',
                controller: 'FormController'
            });

            $routeProvider.when("/graphs",{
                templateUrl: 'app/Graphs/graphs.html',
                controller: 'GraphsController'
            });

                $routeProvider.when("/line",{
                   templateUrl: 'app/Graphs/templates/line.html',
                    controller: 'GraphsController'
                });

                $routeProvider.when("/bar",{
                    templateUrl: 'app/Graphs/templates/bar.html',
                    controller: 'GraphsController'
                });

                $routeProvider.when("/pie",{
                    templateUrl: 'app/Graphs/templates/pie.html',
                    controller: 'GraphsController'
                });

            $routeProvider.when("/infiniteScroll",{
                templateUrl: 'app/InfiniteScroll/infiniteScroll.html',
                controller: 'infiniteScrollController'
            });

            $routeProvider.when("/spreadSheet",{
                templateUrl: 'app/SpreadSheet/spreadSheet.html',
                controller: 'SpreadSheetController'
            });

            $routeProvider.when("/text",{
                templateUrl: 'app/Text/text.html',
                controller: 'TextController'
            });

            $routeProvider.otherwise({
               redirectTo: '/graphs'
            });
        });