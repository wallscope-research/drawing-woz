let clr
let socket
function setup() {
	// Set canvas size.
	let h = 600
	let w = 600
	socket = io.connect(window.location.origin)
	// Call newDrawing function when the server emits drawing points.
	socket.on('mouse', newDrawing);
	createCanvas(h, w);
	// Set canvas color to black.
	background(0);
	// Set drawing color to cyan.
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
	// This line allows ONLY the artist to draw.
	if(document.URL.includes('id=2')) {
		socket.emit('mouse', data);
		// console.log('sending:', mouseX + ',', mouseY + ',', clr)
		noStroke()
		displayDot(mouseX, mouseY, clr)
	}
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
