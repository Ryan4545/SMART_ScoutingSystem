const fs = require('fs');
const path = require('path');

fs.readdir('./DB/', (err, files) => {
    if (files == '') {
        console.log('No Files In DB Directory')
    }
    files.forEach(file => {
        fs.readFile('DB/' + file, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            console.log('Reading Files...')
            fs.writeFile('ParsedData/' + file + ".json", data, (err) => {
                console.log('Writing Files')
                if (err) {
                    throw err;
                } else {
                    console.log('Wrote Files Successfully!');
                }
            })
        })
    });
});

setTimeout(() => {

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
    console.log('Process Finished... Terminating Process')
}, 800);