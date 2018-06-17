var data = {
    series: [
        [5, 4, 3, 7, 5, 10]
    ]
};
var options = {
    showPoint: false,
    lineSmooth: true,
    axisX: {
        showGrid: false,
        showLabel: false
    },
    axisY: {
        showGrid: true,
        showLabel: false
    }
};
var elevationChart = new Chartist.Line('.Hoehengraph', data, options);
var speedChart = new Chartist.Line('.SpeedGraph', data, options);
var scoreChart = new Gauge($('.ScoreSubblock')[0]).setOptions({
    angle: -0.2, // The span of the gauge arc
    lineWidth: 0.2, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: 'white' // Fill color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: 'red',   // Colors
    colorStop: 'red',    // just experiment with them
    strokeColor: 'green',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support

});

scoreChart.maxValue = 5000; // set max gauge value
scoreChart.setMinValue(0);  // Prefer setter over gauge.minValue = 0
scoreChart.animationSpeed = 32; // set animation speed (32 is default value)
scoreChart.set(3000); // set actual value


var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function () {
});
var updateElevationChart = function (d) {
    var data = {
        series: [
            d
        ]
    };
    elevationChart.update(data);
};
socket.on('updateElevation', updateElevationChart);
var updateSpeedChart = function (d) {
    var data = {
        series: [
            d
        ]
    };
    speedChart.update(data);
};
socket.on('updateSpeed', updateSpeedChart);
var updateScoreChart = function (d) {
    scoreChart.set(d);
    $(".ScoreNumber").html(d);
};
socket.on('updateScore', updateScoreChart);

var updateClock = function () {
    var dt = new Date();
    var time = dt.toISOString().substr(11, 8);
    $(".TripDataTimeBlock").text(time);
    var date = dt.getDate() + "." + (dt.getMonth() + 1) + "." + dt.getFullYear();
    $('.TripDataDateBlock').text(date);
}

setInterval(updateClock, 1000)
