var socket = io();
var compData = [];
socket.on('dataTransition', function (data) {
    compData = data;
});
var TeamData = /** @class */ (function () {
    function TeamData(teamNum) {
        this.teamNum = teamNum;
    }
    return TeamData;
}());
