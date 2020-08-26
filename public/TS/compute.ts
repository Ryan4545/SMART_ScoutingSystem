const socket = io();

let compData = [];

socket.on('dataTransition', data => {
    compData = data;
})

class TeamData {

    private teamNum: string;
    private deliveriesLvl1: number;
    private deliveriesLvl2: number;
    private deliveriesLvl3: number;
    private pickups: number;

    constructor(teamNum) {
        this.teamNum = teamNum
    }
}