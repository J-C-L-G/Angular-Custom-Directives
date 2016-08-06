angular.module('angExc')
    .directive("infiniteScrollHorizontalDirective",function($window){
        return {
            restrict : "A",
            scope : {},
            link: function(scope, element, attrs){

                /* Set the dashboard to display the pictures */
                var container = $window.getComputedStyle(element[0]);
                var imageWidth = parseFloat(container.width) / 6; //5 images per row + margin

                var activeView = angular.element('<div>');
                    activeView.css({
                        border: "1px solid black",
                        display: "inline-block",
                        overflow: "auto",
                        //float: "right",
                        height: imageWidth + (imageWidth/9) + (imageWidth/9) +"px",
                        width: ((imageWidth + (imageWidth/9)) * 20.1 )  + "px",
                        marginTop: (imageWidth/10)+"px",
                        marginBottom: (imageWidth/10)+"px"
                    });

                var begining; //first image on the serie

                for(var img = 0 ; img < 20 ; img++){
                    var activeImg = angular.element("<img>").css(
                        {
                            display: "inline-block",
                            border: "5px inset black",
                            width: imageWidth+"px",
                            height: imageWidth+"px",
                            marginLeft: (imageWidth/10)+"px",
                            marginTop: (imageWidth/10)+"px",
                            marginBottom: (imageWidth/10)+"px"
                        }
                    ).addClass("picture");
                    activeView.append(activeImg);
                    if(img == 0){
                        begining = activeImg;
                    }
                }
                element.append(activeView);

                var newHeight =  imageWidth + (imageWidth/1.8)  ;
                element.css({
                        height: newHeight + "px",
                        overflow: "auto"
                });

                var totalWidth = parseFloat(activeView.css("width"));
                var containerWidth = parseFloat(container.width);
                console.log(totalWidth);
                console.log(containerWidth);
                /*************************************** ***************************************************/

                /*Set up the handler for the scroll event*/
                var imageId = 1;
                var scrolledSize = 0;
                var limit = 5;
                var firstTime = true;
                scope.loadImages(1);
                var tempWidth = totalWidth;
                element.on('scroll', function(event){
                    var scrollPosition = element.scrollLeft();
                    console.log("scrollPosition: " + scrollPosition);
                    console.log("twmpWidth: "+tempWidth);
                    console.log(("scrolledSize: " + scrolledSize));
                    console.log("containerWidth: "+ containerWidth);
                    console.log("(scrollPosition+containerWidth)-tempWidth: " , (scrollPosition+containerWidth)-tempWidth);
                    console.log("((scrollPosition+containerWidth) <= scrolledSize): " , ((scrollPosition+containerWidth+containerWidth) <= scrolledSize));
                    console.log("**************************");
                    console.log("limit: " + limit)
                    if(  ( ((scrollPosition+containerWidth)-tempWidth >= -limit) && ((scrollPosition+containerWidth)-tempWidth <= limit) )  && (scrollPosition > 0)){
                        tempWidth += totalWidth;
                        scrolledSize = scrolledSize + totalWidth;
                        activeView.css({width: (tempWidth+"px")});
                        begining.css({marginLeft: scrollPosition+"px"});
                        imageId += 20;
                        if(firstTime){
                            limit = containerWidth;
                            firstTime = false;
                        }else{
                            limit += limit;
                        }
                        scope.loadImages(imageId);
                    }else if( ((scrollPosition+containerWidth+containerWidth+limit) <= scrolledSize) && (scrollPosition >= 0)){
                        tempWidth -= totalWidth;
                        scrolledSize = scrolledSize - totalWidth;
                        activeView.css({width: (tempWidth+"px")});
                        begining.css({marginLeft: scrollPosition+"px"});
                        imageId -= 20;
                        limit -= containerWidth;
                        scope.loadImages(imageId);
                        if(scrolledSize == 0){
                            firstTime = true;
                            limit = 5;
                            activeView.css({width: (totalWidth+"px")});
                            begining.css({marginLeft: (0+"px")});
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
                            angular.forEach($element.children()[0].childNodes,function(img, key){
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