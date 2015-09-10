function Meter(label) {
	this.count = 0;
	this.last = Date.now();
	this.label = label || '';
}

Meter.prototype.inc = function() {
	this.count++;
};

Meter.prototype.clear = function() {
	var now = Date.now();
	var dt = (now - this.last) / 1000;
	console.log(this.label, this.count / dt, 'msg / second');

	this.count = 0;
	this.last = now;
};

module.exports = Meter;