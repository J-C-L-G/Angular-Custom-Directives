angular.module("angExc")
       .directive("censoredDirective",function(){
            return {
                scope : true,
                restrict : "AE",
                link : function(scope, element, attrs){
                        //Backup of the original text
                        scope.backupText = element[0].innerText;
                        //Hide process
                        var newStr = scope.backupText;
                        element[0].innerText = newStr.replace(/[^ ]/g,'?');
                        element.css("textDecoration","line-through overline underline");
                    console.log(element);
                }
            }
        });