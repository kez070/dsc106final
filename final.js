function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

var acres = {}
Highcharts.ajax({
    url: 'acres.json',
    dataType: 'text',
    success: function (data) {
        data = JSON.parse(data);
        console.log(data)
        vals = []
        years = []
        for(var i=1992;i<2016;i++){
            acres[i] = (parseInt(data[i]["Acres"].replace(/,/g, '')))
            vals.push(parseInt(data[i]["Acres"].replace(/,/g, '')))
            years.push(i)
        }

        $(function () {
            Highcharts.chart('container_line',{
                tooltip: {
                    crosshairs: true
                },
                chart :{
                    backgroundColor: 'transparent',
                },
                title : {
                    text: "Acres of Land Burned in the US"
                },
                yAxis: {
                    title: {
                    text: 'Number of Acres'
                    }
                },
                plotOptions: {
                    series: {
                        
                        marker: {
                            enabled: true,
                            radius: 0.1,
                            states: {
                                hover: {
                                    enabled: false
                                },
                                select: {
                                    enabled: true,
                                    radius: 5
                                }
                            }
                        }
                    }
                },
                xAxis: {
                    categories: years
                },
                series: [{
                    name: "Acres of Land Burned",
                    data: vals
                }]
            });
        
            // button handler
            var chart = $('#container_line').highcharts(),
                chart_i = 0;
            $('#button').click(async function() {
                for(var i =0; i< 24;i++) {
                    await sleep(700);
                    rangeValue(100+(i*9))
                    if (chart_i == chart.series[0].data.length) {
                        chart_i = 0;
                    }
                    chart.series[0].data[chart_i].select();
                    chart.tooltip.refresh(chart.series[0].data[chart_i]);
                    chart_i++;
                }
            });
        });
    }
});
var elem = document.querySelector('input[type="range"]');
var year_dict = {}

var temp_year = 1992
var counter = 0
for (var i =100;i<317;i++){
    if (counter === 9){
        counter = 0
        temp_year += 1
    }
    year_dict[i] = temp_year
    counter += 1
}
var rangeValue = function(newValue){
    acres_num = acres[year_dict[newValue]]
    console.log(acres_num)
    document.getElementsByClassName('fire')[0].style.width = newValue;
    document.getElementsByClassName('fire')[0].style.height = newValue;
    offset = 50+(parseInt(newValue)/2)
    document.getElementsByClassName('fire')[0].style.top = "calc(245% - " +offset+"px)";
    document.getElementsByClassName('fire')[0].style.left = "calc(90% - "+offset+"px)";
    // odometer.innerHTML = acres_num
    //year.innerHTML = "Year-" + year_dict[newValue]
   
//   var target = document.querySelector('.value');
//   target.innerText = fireString;
}
elem.addEventListener("input", rangeValue);




$(function() {

    Highcharts.ajax({
        url: 'avg_temps.json',
        dataType: 'text',
        success: function (data) {
            data = JSON.parse(data);

            data_temp = []
            for(var i=1851; i < 2014; i++){
                data_temp.push([i,data.AverageTemperature[i]])
            }

            Highcharts.chart('container', {
            
            chart: {
                animation: {
                duration: 1000
                },
                type: 'scatter',
                zoomType: 'xy',
                events: {
                load: function() {
                    var chart = this,
                    yAxis = chart.yAxis[0];
        
                    chart.update({
                    plotOptions: {
                        series: {
                        color: {
                            linearGradient: [0, 10, 0,500]
                        }
                        }
                    }
                    });
                }
                }
            },
            title: {
                text: 'Average Ground Temperature In the US'
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            yAxis: {
                title: {
                text: 'Degrees Celcius'
                }
            },
            tooltip: {
                pointFormat: 'Year - <b>{point.x}</b>\nDegrees Celcius: <b>{point.y:.1f} </b>'
            },
            plotOptions: {
                series: {
                color: {
                    linearGradient: [0, 9, 0, 14],
                    stops: [
                    [0.00, '#800080'],
                    [0.25, '#FF0000'],
                    [0.50, '#FFFF00'],
                    [0.60, '#108dc7'], 
                    [0.75, '#108dc7'],
                    [1.00, '#108dc7']
                    ]
                }
                }
            },
            
            series: [{
                data: 
                    data_temp
                    
            }]
            });
        }
    });
  });


   Highcharts.ajax({
        url: 'fire_by_year.json',
        dataType: 'text',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data)
            fire_data = []
            for(var i = 0; i < 24;i++){
                fire_data.push([data.FIRE_YEAR[i],data.count[i]]);
            }
            console.log(fire_data);
            Highcharts.chart('bar_container', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Number of Fires Per Year In The United States'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number Of Fires'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'Number of Fires: <b>{point.y:.1f} </b>'
                },
                series: [{
                    name: 'Population',
                    data: fire_data,
                    color: {
                        linearGradient: {
                          x1: 0,
                          x2: 0,
                          y1: 0,
                          y2: 1
                        },
                        stops: [
                          [0, '#EE9617'],
                          [1, '#FE5858']
                        ]
                      }
                
                }]
            });
        }
    });

    