let path = require('path');
let express = require('express');
let app = express();
let host = 3000
let server = app.listen(host)
const axios = require('axios');

// Create csv writer and format it for game data storage.
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

// Return correct player's HTML based on URL id. 1 is the Narrator, 2 is the Artist, and 3 is the Moderator.
app.get('/', function (req, res) {
	if (req.query.id === '1') {
		res.sendFile(path.join(__dirname + '/public/client1.html'));
	} else if (req.query.id === '3') {
		res.sendFile(path.join(__dirname + '/public/client3.html'));
	} else {
		res.sendFile(path.join(__dirname + '/public/client2.html'));
	}

})

// We create this endpoint to send text to the TTS (in this case - Cereproc). The URL of the synthesised speech is returned.
app.get('/send-to-tts', async (req, res) => {
	// The request is constructed from the credentials config and request data.
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

// Setup game on connection to the websocket.
io.sockets.on('connection', newConnection)

function newConnection(socket) {
	console.log('connection:', socket.id);
	// These lines handle incoming data emitted from players. Incoming data is directed to respective functions.
	socket.on('mouse', mouseMsg);
	socket.on('audio', audioMsg);
	socket.on('end', showGuess);
	socket.on('answer', showAnswer);
	socket.on('store', saveState);
	socket.on('reportGuess', sendGuess);
	socket.on('reportPic', sendPic);
	socket.on('reportNarrV', sendNarrV);
	socket.on('reportDrawV', sendDrawV);

	// As the artist draws, they emit coords. This function sends this to sketch.js to display.
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data)
		// console.log(data)
	}

	// This function receives emitted audio URLs and broadcasts it to all players to hear.
	function audioMsg(oggUrl) {
		socket.broadcast.emit('raudio', oggUrl)
		// console.log(oggUrl)
	}

	// When the game is ended by the moderator, the artist's most recent guess is broadcast to the Narrator.
	function showGuess(guess) {
		socket.broadcast.emit('guess', guess)
		// console.log(guess)
	}

	// When the game is ended by the moderator, the answer is broadcast to the artist.
	function showAnswer(answer) {
		socket.broadcast.emit('finish', answer)
		// console.log(answer)
	}

	// When records are emitted by players for storage, this function stores them in a csv.
	function saveState(record) {
		csvWriter.writeRecords(record).then(() => {console.log("Saved");});
	}

	// When the artist guesses, this guess is broadcast to the Moderator.
	function sendGuess(mguess) {
		socket.broadcast.emit('sendGuess', mguess)
	}

	// When the narrator selects their target drawing, this function sends that to the Moderator.
	function sendPic(mpic) {
		socket.broadcast.emit('sendPic', mpic)
	}

	// When the Narrator selects a voice, this choice is sent to the Moderator.
	function sendNarrV(mnarrv) {
		socket.broadcast.emit('sendNarrV', mnarrv)
	}

	// When the Artist selects a voice, this choice is sent to the Moderator.
	function sendDrawV(mdrawv) {
		socket.broadcast.emit('sendDrawV', mdrawv)
	}
}