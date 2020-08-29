const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const http = require('http');
const discord = require('discord.js');
const { createInterface } = require('readline');
const client = new discord.Client();

const app = express();
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(cookieParser('hfgbdggd773627991739fhhfbawchgg8297f6287fh02h'));
let PORT = process.env.PORT || 8080;

app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/ParsedData", express.static(path.join(__dirname, 'ParsedData')));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', socket => {
    socket.emit('dataTransition', allFiles);

    socket.on('pickData', (data) => {
        fs.writeFileSync('pickLists/newList.txt', data, (err) => {
            if (err) throw err
        });
    })
})

let allFiles = [];

app.get('/dash', (req, res) => {
    let auth = false;
    let data = JSON.parse(fs.readFileSync('admin.json', 'utf-8'));
    let apiTokens = req.query.api;
    for (i = 0; i < data.users.length; i++) {
        if (req.signedCookies.login_data_apiToken133242 == `userID:22345889837627${data.users[i]}_${apiTokens}`) {
            auth = true;
            go();
        }
    }

    function go() {
        auth = false;
        allFiles = [];
        fs.readdir('./ParsedData/', (err, files) => {
            if (err) {
                throw err;
            }
            files.forEach(file => {
                allFiles.push(file);
            });
        });
        setTimeout(() => {
            res.render('index.html', { content: allFiles });
        }, 1000);
    }
});

app.get('/', (req, res) => {
    res.clearCookie('login_data_apiToken133242');
    res.render('login.html');
});

app.get('/about', (req, res) => {
    res.render('about.html');
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.post('/login', urlencodedParser, function(req, res) {
    let options = {
        maxAge: 1000 * 60 * 350,
        httpOnly: true,
        signed: true
    }
    let id = '';
    let data = JSON.parse(fs.readFileSync('admin.json', 'utf-8'));
    for (i = 0; i < data.users.length; i++) {
        if (data.users[i] == req.body.password) {
            id = makeid(8);
            res.cookie('login_data_apiToken133242', `userID:22345889837627${data.users[i]}_${id}`, options).redirect('/dash?api=' + id);
        } else if (i == data.users.length - 1) {
            res.redirect('/');
        }
    }
});

console.log(`Starting Server on access PORT ${PORT}! `)
server.listen(PORT);

// Discord Bot Messaging Systems

client.on('ready', () => {
    client.guilds.cache.forEach((guild) => {
        guild.channels.cache.forEach((channel) => {
            // console.log(` -> ${guild.name}: ${channel.name} ${channel.id} ${channel.type}`); // This gives channel bot has access to
        });
    });
    console.log('>>All Discord Bot Systems Ready Awaiting Instructions...');
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }
    if (receivedMessage.content == "!pickList") {
        receivedMessage.channel.send('Please Wait One Minute While The Data Is Processed');
        io.sockets.emit('getPickClient')
        setTimeout(() => {
            // receivedMessage.channel.send(new Discord.Attachment('pickLists/newList.txt', 'newList.txt')).catch(console.error);
            receivedMessage.channel.send('Data: ', {
                files: [
                    'pickLists/newList.txt'
                ]
            })
        }, 10000)
    }
})

client.login('NjU2MjUyODE5OTQyMTQ2MDg4.Xff9EA.ZICghEXNDngqWbbi-RqVw-fDWd4');