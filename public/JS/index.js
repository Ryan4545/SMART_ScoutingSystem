let teamNumbers = [];
for (i = 0; i < arr.length; i++) {
    fetch(`../ParsedData/${arr[i]}`).then(response => response.json()).then(jsonResponse => {
        teamNumbers.push(jsonResponse.teamNum);
    });
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

let unique = [];
const wait = (delay, ...args) => new Promise(resolve => setTimeout(resolve, delay, ...args));

setTimeout(() => {
    unique = teamNumbers.filter(onlyUnique);
}, 600)

async function getTeamDataInput() {
    let teamNumber = document.getElementById('getTeamData').value;
    document.getElementById('results').innerHTML = "Processing Your Request... Please Wait";
    document.getElementById('results').innerHTML = await compareTeamToBase(teamNumber);
}

Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

async function getAverageData() {
    let numOfDataSets = 0;
    let avgStartingCells = 0;
    let avgDeliveriesLvl1 = 0;
    let avgDeliveriesLvl2 = 0;
    let avgDeliveriesLvl3 = 0;
    let avgPickups = 0;
    let avgClimbs = 0;
    let avgDefenseMoves = 0;
    let avgStage2Spin = 0;
    let avgStage3Spin = 0;

    for (i = 0; i < arr.length; i++) {
        fetch(`../ParsedData/${arr[i]}`).then(response => response.json()).then(jsonResponse => {
            avgStartingCells += jsonResponse.startingCells;
            avgDeliveriesLvl1 += jsonResponse.metrics.deliveriesLvl1;
            avgDeliveriesLvl2 += jsonResponse.metrics.deliveriesLvl2;
            avgDeliveriesLvl3 += jsonResponse.metrics.deliveriesLvl3;
            avgPickups += jsonResponse.metrics.numberOfPickups;
            if (jsonResponse.metrics.climb == "YES") {
                avgClimbs++;
            }
            if (jsonResponse.metrics.stage2Spin == "Spun_3-5_times") {
                avgStage2Spin++;
            }
            if (jsonResponse.metrics.stage2Spin == "LandedOnColor") {
                avgStage3Spin++;
            }
            avgDefenseMoves += jsonResponse.metrics.numDisrupted + jsonResponse.metrics.numPins + jsonResponse.metrics.numPush;
        });
        numOfDataSets = i + 1;
    }

    await wait(700);
    avgClimbs /= numOfDataSets;
    avgDeliveriesLvl1 /= numOfDataSets;
    avgDeliveriesLvl2 /= numOfDataSets;
    avgDeliveriesLvl3 /= numOfDataSets;
    avgPickups /= numOfDataSets;
    avgStage2Spin /= numOfDataSets;
    avgStage3Spin /= numOfDataSets;
    avgStartingCells /= numOfDataSets;
    avgDefenseMoves /= numOfDataSets;

    return { avgClimbs, avgDeliveriesLvl1, avgDeliveriesLvl2, avgDeliveriesLvl3, avgPickups, avgStage2Spin, avgStage3Spin, avgStartingCells, avgDefenseMoves };
}

async function getAverage() {
    document.getElementById('results').innerHTML = "Processing Your Request... Please Wait";
    let averageData = await getAverageData();
    document.getElementById('results').innerHTML = `<div class="averageResults">Average Statistics:<br><ul><li>Average Starting Cells: ${averageData.avgStartingCells.round(3)}</li><li>Average Pickups: ${averageData.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${averageData.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${averageData.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${averageData.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${averageData.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${averageData.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${averageData.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${averageData.avgDefenseMoves.round(3)}</li></ul></div>`;
}

async function getTeamData(text) {
    let numOfDataSets = 0;
    let avgStartingCells = 0;
    let avgDeliveriesLvl1 = 0;
    let avgDeliveriesLvl2 = 0;
    let avgDeliveriesLvl3 = 0;
    let avgPickups = 0;
    let avgClimbs = 0;
    let avgDefenseMoves = 0;
    let avgStage2Spin = 0;
    let avgStage3Spin = 0;
    unique.forEach((data) => {
        if (text == data.substring(3)) {
            for (i = 0; i < arr.length; i++) {
                fetch(`../ParsedData/${arr[i]}`).then(response => response.json()).then(jsonResponse => {
                    if (jsonResponse.teamNum == data) {
                        numOfDataSets++;
                        avgStartingCells += jsonResponse.startingCells;
                        avgDeliveriesLvl1 += jsonResponse.metrics.deliveriesLvl1;
                        avgDeliveriesLvl2 += jsonResponse.metrics.deliveriesLvl2;
                        avgDeliveriesLvl3 += jsonResponse.metrics.deliveriesLvl3;
                        avgPickups += jsonResponse.metrics.numberOfPickups;
                        if (jsonResponse.metrics.climb == "YES") {
                            avgClimbs++;
                        }
                        if (jsonResponse.metrics.stage2Spin == "Spun_3-5_times") {
                            avgStage2Spin++;
                        }
                        if (jsonResponse.metrics.stage2Spin == "LandedOnColor") {
                            avgStage3Spin++;
                        }
                        avgDefenseMoves += jsonResponse.metrics.numDisrupted + jsonResponse.metrics.numPins + jsonResponse.metrics.numPush;
                    }
                });
            }
        }
    })
    await wait(1600)
    avgClimbs /= numOfDataSets;
    avgDeliveriesLvl1 /= numOfDataSets;
    avgDeliveriesLvl2 /= numOfDataSets;
    avgDeliveriesLvl3 /= numOfDataSets;
    avgPickups /= numOfDataSets;
    avgStage2Spin /= numOfDataSets;
    avgStage3Spin /= numOfDataSets;
    avgStartingCells /= numOfDataSets;
    avgDefenseMoves /= numOfDataSets;

    return { avgClimbs, avgDeliveriesLvl1, avgDeliveriesLvl2, avgDeliveriesLvl3, avgPickups, avgStage2Spin, avgStage3Spin, avgStartingCells, avgDefenseMoves };
}

async function compareTeams() {
    document.getElementById('results').innerHTML = "Processing Your Request... Please Wait"

    let team1 = document.getElementById('getTeamDataTeam1').value;
    let team2 = document.getElementById('getTeamDataTeam2').value;

    let avgData1 = await getTeamData(team1);
    let avgData2 = await getTeamData(team2);

    let team1Points = 0;
    let team2Points = 0;

    if (avgData1.avgClimbs > avgData2.avgClimbs && avgData1.avgClimbs != avgData2.avgClimbs) {
        team1Points += 1.50;
    } else if (avgData1.avgClimbs == avgData2.avgClimbs) {} else {
        team2Points += 1.50;
    }
    if (avgData1.avgDeliveriesLvl1 > avgData2.avgDeliveriesLvl1 && avgData1.avgDeliveriesLvl1 != avgData2.avgDeliveriesLvl1) {
        team1Points++;
    } else if (avgData1.avgDeliveriesLvl1 == avgData2.avgDeliveriesLvl1) {} else {
        team2Points++;
    }
    if (avgData1.avgDeliveriesLvl2 > avgData2.avgDeliveriesLvl2 && avgData1.avgDeliveriesLvl2 != avgData2.avgDeliveriesLvl2) {
        team1Points++;
    } else if (avgData1.avgDeliveriesLvl2 == avgData2.avgDeliveriesLvl3) {} else {
        team2Points++;
    }
    if (avgData1.avgDeliveriesLvl3 > avgData2.avgDeliveriesLvl3 && avgData1.avgDeliveriesLvl3 != avgData2.avgDeliveriesLvl3) {
        team1Points += 1.25;
    } else if (avgData1.avgDeliveriesLvl3 == avgData2.avgDeliveriesLvl3) {} else {
        team2Points += 1.25;
    }
    if (avgData1.avgPickups > avgData2.avgPickups && avgData1.avgPickups != avgData2.avgPickups) {
        team1Points += 0.75;
    } else if (avgData1.avgPickups == avgData2.avgPickups) {} else {
        team2Points += 0.75;
    }
    if (avgData1.avgStage2Spin > avgData2.avgStage2Spin && avgData1.avgStage2Spin != avgData2.avgStage2Spin) {
        team1Points++;
    } else if (avgData1.avgStage2Spin == avgData2.avgStage2Spin) {} else {
        team2Points++;
    }
    if (avgData1.avgStage3Spin > avgData2.avgStage3Spin && avgData1.avgStage3Spin != avgData2.avgStage3Spin) {
        team1Points++;
    } else if (avgData1.avgStage3Spin == avgData2.avgStage3Spin) {} else {
        team2Points++;
    }
    if (avgData1.avgDefenseMoves > avgData2.avgDefenseMoves && avgData1.avgDefenseMoves != avgData2.avgDefenseMoves) {
        team1Points++;
    } else if (avgData1.avgDefenseMoves == avgData2.avgDefenseMoves) {} else {
        team2Points++;
    }
    if (Number.isNaN(avgData1.avgPickups)) {
        alert('Team Number 1 is not within our dataset! :(');
    } else if (Number.isNaN(avgData2.avgPickups == NaN)) {
        alert('Team Number 2 is not within our dataset! :(');
    } else {
        if (team1Points > team2Points && team1Points != team2Points) {
            document.getElementById('results').innerHTML = `<div class="averageResults"><div style="display: flex;"><div style="border-right: 2px solid #ddd; padding-right: 9px; margin-right: 18px;">${team1}'s Stats:<br><ul style="color: green;"><li>Average Pickups: ${avgData1.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData1.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData1.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData1.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData1.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData1.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData1.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData1.avgDefenseMoves.round(3)}</li></ul><br>${team1} scored a ${team1Points} / ${team1Points + team2Points}</div><div>${team2}'s Stats:<br><ul style="color: red;"><li>Average Pickups: ${avgData2.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData2.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData2.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData2.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData2.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData2.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData2.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData2.avgDefenseMoves.round(3)}</li></ul><br>${team2} scored a ${team2Points} / ${team1Points + team2Points}</div></div></div>`
        } else if (team1Points == team2Points) {
            document.getElementById('results').innerHTML = `<div class="averageResults"><div style="display: flex;"><div>${team1}'s Stats:<br><ul><li>Average Pickups: ${avgData1.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData1.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData1.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData1.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData1.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData1.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData1.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData1.avgDefenseMoves.round(3)}</li></ul><br>${team1} scored a ${team1Points} / ${team1Points + team2Points}</div><div>${team2}'s Stats:<br><ul><li>Average Pickups: ${avgData2.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData2.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData2.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData2.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData2.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData2.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData2.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData2.avgDefenseMoves.round(3)}</li></ul><br>${team2} scored a ${team2Points} / ${team1Points + team2Points}</div></div></div>`
        } else {
            document.getElementById('results').innerHTML = `<div class="averageResults"><div style="display: flex;"><div>${team1}'s Stats:<br><ul style="color: red;"><li>Average Pickups: ${avgData1.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData1.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData1.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData1.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData1.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData1.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData1.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData1.avgDefenseMoves.round(3)}</li></ul><br>${team1} scored a ${team1Points} / ${team1Points + team2Points}</div><div>${team2}'s Stats:<br><ul style="color: green;"><li>Average Pickups: ${avgData2.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData2.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData2.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData2.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData2.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData2.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData2.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData2.avgDefenseMoves.round(3)}</li></ul><br>${team2} scored a ${team2Points} / ${team1Points + team2Points}</div></div></div>`
        }
    }
}

// Pick List Functions

async function getQuantitativePickList() {
    let time = arr.length;
    let timer = setInterval(() => {
        document.getElementById('results').innerHTML = "Please Wait... System is Processing your request... " + `Estimated Time: ${time}`;
        time--;
    }, 1000);
    let data = [];

    for (i = 0; i < arr.length; i++) {
        if (i != 0) {
            fetch(`../ParsedData/${arr[i]}`).then(response => response.json()).then(jsonResponse => {
                for (x = 0; x < data.length; x++) {
                    let curData = [];
                    let jsonData = [];
                    if (data[x].teamNum.includes(jsonResponse.teamNum)) {
                        curData.push(data[x]);
                        jsonData.push(jsonResponse)
                        data[x] = curData.concat(jsonData);
                        break;
                    } else if (x == data.length - 1) {
                        data.push(jsonResponse);
                        break;
                    }
                }
            });
            await wait(700);
        } else {
            fetch(`../ParsedData/${arr[i]}`).then(response => response.json()).then(jsonResponse => {
                data.push(jsonResponse);
            })
            await wait(700);
        }
    }

    let averageData = await getAverageData();
    let points = [];

    for (i = 0; i < data.length; i++) {
        if (data[i].teamNum == undefined) {
            let teamNumber = '';
            let curPoints = 0;
            let numberOfClimbs1 = 0;
            let avgStage3Spin1 = 0;
            let avgStage2Spin1 = 0;
            for (x = 0; x < data[i].length; x++) {
                teamNumber = data[i][x].teamNum
                if (data[i][x].metrics.deliveriesLvl3 > averageData.avgDeliveriesLvl3 && data[i][x].metrics.deliveriesLvl3 != averageData.avgDeliveriesLvl3) {
                    curPoints += 1.25;
                }
                if (data[i][x].metrics.deliveriesLvl2 > averageData.avgDeliveriesLvl2 && data[i][x].metrics.deliveriesLvl2 != averageData.avgDeliveriesLvl2) {
                    curPoints++;
                }
                if (data[i][x].metrics.deliveriesLvl1 > averageData.avgDeliveriesLvl1 && data[i][x].metrics.deliveriesLvl1 != averageData.avgDeliveriesLvl1) {
                    curPoints++;
                }
                if (data[i][x].metrics.numberOfPickups > averageData.avgPickups && data[i][x].metrics.numberOfPickups != averageData.avgPickups) {
                    curPoints += 0.75;
                }
                if (data[i][x].metrics.climb == "YES") {
                    numberOfClimbs1++;
                }
                if (data[i][x].metrics.stage2Spin == "Spun_3-5_times") {
                    avgStage2Spin1++;
                }
                if (data[i][x].metrics.stage2Spin == "LandedOnColor") {
                    avgStage3Spin1++;
                }
                if ((data[i][x].metrics.numPins + data[i][x].metrics.numPush + data[i][x].metrics.numDisrupted) > averageData.avgDefenseMoves && (data[i][x].metrics.numPins + data[i][x].metrics.numPush + data[i][x].metrics.numDisrupted) != averageData.avgDefenseMoves) {
                    curPoints++;
                }
            }
            if (numberOfClimbs1 > averageData.avgClimbs && numberOfClimbs1 != averageData.avgClimbs) {
                curPoints += 1.50;
            }
            if (avgStage2Spin1 > averageData.avgStage2Spin && avgStage2Spin1 != averageData.avgStage2Spin) {
                curPoints++;
            }
            if (avgStage3Spin1 > averageData.avgStage3Spin && avgStage3Spin1 != averageData.avgStage3Spin) {
                curPoints++;
            }
            points.push(`${teamNumber}_` + curPoints / data[i].length);
        } else {
            let curPoints2 = 0;
            let numberOfClimbs2 = 0;
            let avgStage3Spin2 = 0;
            let avgStage2Spin2 = 0;

            if (data[i].metrics.deliveriesLvl3 > averageData.avgDeliveriesLvl3 && data[i].metrics.deliveriesLvl3 != averageData.avgDeliveriesLvl3) {
                curPoints2 += 1.25
            }
            if (data[i].metrics.deliveriesLvl2 > averageData.avgDeliveriesLvl2 && data[i].metrics.deliveriesLvl2 != averageData.avgDeliveriesLvl2) {
                curPoints2++
            }
            if (data[i].metrics.deliveriesLvl1 > averageData.avgDeliveriesLvl1 && data[i].metrics.deliveriesLvl1 != averageData.avgDeliveriesLvl1) {
                curPoints2++
            }
            if (data[i].metrics.numberOfPickups > averageData.avgPickups && data[i].metrics.numberOfPickups != averageData.avgPickups) {
                curPoints2 += 0.75;
            }
            if (data[i].metrics.climb == "YES") {
                numberOfClimbs2++;
            }
            if (data[i].metrics.stage2Spin == "Spun_3-5_times") {
                avgStage2Spin2++;
            }
            if (data[i].metrics.stage2Spin == "LandedOnColor") {
                avgStage3Spin2++;
            }
            if ((data[i].metrics.numPins + data[i].metrics.numPush + data[i].metrics.numDisrupted) > averageData.avgDefenseMoves && (data[i].metrics.numPins + data[i].metrics.numPush + data[i].metrics.numDisrupted) != averageData.avgDefenseMoves) {
                curPoints2++;
            }
            if (numberOfClimbs2 > averageData.avgClimbs && numberOfClimbs2 != averageData.avgClimbs) {
                curPoints2 += 1.50;
            }
            if (avgStage2Spin2 > averageData.avgStage2Spin && avgStage2Spin2 != averageData.avgStage2Spin) {
                curPoints2++;
            }
            if (avgStage3Spin2 > averageData.avgStage3Spin && avgStage3Spin2 != averageData.avgStage3Spin) {
                curPoints2++;
            }
            points.push(`${data[i].teamNum}_${curPoints2}`)
        }
    }
    let printData = '';

    points.sort(function(p1, p2) {
        if (parseFloat(p1.substring(p1.lastIndexOf('_') + 1)) > parseFloat(p2.substring(p2.lastIndexOf('_') + 1))) {
            return -1;
        } else {
            return 1;
        }
    })

    await wait(700);

    for (i = 0; i < points.length; i++) {
        if (i < 4) {
            printData += `<span style="color: green;">${points[i].substring(3, points[i].lastIndexOf("_"))}: ${points[i].substring(points[i].lastIndexOf("_") + 1)}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="font-size: 24px; cursor: pointer;" onclick="getDetails(${points[i].substring(3, points[i].lastIndexOf("_"))})">&#9660;</span><br>`;
        } else {
            printData += `<span style="color: red;">${points[i].substring(3, points[i].lastIndexOf("_"))}: ${points[i].substring(points[i].lastIndexOf("_") + 1)}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="font-size: 24px; cursor: pointer;" onclick="getDetails(${points[i].substring(3, points[i].lastIndexOf("_"))})">&#9660;</span><br>`;
        }
    }
    window.clearInterval(timer);
    document.getElementById('results').innerHTML = `<div class="resultsPickList">Pick List Data:<br><br>${printData}<br><br>This data was calculated by comparing each team to the base line data and giving them points based on performance. The higher the score is the better they compared to the base line data.</div>`;
}

async function compareTeamToBase(team1) {
    let avgData1 = await getTeamData(team1);
    let avgData2 = await getAverageData();

    let team1Points = 0;
    let team2Points = 0;

    if (avgData1.avgClimbs > avgData2.avgClimbs && avgData1.avgClimbs != avgData2.avgClimbs) {
        team1Points += 1.50;
    } else if (avgData1.avgClimbs == avgData2.avgClimbs) {} else {
        team2Points += 1.50;
    }
    if (avgData1.avgDeliveriesLvl1 > avgData2.avgDeliveriesLvl1 && avgData1.avgDeliveriesLvl1 != avgData2.avgDeliveriesLvl1) {
        team1Points++;
    } else if (avgData1.avgDeliveriesLvl1 == avgData2.avgDeliveriesLvl1) {} else {
        team2Points++;
    }
    if (avgData1.avgDeliveriesLvl2 > avgData2.avgDeliveriesLvl2 && avgData1.avgDeliveriesLvl2 != avgData2.avgDeliveriesLvl2) {
        team1Points++;
    } else if (avgData1.avgDeliveriesLvl2 == avgData2.avgDeliveriesLvl3) {} else {
        team2Points++;
    }
    if (avgData1.avgDeliveriesLvl3 > avgData2.avgDeliveriesLvl3 && avgData1.avgDeliveriesLvl3 != avgData2.avgDeliveriesLvl3) {
        team1Points += 1.25;
    } else if (avgData1.avgDeliveriesLvl3 == avgData2.avgDeliveriesLvl3) {} else {
        team2Points += 1.25;
    }
    if (avgData1.avgPickups > avgData2.avgPickups && avgData1.avgPickups != avgData2.avgPickups) {
        team1Points += 0.75;
    } else if (avgData1.avgPickups == avgData2.avgPickups) {} else {
        team2Points += 0.75;
    }
    if (avgData1.avgStage2Spin > avgData2.avgStage2Spin && avgData1.avgStage2Spin != avgData2.avgStage2Spin) {
        team1Points++;
    } else if (avgData1.avgStage2Spin == avgData2.avgStage2Spin) {} else {
        team2Points++;
    }
    if (avgData1.avgStage3Spin > avgData2.avgStage3Spin && avgData1.avgStage3Spin != avgData2.avgStage3Spin) {
        team1Points++;
    } else if (avgData1.avgStage3Spin == avgData2.avgStage3Spin) {} else {
        team2Points++;
    }
    if (avgData1.avgDefenseMoves > avgData2.avgDefenseMoves && avgData1.avgDefenseMoves != avgData2.avgDefenseMoves) {
        team1Points++;
    } else if (avgData1.avgDefenseMoves == avgData2.avgDefenseMoves) {} else {
        team2Points++;
    }
    if (Number.isNaN(avgData1.avgPickups)) {
        alert('Team Number 1 is not within our dataset! :(');
    } else {
        if (team1Points > team2Points && team1Points != team2Points) {
            return `<div class="averageResults"><div style="display: flex;"><div>${team1}'s Stats:<br><ul style="color: green;"><li>Average Pickups: ${avgData1.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData1.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData1.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData1.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData1.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData1.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData1.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData1.avgDefenseMoves.round(3)}</li></ul><br>${team1} scored a ${team1Points} / ${team1Points + team2Points}</div><div>Base Line's Stats:<br><ul style="color: red;"><li>Average Pickups: ${avgData2.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData2.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData2.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData2.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData2.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData2.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData2.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData2.avgDefenseMoves.round(3)}</li></ul><br>Base Line scored a ${team2Points} / ${team1Points + team2Points}</div></div></div>`
        } else if (team1Points == team2Points) {
            return `<div class="averageResults"><div style="display: flex;"><div>${team1}'s Stats:<br><ul><li>Average Pickups: ${avgData1.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData1.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData1.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData1.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData1.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData1.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData1.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData1.avgDefenseMoves.round(3)}</li></ul><br>${team1} scored a ${team1Points} / ${team1Points + team2Points}</div><div>Base Line's Stats:<br><ul><li>Average Pickups: ${avgData2.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData2.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData2.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData2.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData2.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData2.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData2.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData2.avgDefenseMoves.round(3)}</li></ul><br>Base Line scored a ${team2Points} / ${team1Points + team2Points}</div></div></div>`
        } else {
            return `<div class="averageResults"><div style="display: flex;"><div>${team1}'s Stats:<br><ul style="color: red;"><li>Average Pickups: ${avgData1.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData1.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData1.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData1.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData1.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData1.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData1.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData1.avgDefenseMoves.round(3)}</li></ul><br>${team1} scored a ${team1Points} / ${team1Points + team2Points}</div><div>Base Line's Stats:<br><ul style="color: green;"><li>Average Pickups: ${avgData2.avgPickups.round(3)}</li><li>Average Deliveries Lower Port: ${avgData2.avgDeliveriesLvl1.round(3)}</li><li>Average Deliveries Outer Port: ${avgData2.avgDeliveriesLvl2.round(3)}</li><li>Average Deliveries Inner Port: ${avgData2.avgDeliveriesLvl3.round(3)}</li><li>Average Climbs: ${avgData2.avgClimbs.round(3)}</li><li>Average Stage 2 Completions: ${avgData2.avgStage2Spin.round(3)}</li><li>Average Stage 3 Completions: ${avgData2.avgStage3Spin.round(3)}</li><li>Average Defensive Moves: ${avgData2.avgDefenseMoves.round(3)}</li></ul><br>Base Line scored a ${team2Points} / ${team1Points + team2Points}</div></div></div>`
        }
    }
}


async function getDetails(teamNumber) {
    document.getElementById('results').innerHTML = await compareTeamToBase(teamNumber);
}

// io
const socket = io();


socket.on('getPickClient', () => {
    let data = getQuantitativePickListForServer().then((importData) => {
        setTimeout(() => {
            console.log('Sending Data' + " " + importData);
            socket.emit('pickData', importData);
        }, 5000)
    });
})

async function getQuantitativePickListForServer() {
    let data = [];

    for (i = 0; i < arr.length; i++) {
        if (i != 0) {
            fetch(`../ParsedData/${arr[i]}`).then(response => response.json()).then(jsonResponse => {
                for (x = 0; x < data.length; x++) {
                    let curData = [];
                    let jsonData = [];
                    if (data[x].teamNum.includes(jsonResponse.teamNum)) {
                        curData.push(data[x]);
                        jsonData.push(jsonResponse)
                        data[x] = curData.concat(jsonData);
                        break;
                    } else if (x == data.length - 1) {
                        data.push(jsonResponse);
                        break;
                    }
                }
            });
            await wait(700);
        } else {
            fetch(`../ParsedData/${arr[i]}`).then(response => response.json()).then(jsonResponse => {
                data.push(jsonResponse);
            })
            await wait(700);
        }
    }

    let averageData = await getAverageData();
    let points = [];

    for (i = 0; i < data.length; i++) {
        if (data[i].teamNum == undefined) {
            let teamNumber = '';
            let curPoints = 0;
            let numberOfClimbs1 = 0;
            let avgStage3Spin1 = 0;
            let avgStage2Spin1 = 0;
            for (x = 0; x < data[i].length; x++) {
                teamNumber = data[i][x].teamNum
                if (data[i][x].metrics.deliveriesLvl3 > averageData.avgDeliveriesLvl3 && data[i][x].metrics.deliveriesLvl3 != averageData.avgDeliveriesLvl3) {
                    curPoints += 1.25;
                }
                if (data[i][x].metrics.deliveriesLvl2 > averageData.avgDeliveriesLvl2 && data[i][x].metrics.deliveriesLvl2 != averageData.avgDeliveriesLvl2) {
                    curPoints++;
                }
                if (data[i][x].metrics.deliveriesLvl1 > averageData.avgDeliveriesLvl1 && data[i][x].metrics.deliveriesLvl1 != averageData.avgDeliveriesLvl1) {
                    curPoints++;
                }
                if (data[i][x].metrics.numberOfPickups > averageData.avgPickups && data[i][x].metrics.numberOfPickups != averageData.avgPickups) {
                    curPoints += 0.75;
                }
                if (data[i][x].metrics.climb == "YES") {
                    numberOfClimbs1++;
                }
                if (data[i][x].metrics.stage2Spin == "Spun_3-5_times") {
                    avgStage2Spin1++;
                }
                if (data[i][x].metrics.stage2Spin == "LandedOnColor") {
                    avgStage3Spin1++;
                }
                if ((data[i][x].metrics.numPins + data[i][x].metrics.numPush + data[i][x].metrics.numDisrupted) > averageData.avgDefenseMoves && (data[i][x].metrics.numPins + data[i][x].metrics.numPush + data[i][x].metrics.numDisrupted) != averageData.avgDefenseMoves) {
                    curPoints++;
                }
            }
            if (numberOfClimbs1 > averageData.avgClimbs && numberOfClimbs1 != averageData.avgClimbs) {
                curPoints += 1.50;
            }
            if (avgStage2Spin1 > averageData.avgStage2Spin && avgStage2Spin1 != averageData.avgStage2Spin) {
                curPoints++;
            }
            if (avgStage3Spin1 > averageData.avgStage3Spin && avgStage3Spin1 != averageData.avgStage3Spin) {
                curPoints++;
            }
            points.push(`${teamNumber}_` + curPoints / data[i].length);
        } else {
            let curPoints2 = 0;
            let numberOfClimbs2 = 0;
            let avgStage3Spin2 = 0;
            let avgStage2Spin2 = 0;

            if (data[i].metrics.deliveriesLvl3 > averageData.avgDeliveriesLvl3 && data[i].metrics.deliveriesLvl3 != averageData.avgDeliveriesLvl3) {
                curPoints2 += 1.25
            }
            if (data[i].metrics.deliveriesLvl2 > averageData.avgDeliveriesLvl2 && data[i].metrics.deliveriesLvl2 != averageData.avgDeliveriesLvl2) {
                curPoints2++
            }
            if (data[i].metrics.deliveriesLvl1 > averageData.avgDeliveriesLvl1 && data[i].metrics.deliveriesLvl1 != averageData.avgDeliveriesLvl1) {
                curPoints2++
            }
            if (data[i].metrics.numberOfPickups > averageData.avgPickups && data[i].metrics.numberOfPickups != averageData.avgPickups) {
                curPoints2 += 0.75;
            }
            if (data[i].metrics.climb == "YES") {
                numberOfClimbs2++;
            }
            if (data[i].metrics.stage2Spin == "Spun_3-5_times") {
                avgStage2Spin2++;
            }
            if (data[i].metrics.stage2Spin == "LandedOnColor") {
                avgStage3Spin2++;
            }
            if ((data[i].metrics.numPins + data[i].metrics.numPush + data[i].metrics.numDisrupted) > averageData.avgDefenseMoves && (data[i].metrics.numPins + data[i].metrics.numPush + data[i].metrics.numDisrupted) != averageData.avgDefenseMoves) {
                curPoints2++;
            }
            if (numberOfClimbs2 > averageData.avgClimbs && numberOfClimbs2 != averageData.avgClimbs) {
                curPoints2 += 1.50;
            }
            if (avgStage2Spin2 > averageData.avgStage2Spin && avgStage2Spin2 != averageData.avgStage2Spin) {
                curPoints2++;
            }
            if (avgStage3Spin2 > averageData.avgStage3Spin && avgStage3Spin2 != averageData.avgStage3Spin) {
                curPoints2++;
            }
            points.push(`${data[i].teamNum}_${curPoints2}`)
        }
    }
    let printData = '';

    points.sort(function(p1, p2) {
        if (parseFloat(p1.substring(p1.lastIndexOf('_') + 1)) > parseFloat(p2.substring(p2.lastIndexOf('_') + 1))) {
            return -1;
        } else {
            return 1;
        }
    })

    await wait(700);

    for (i = 0; i < points.length; i++) {
        if (i < 4) {
            printData += `${points[i].substring(3, points[i].lastIndexOf("_"))}: ${points[i].substring(points[i].lastIndexOf("_") + 1)}\n`
        } else {
            printData += `${points[i].substring(3, points[i].lastIndexOf("_"))}: ${points[i].substring(points[i].lastIndexOf("_") + 1)}\n`;
        }
    }
    return (`Pick List Data:\n${printData}\nThis data was calculated by comparing each team to the base line data and giving them points based on performance. The higher the score is the better they compared to the base line data.</div>`);
}