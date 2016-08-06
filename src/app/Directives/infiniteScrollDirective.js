angular.module('angExc')
    .directive("infiniteScrollDirective",function($window){
        return {
            restrict : "A",
            scope : {},
            link: function(scope, element, attrs){

                /* Set the dashboard to display the pictures */
                var container = $window.getComputedStyle(element[0]);
                var containerWidth = container.width;
                var imageWidth = parseFloat(container.width) / 6; //5 images per row + margin

                var scrolled = angular.element('<div>');
                element.append(scrolled);
                var activeView = angular.element('<div>');
                for(var img = 0 ; img < 20 ; img++){
                    var activeImg = angular.element("<img>").css(
                        {
                            display: "inline-block",
                            border: "5px inset black",
                            //borderRadius: "10px",
                            width: imageWidth+"px",
                            height: imageWidth+"px",
                            marginLeft: (imageWidth/7)+"px",
                            marginTop: (imageWidth/10)+"px"
                        }
                    ).addClass("picture");
                    activeView.append(activeImg);
                }
                element.append(activeView);
                var newHeight =  Math.floor(((imageWidth * 4) + ((imageWidth/10) * 4 )) / 2 );
                element.css({width: containerWidth, height: newHeight + "px", overflow: "auto"});
                newHeight = parseFloat(element.css("height"));
                /*************************************** ***************************************************/

                /*Set up the handler for the scroll event*/
                var imageId = 1;
                var scrolledSize = 0;
                scope.loadImages(imageId);
                element.on('scroll', function(event){
                    var scrollPosition = element.scrollTop();
                    if(  ( ((newHeight+scrolledSize)-scrollPosition >= -15) && ((newHeight+scrolledSize)-scrollPosition <= 15) )  && (scrollPosition > 0)){
                        scrolledSize = scrolledSize + newHeight;
                        scrolled.css({height: (scrolledSize+"px")});
                        imageId += 20;
                        scope.loadImages(imageId);
                    }else if( (scrollPosition <= scrolledSize) && (scrollPosition > 0)){
                        scrolledSize = scrolledSize - newHeight;
                        scrolled.css({height: (scrolledSize+"px")});
                        imageId -= 20;
                        scope.loadImages(imageId);
                        if(scrolledSize == 0){
                            scrolled.css({height: (scrolledSize+"px")});
                        }
                    }
                });
            },
            controller : function($scope, $http, flickrFeedService, $element){
                $scope.getImageById = function(id){
                    return flickrFeedService.images[id];
                };

                $scope.loadImages = function(from){
                    var promiseFromService = flickrFeedService.getMoreImages();
                    promiseFromService.then(
                        function(){
                            angular.forEach($element.children()[1].childNodes,function(img, key){
                                img.src = $scope.getImageById(from++);
                            });
                        },
                        function(error){
                            console.log(error)
                        }
                    );
                };
            }
        }
    });