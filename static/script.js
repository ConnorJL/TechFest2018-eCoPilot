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

var updateClock = function () {
    var dt = new Date();
    var time = dt.toISOString().substr(11, 8);
    $(".TripDataTimeBlock").text(time);
    var date = dt.getDate() + "." + (dt.getMonth() + 1) + "." + dt.getFullYear();
    $('.TripDataDateBlock').text(date);
}

setInterval(updateClock, 1000)
