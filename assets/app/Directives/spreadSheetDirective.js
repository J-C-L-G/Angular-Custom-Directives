/* Usage */
/*
    Attributes:
        -source (to provide data) if the data doesn't exist the spreadsheet will be empty
        -empty  ( true if the spreadsheet should be empty, false to provide basic headings and 0 as values)
        -row    Number of rows to start with
        -col    Number of cols to start with
*/

angular.module('angExc')
       .directive("spreadSheetDirective",function(handsontableService, $rootScope){
            return {
                restrict : "A",
                scope:{data : "=source"},
                link : function(scope, element, attrs){
                    //1. Setup the configuration for the handsontable
                    var config = {
                        manualColumnResize: true,
                        manualRowResize: true,
                        rowHeaders: true,
                        colHeaders: true,
                        contextMenu: true,
                        beforeChange : function(operation){
                            var row = operation[0][0];
                            var col = operation[0][1];
                            var newValue = operation[0][3];
                            scope.insertData(row,col,newValue);
                            $rootScope.$broadcast("cellUpdated",{
                                row : row,
                                col : col,
                                value : newValue
                            });
                        },
                        afterCreateCol : function(col, row){
                            // where was the pointer +1 for the new col
                            scope.insertData(row,col,null);
                            $rootScope.$broadcast("cellUpdated",{
                                row : row,
                                col : col,
                                value : null
                            });
                        },
                        afterCreateRow : function(fromRow){
                            // where was the pointer add +1 for the new row
                            $rootScope.$broadcast("datasetUpdated",{row : fromRow});
                        },
                        afterRemoveCol : function(deletedCol){
                            var data = {col : deletedCol};
                            scope.removeData(data);
                            $rootScope.$broadcast("colRemoved",data);
                            angular.forEach(scope.data,function(data, key){
                                $rootScope.$broadcast("cellUpdated",{
                                    row : key,
                                    col : 0,
                                    value : data[0]
                                });
                            });
                        },
                        afterRemoveRow: function(deletedRow){
                            var data = {row : deletedRow};
                            scope.removeData(data);
                            $rootScope.$broadcast("datasetRemoved",data);
                        }
                    };

                    //2. Create a backing object as source with the row x col provided by the user
                    if(!scope.data){
                        scope.data = [];
                        for(var r = 0; r < attrs['row'] ; r++ ){
                            scope.data.push([]);
                            for(var c = 0; c < attrs['col'] ; c++ ){
                                    if(attrs['empty']=='true'){
                                        scope.data[r].push(null);
                                    }else{
                                        if(r == 0){
                                            scope.data[r].push("Heading #" + c);
                                        }else{
                                            scope.data[r].push(0);
                                        }
                                    }
                            }
                        }
                        //Add/Replace the data of the config Object
                        config.data = scope.data;
                    }
                    // Or arrange the data to be displayed properly by the spreadsheet
                    // with the respective Columns and Rows
                    else{
                        config.data = scope.data;
                    }

                    //3. Build the spreadsheet
                    var spreadSheet = new handsontableService.Handsontable(element[0], config);
                    //store the reference to the element in the isolated directive scope
                    scope.spreadSheet = spreadSheet;
                },
                controller : function($scope){
                    $scope.insertData = function(row, col, value){
                        $scope.$apply(function(){
                                $scope.data[row][col] = value;
                        });
                    };

                    $scope.removeData = function(){
                        $scope.$apply(function(){});
                    };
                }
            };//End of the definition object
       });