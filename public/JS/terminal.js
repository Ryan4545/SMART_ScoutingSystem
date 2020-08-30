let terminalOpen;
terminalOpen = false;
let response;
let pickListResponse;
function openTerminal() {
    terminalOpen = true;
    document.getElementById('results').style.display = 'none';
    document.getElementById('terminal').style.display = 'block';
    document.getElementById('output').innerHTML = '<div class="smartMsg">>> System: SMART Systems Ready...</div>';
    document.getElementById("cmd").value = '/';
}
function submitCmd(e) {
    if (e.keyCode == 13) {
        var tb = document.getElementById("cmd").value;
        enterCmd(tb);
    }
}
function enterCmd(runCmd) {
    if (runCmd.includes('/raw_')) {
        document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> ${window.location.hash.substring(1)}: ${runCmd}`;
        for (let i = 0; i < arr.length; i++) {
            fetch(`../ParsedData/${arr[i]}`).then(response => response.json()).then(jsonResponse => {
                if (arr[i].includes(runCmd.substring(5))) {
                    response += '<span class="res">' + JSON.stringify(jsonResponse) + "</span><br><br>";
                }
            });
        }
        setTimeout(() => {
            document.getElementById('output').innerHTML += `<br><div class="smartMsgRes">>> System:<br>${response}`;
            document.getElementById("cmd").value = '/';
        }, 1000);
    }
    else {
        switch (runCmd) {
            case "/pickList":
                let val = document.getElementById('output').value;
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> ${window.location.hash.substring(1)}: ${runCmd}`;
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> System: System Processing`;
                getQuantitativePickListForServer().then((importData) => {
                    setTimeout(() => {
                        document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> System: ${importData}</div>`;
                    }, 5000);
                });
                document.getElementById("cmd").value = '/';
                break;
            case "/commands":
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> ${window.location.hash.substring(1)}: ${runCmd}`;
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> System: <br>/pickList => Returns Pick List <br>/raw_&lt;teamNumber&gt; => Returns Teams Raw JSON Data <br>/raw_ => Returns All Raw JSON Data<br>/close => Closes Terminal`;
                document.getElementById("cmd").value = '/';
                break;
            case "/cmd":
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> ${window.location.hash.substring(1)}: ${runCmd}`;
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> System: <br>/pickList => Returns Pick List <br>/raw_&lt;teamNumber&gt; => Returns Teams Raw JSON Data <br>/raw_ => Returns All Raw JSON Data<br>/close => Closes Terminal`;
                document.getElementById("cmd").value = '/';
                break;
            case "/help":
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> ${window.location.hash.substring(1)}: ${runCmd}`;
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> System: <br>/pickList => Returns Pick List <br>/raw_&lt;teamNumber&gt; => Returns Teams Raw JSON Data <br>/raw_ => Returns All Raw JSON Data<br>/close => Closes Terminal`;
                document.getElementById("cmd").value = '/';
                break;
            case "/close":
                closeTerminal();
                break;
            default:
                document.getElementById('output').innerHTML += `<br><div class="smartMsg">>> ${window.location.hash.substring(1)}: ${runCmd}`;
                document.getElementById('output').innerHTML += '<br><div class="smartMsg">>> System: err-return: Sorry Command Not Found</div>';
                document.getElementById("cmd").value = '/';
        }
    }
}
function closeTerminal() {
    terminalOpen = false;
    document.getElementById('terminal').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}
