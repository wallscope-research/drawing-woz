let clr
let socket
function setup() {
	let h = 600
	let w = 600
	socket = io.connect('http://localhost:3000')
	socket.on('mouse', newDrawing);
	createCanvas(h, w);
	background(0);
	clr = 180
	noStroke()
}

function displayDot(x, y, color, color2 = 100) {
	colorMode(HSB)
	fill(color, 100, color2)
	ellipse(x, y, 13)
	colorMode(RGB)
}

function draw() {
}
function mousePressed() {
	mouseDragged()
}
function mouseDragged() {
	clr = upgradeColor(clr)
	let data = {
		x: mouseX,
		y: mouseY,
		color: clr
	}
	socket.emit('mouse', data);
	console.log('sending:', mouseX + ',', mouseY + ',', clr)
	noStroke()
	displayDot(mouseX, mouseY, clr)
}
function newDrawing(data) {
	data.color = upgradeColor(data.color)
	displayDot(data.x, data.y, data.color, 50)
}
function upgradeColor(c) {
	if (c < 0) {
		c = 360 - c
	} else if (c > 360) {
		c = c % 360
	}
	return c
}
