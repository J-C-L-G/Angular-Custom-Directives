angular.module("angExc")
    .directive("visibleDirective",function(){
        return {
            restrict : "AE",
            link : function(scope, element, attrs){
                //default
                element.css("color", "black").css("backgroundColor", "black");
                //if a color is provided
                if(attrs['color']){
                    element.css({backgroundColor: attrs['color'] , color: attrs['color']});
                }
            }
        }
    });