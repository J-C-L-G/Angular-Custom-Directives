angular.module('angExc')
        .factory('flickrFeedService',function($http, $window, $q){
            var images = {};
            var counter = 1;
            var deferred;

            $window.jsonFlickrFeed = function(data) {
                if(data){
                    angular.forEach(data.items,function(image){
                        images[counter++] = image.media.m
                    });
                    deferred.resolve();
                }else{
                    deferred.reject("Error");
                }
            };

            function getMoreImages(){
                //$http.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=starwars&callback=jsonp_callback');
                $http.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?format=json&callback=jsonp_callback');
                deferred = $q.defer();
                return deferred.promise;
            }

            return {
                images : images,
                getMoreImages : getMoreImages
            }
        });