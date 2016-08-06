angular.module('angExc')
       .factory("handsontableService",function(){
            // Pull from the Global Object the Handsontable function
            var Handsontable = window.Handsontable;
           return {
               Handsontable : Handsontable
           }
       });
