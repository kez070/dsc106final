var temps_by_state = null;
var curr_time_index = 1;
var fires_by_time = null;
var curr_fire_index = 1;
var fires_data = []

var data = [['us-al', 17.127],
 ['us-az', 15.553],
 ['us-ar', 15.393],
 ['us-ca', 14.407],
 ['us-co', 6.491],
 ['us-ct', 9.553],
 ['us-de', 12.485],
 ['us-dc', 12.39],
 ['us-fl', 21.747],
 ['us-ga', 17.774],
 ['us-id', 4.488],
 ['us-il', 10.791],
 ['us-in', 10.941],
 ['us-ia', 8.163],
 ['us-ks', 11.372],
 ['us-ky', 13.086],
 ['us-la', 18.959],
 ['us-me', 4.6],
 ['us-md', 12.633],
 ['us-ma', 8.104],
 ['us-mi', 6.653],
 ['us-mn', 4.243],
 ['us-ms', 17.515],
 ['us-mo', 11.963],
 ['us-mt', 4.394],
 ['us-ne', 8.08],
 ['us-nv', 9.274],
 ['us-nh', 6.059],
 ['us-nj', 11.178],
 ['us-nm', 12.004],
 ['us-ny', 7.443],
 ['us-nc', 15.239],
 ['us-nd', 3.818],
 ['us-oh', 10.609],
 ['us-ok', 14.9],
 ['us-or', 7.581],
 ['us-pa', 9.516],
 ['us-ri', 9.511],
 ['us-sc', 17.439],
 ['us-sd', 6.115],
 ['us-tn', 14.202],
 ['us-tx', 17.977],
 ['us-ut', 7.944],
 ['us-vt', 5.767],
 ['us-va', 13.287],
 ['us-wa', 7.424],
 ['us-wv', 11.408],
 ['us-wi', 5.914],
 ['us-wy', 4.1]]

// var data = Highcharts.geojson(Highcharts.maps['countries/us/custom/us-all-mainland']),
//     separators = Highcharts.geojson(Highcharts.maps['countries/us/custom/us-all-mainland'], 'mapline'),
//     // Some responsiveness
//     small = $('#container').width() < 400;

console.log(data)

$.getJSON( "./cleaned_temps_monthly.json").then( function( temp_data ) {
    temps_by_state = temp_data
    console.log("GOT THE TEMP DATA")
})

$.getJSON( "./jon_datas.json").then( function( temp_data ) {
    fires_by_time = temp_data
    console.log("GOT THE FIRE DATA")
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function update_temps() {
    for (curr_time_index; curr_time_index < 21; curr_time_index++) {
        console.log(curr_time_index)
        data.forEach(function (p) {
            if (p['hc-key'] in temps_by_state) {
                p.value = temps_by_state[p['hc-key']]['avg_temp'][curr_time_index];
            }
        });
        await sleep(2000);
        chart.series[0].setData(data);
    }
}

async function update_fires() {
    var temp_length = 0;
    for (curr_fire_index; curr_fire_index < fires_by_time.length; curr_fire_index++) {

        fires_data = fires_by_time[curr_fire_index].concat(fires_by_time[curr_fire_index+1])
        console.log(fires_data)

        await sleep(166);
        chart.series[1].setData(fires_data);
    }
}

// Activate the button
document.getElementById('setdata').addEventListener('click', async function() {
    update_temps();
    update_fires();
});

// Instantiate the map
var chart = Highcharts.mapChart('container_map', {
    chart: {
        map: 'countries/us/custom/us-all-mainland'
    },
    title: {
        text: 'Wild Fires and State Temperature By Year'
    },

    subtitle: {
        text: '',
        floating: true,
        align: 'right',
        y: 50,
        style: {
            fontSize: '16px'
        }
    },

    colorAxis: [{
        min: 10,
        max: 20,
        maxColor: '#333333',
        minColor: '#EEEEEE'
    }, {
        minColor: '#e25822',
        maxColor: '#e25822'
    }],

    mapNavigation: {
        enabled: false,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    plotOptions: {
        map: {
            states: {
                hover: {
                    color: '#EEDD66'
                }
            }
        }
    },

    series: [{
        data: data,
        dataLabels: {
            enabled: true,
            color: '#FFFFFF',
            format: '{point.hc-key}'
        },
        borderColor: 'black',
        borderWidth: 1.5,
        name: 'Temperature',
        tooltip: {
            pointFormat: '{point.value}°C'
        },
        name: 'Temperature',
        dataLabels: {
            enabled: true,
            format: '{point.properties.postal-code}'
        }
    }, {
        type: 'mapbubble',
        colorAxis: 1,
        legend: 1,
        dataLabels: {
            enabled: false
        },
        name: 'Wildfires',
        data: fires_data,
        maxSize: '12%',
        color: '#e25822'
    }],

    drilldown: {
        activeDataLabelStyle: {
            color: '#FFFFFF',
            textDecoration: 'none',
            textOutline: '1px #000000'
        }
    }
});
