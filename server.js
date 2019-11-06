let path = require('path');
let express = require('express');
let app = express();
let host = 3000
let server = app.listen(host)
const axios = require('axios');

app.use(express.static('public'));

app.get('/', function(req, res) {
	if(req.query.id==='1') {
		res.sendFile(path.join(__dirname + '/public/client1.html'));
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
	} catch(err){
		console.log(err)
	}
	console.log(url)
	res.send(url)
})

console.log("Socket server is running. localhost:" + host)

let socket = require('socket.io')
let io = socket(server);

io.sockets.on('connection', newConnection)

function newConnection(socket){
	console.log('connection:',	socket.id);
	socket.on('mouse', mouseMsg);
	
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data)
		console.log(data)
	}
}