angular.module('angExc')
       .controller('SpreadSheetController',function($scope){
            $scope.data = [
                ["", "Java", "C", "C++", "C#","Python","PHP","JavaScript"],
                ["Rank", 1, 2, 3, 4, 5, 6, 7],
                ["Rating", 20, 17, 6, 4, 3, 3, 2]
            ];
       });
