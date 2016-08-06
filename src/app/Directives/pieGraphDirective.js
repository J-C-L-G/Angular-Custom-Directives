angular.module("angExc")
    .directive("pieGraphDirective",function(highchartsService){

        /*Utility function to build series*/
        function buildSeries(scope, type, measurein){
            var series = [];
            series.push({
                type: type,
                name: measurein,
                data: []
            });

            for(var dataSet = 1 ; dataSet < scope.data.length ; dataSet++){
                series[0].data.push(scope.data[dataSet]);
            }

            return series;
        }

        return {
            restrict : "A",
            scope : { data : "=source"},
            link : function(scope, element, attrs){
                //Basic Setup
                var config = {
                    chart: {
                        type: 'pie',
                        margin: 75,
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0,
                            depth: 35
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
                            text: ( attrs['measurein'] || '' )
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: (attrs['suffix'] || ''),
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

                //to create the array for the categories
                if(attrs['source']){
                    config.series = buildSeries(scope, attrs['type'],attrs['measurein']);
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
                        if(row > 0 && col > 0){
                            chart.series[0].data[row-1].update(value);
                        }
                        else if(row > 0 && col== 0){
                            config.series = buildSeries(scope, attrs['type'],attrs['measurein']);
                            highchartsService.highcharts.call(element,config);
                            chart = element.highcharts();
                        }
                });

                /*Subscribe to setUpdated Event*/
                scope.$on("datasetUpdated",function(event, data){
                        var row = data.row;
                        scope.data[row] = ["",0];
                });

                /*Subscribe to setRemoved Event*/
                scope.$on("datasetRemoved",function(event, data){
                    config.series = buildSeries(scope, attrs['type'],attrs['measurein']);
                    highchartsService.highcharts.call(element,config);
                    chart = element.highcharts();
                });
            }
        }
    });