var DMX = require("dmx")

var dmx = new DMX()
const universeName = 'backend'
dmx.addUniverse(universeName, 'enttec-usb-dmx-pro', '/dev/ttyUSBEnttec')

const port = 4

function setValues(r, g, b) {
	values = {}
	values[port] = r
	values[port+1] = g
	values[port+2] = b
	dmx.update(universeName, values)
}

let i = 0
const scaling = 10
const max = 100
function timedUpdate() {
	setValues(i*scaling%max, i*scaling%max, i*scaling%max)
	i += 1
}

setInterval(timedUpdate, 200)

