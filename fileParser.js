const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const { rawListeners } = require('process');
const readline = require('readline');

// fs.watch('./DB/', function(event, filename) {
//     if (event == 'rename') {
//         mainCode();
//     }
// }) // **Listens for files being added**

function mainCode() {
    fs.readdir('./DB/', (err, files) => {
        if (files == '') {
            console.log('\x1b[31m', 'No Files in DB Directory...')
        }
        files.forEach(file => {
            fs.readFile('DB/' + file, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
                console.log('Reading Files');
                console.log('Running Data Complier');
                if (JSON.parse(data).metrics.numberOfPickups >= 0 && JSON.parse(data).metrics.deliveriesLvl1 >= 0 && JSON.parse(data).metrics.deliveriesLvl2 >= 0 && JSON.parse(data).metrics.deliveriesLvl3 >= 0) {
                    fs.writeFile('ParsedData/' + file + ".json", data, (err) => {
                        console.log('Writing Files');
                        if (err) {
                            throw err;
                        } else {
                            console.log('Wrote Files Successfully!');
                        }
                    });
                    fs.writeFile('recoverySystems/' + file + ".json", data, (err) => {
                        console.log('Writing Recovery Files');
                        if (err) {
                            throw err;
                        }
                    });
                    async function askUser() {
                        const ans = await askQuestion("Do you want to delete all the files in ./DB? [yes]/no ");
                        if (ans == 'y' || ans == 'yes') {
                            deleteData();
                        }
                    }
                    setTimeout(() => {
                        askUser();
                    }, 200);
                } else {
                    console.warn('\x1b[31m', '\n>>>WARNING!!! Error Detected in ' + file + ' all scripts have been terminated...\n');
                }
            })
        });
    });

    function deleteData() {
        fs.readdir('./DB/', (err, files) => {
            if (err) {
                throw err;
            }
            for (const file of files) {
                fs.unlink(path.join('DB/', file), err => {
                    console.log('Removing Old Root Files From DB')
                    if (err) throw err;
                });
            }
        })
        console.log("\x1b[32m", 'Process Finished... Terminating Process')
    }
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

mainCode();