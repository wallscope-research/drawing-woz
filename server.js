let path = require('path');
let express = require('express');
let app = express();
let host = 3000
let server = app.listen(host)
const axios = require('axios');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
	path: 'data/gameData' + new Date().getTime() + '.csv',
	header: [
		{id: 'time', title: 'Timestamp'},
		{id: 'pic', title: 'Drawing'},
		{id: 'voice', title: 'Voice'},
		{id: 'text', title: 'Utterance'},
	]
});

app.use(express.static('public'));

app.get('/', function (req, res) {
	if (req.query.id === '1') {
		res.sendFile(path.join(__dirname + '/public/client1.html'));
	} else if (req.query.id === '3') {
		res.sendFile(path.join(__dirname + '/public/client3.html'));
	} else {
		res.sendFile(path.join(__dirname + '/public/client2.html'));
	}

})

app.get('/send-to-tts', async (req, res) => {
	// Set up some variables
	var config = require("./config.json")
	var cereurl = "https://cerevoice.com/rest/rest_1_1.php";
	var str = "<?xml version='1.0'?><speakSimple>" +
		"<accountID>" + config.accountID + "</accountID>" +
		"<password>" + config.password + "</password>" +
		"<voice>" + req.query.vid + "</voice>" +
		"<text>" + req.query.text + "</text></speakSimple>";

	let url

	try {
		// Send the request
		const resp = await axios.post(cereurl, str)
		url = String(resp.data).match(/(?<=<fileUrl>).*?(?=<)/gi)
	} catch (err) {
		console.log(err)
	}
	console.log(url)
	res.send(url)
})

console.log("Socket server is running. localhost:" + host)

let socket = require('socket.io')
let io = socket(server);

io.sockets.on('connection', newConnection)

function newConnection(socket) {
	console.log('connection:', socket.id);
	socket.on('mouse', mouseMsg);
	socket.on('audio', audioMsg);
	socket.on('end', showGuess);
	socket.on('answer', showAnswer);
	socket.on('store', saveState);
	socket.on('reportGuess', sendGuess);
	socket.on('reportPic', sendPic);
	socket.on('reportNarrV', sendNarrV);
	socket.on('reportDrawV', sendDrawV);

	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data)
		// console.log(data)
	}

	function audioMsg(oggUrl) {
		socket.broadcast.emit('raudio', oggUrl)
		// console.log(oggUrl)
	}

	function showGuess(guess) {
		socket.broadcast.emit('guess', guess)
		// console.log(guess)
	}

	function showAnswer(answer) {
		socket.broadcast.emit('finish', answer)
		// console.log(answer)
	}
	function saveState(record) {
		csvWriter.writeRecords(record).then(() => {console.log("Saved");});
	}
	function sendGuess(mguess) {
		socket.broadcast.emit('sendGuess', mguess)
	}
	function sendPic(mpic) {
		socket.broadcast.emit('sendPic', mpic)
	}
	function sendNarrV(mnarrv) {
		socket.broadcast.emit('sendNarrV', mnarrv)
	}
	function sendDrawV(mdrawv) {
		socket.broadcast.emit('sendDrawV', mdrawv)
	}
}