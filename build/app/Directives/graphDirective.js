angular.module("angExc")
       .directive("graphDirective",function(highchartsService){

            /*Utility function to build series*/
            function buildSeries(scope){
                var series = [];
                for(var dataSet = 1 ; dataSet < scope.data.length ; dataSet++){
                    series.push(
                        {
                            name : scope.data[dataSet][0] || "",
                            data : scope.data[dataSet].slice(1) || []
                        }
                    )
                }
                return series;
            }
            /*************** Definition Object ************************/
            return {
                restrict : "A",
                scope : { data : "=source"},
                link : function(scope, element, attrs){
                    //Basic Setup
                    var config = {
                        chart: {
                            type: ( attrs['type'] || 'line'),
                            margin: 75,
                            options3d: {
                                enabled: true,
                                alpha: 0,
                                beta: 0,
                                depth: 70
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                depth: 35,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}'
                                }
                            }
                        },
                        title: {
                            text: (attrs['title'] || ''),
                            x: -20 //center
                        },
                        subtitle: {
                            text: (attrs['subtitle'] || ''),
                            x: -20
                        },
                        xAxis: {
                            categories: scope.data[0].slice(1)
                        },
                        yAxis: {
                            title: {
                                text: (attrs['measurein'] || '')
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }]
                        },
                        tooltip: {
                            valueSuffix: ( attrs['suffix'] || ''),
                            pointFormat: '{series.name}: <b> {point.y}</b>'

                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        },
                        credits : {
                            enabled : false
                        }
                    };

                    /* Settings via attributes */
                    if(attrs['type'] == "column"){
                         config.chart.options3d.alpha =  0;
                        config.chart.options3d.beta = 0;
                        config.chart.options3d.depth = 70;
                    }
                    //to create the array for the categories
                    if(attrs['source']){
                        config.series = buildSeries(scope);
                    }

                    /* ..:: Using the Service ::.. */
                    highchartsService.highcharts.call(element,config);
                    var chart = element.highcharts();

                    /************* Subscribe to events act on the rendered graph ************/
                    /*Subscribe to updateDate Event*/
                    scope.$on("cellUpdated",function(event, data){
                        var row = data.row;
                        var col = data.col;
                        var value = parseFloat(data.value) || data.value;

                            //Updating a Set in the graph
                            if(row >= 1){
                                var temp = [];
                                angular.forEach(scope.data[row],function(value, key){
                                    if(key != 0){
                                        temp.push(parseFloat(value) || null);
                                    }
                                });
                                //Row -1 to bypass the headers offset
                                chart.series[row-1].update({name: scope.data[row][0], data:temp});
                            }
                            //Update a Heading in the graph
                            else if( row == 0){
                                chart.xAxis[0].setCategories(scope.data[0].slice(1));
                            }
                    });

                    /*Subscribe to setUpdated Event*/
                    scope.$on("datasetUpdated",function(event, data){
                        var row = data.row;
                        var temp = [];
                            angular.forEach(scope.data[row],function(value, key){
                                if(key != 0){
                                    temp.push(null);
                                }
                            });
                            chart.addSeries({name :"", data: temp});
                    });

                    /*Subscribe to setRemoved Event*/
                    scope.$on("datasetRemoved",function(event, data){
                        var row = data.row;
                        // row -1 since we dont have the header as dataSet
                        console.log(row-1);
                        chart.series[row-1].remove();
                    });

                    /*Subscribe to colRemoved Event*/
                    scope.$on("colRemoved",function(event, data){
                        for(var row = 1 ; row < scope.data.length ; row++){
                            var temp = [];
                            for(var col = 1 ; col < scope.data[row].length ; col++){
                                temp.push(parseFloat(scope.data[row][col]) || null);
                            }
                            chart.series[row-1].update({name: scope.data[row-1][0], data:temp});
                        }
                        //To update the headers
                        chart.xAxis[0].setCategories(scope.data[0].slice(1));
                    });

                    /****************** ..:: Add Handlers for 3D Rotation ********************/
                    if( (attrs['type'] == "column") ) {
                        element.bind('mousedown.hc touchstart.hc', function (e) {
                            e = chart.pointer.normalize(e);

                            var posX = e.pageX,
                                posY = e.pageY,
                                alpha = chart.options.chart.options3d.alpha,
                                beta = chart.options.chart.options3d.beta,
                                newAlpha,
                                newBeta,
                                sensitivity = 3; // lower is more sensitive

                            $(document).bind({
                                'mousemove.hc touchdrag.hc': function (e) {
                                    // Run beta
                                    newBeta = beta + (posX - e.pageX) / sensitivity;
                                    chart.options.chart.options3d.beta = newBeta;

                                    // Run alpha
                                    newAlpha = alpha + (e.pageY - posY) / sensitivity;
                                    chart.options.chart.options3d.alpha = newAlpha;

                                    chart.redraw(false);
                                },
                                'mouseup touchend': function () {
                                    $(document).unbind('.hc');
                                }
                            });
                        });
                    }
                    /****************************** ******************************************/
                }//End of the link function.
            }
       });