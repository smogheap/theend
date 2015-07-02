SCAPE = {
	canv: null,
	ctx: null,

	seed: 1,

	sky: "#0088ff",
	ground: "#448800",
	horizon: 0.5,
	layers: 2,
	hill: 0.25,
	jaggy: 10,
	suns: 1,
	moons: 1
};


function random() {
    var x = Math.sin(SCAPE.seed++) * 10000;
    return x - Math.floor(x);
}
function lerp(from, to, amt) {
	return (1 - amt) * from + amt * to;
}

function random_color() {
	var r = Math.floor(random() * 255).toString(16);
	if(r.length < 2) { r = "0" + r; }
	var g = Math.floor(random() * 255).toString(16);
	if(g.length < 2) { g = "0" + g; }
	var b = Math.floor(random() * 255).toString(16);
	if(b.length < 2) { b = "0" + b; }
	return "#" + r + g + b;
}
function lerp_color(col1, col2, fade) {
	var r1 = parseInt(col1.substring(1, 3), 16);
	var g1 = parseInt(col1.substring(3, 5), 16);
	var b1 = parseInt(col1.substring(5, 7), 16);
	var r2 = parseInt(col2.substring(1, 3), 16);
	var g2 = parseInt(col2.substring(3, 5), 16);
	var b2 = parseInt(col2.substring(5, 7), 16);
	var r = Math.floor(lerp(r1, r2, fade)).toString(16);
	var g = Math.floor(lerp(g1, g2, fade)).toString(16);
	var b = Math.floor(lerp(b1, b2, fade)).toString(16);
	if(r.length < 2) { r = "0" + r; }
	if(g.length < 2) { g = "0" + g; }
	if(b.length < 2) { b = "0" + b; }
//	console.log(col1, col2, fade, "#"+r+g+b);
	return "#" + r + g + b;
}

function build_ui() {

}

function draw_hills(horizon, color) {
	SCAPE.ctx.save();
//todo: lakes
	SCAPE.ctx.fillStyle = color;
/*
	SCAPE.ctx.fillRect(0, horizon,
					   SCAPE.canv.width, SCAPE.canv.height);
*/
	SCAPE.ctx.beginPath();
	SCAPE.ctx.moveTo(0, horizon);
	var height;
	var x;
	var prevx = 0;
	var prevy = horizon;
	for(var i = 0; i <= SCAPE.jaggy; i++) {
		height = horizon - (SCAPE.canv.height * (random() * SCAPE.hill));
		height += SCAPE.hill / 2;
		x = SCAPE.canv.width * (i / SCAPE.jaggy);

		SCAPE.ctx.lineTo(SCAPE.canv.width * (i / SCAPE.jaggy), height);
//		SCAPE.ctx.quadraticCurveTo((x + prevx) / 2, prevy, x, height);
		prevx = SCAPE.canv.width * (i / SCAPE.jaggy);
		prevy = height;
	}
	SCAPE.ctx.lineTo(SCAPE.canv.width, horizon);
	SCAPE.ctx.lineTo(SCAPE.canv.width, SCAPE.canv.height);
	SCAPE.ctx.lineTo(0, SCAPE.canv.height);
	SCAPE.ctx.closePath();
	SCAPE.ctx.fill();
	SCAPE.ctx.restore();
}
function draw_sun(radius, alpha) {
	SCAPE.ctx.save();
	SCAPE.ctx.fillStyle = "#ffffff";
	SCAPE.ctx.globalAlpha = alpha;
//	console.log(radius);
	SCAPE.ctx.beginPath();
	SCAPE.ctx.arc(random() * (SCAPE.canv.width / 2),
				  random() * (SCAPE.canv.height * SCAPE.horizon),
				  radius, 0, Math.PI * 2);
	SCAPE.ctx.closePath();
	SCAPE.ctx.fill();
	SCAPE.ctx.restore();
}
function draw() {
	SCAPE.ctx.fillStyle = SCAPE.sky;
	SCAPE.ctx.fillRect(0, 0, SCAPE.canv.width, SCAPE.canv.height);

	var i;

	var sunalpha = Math.min(random() + 0.5, 1);
	for(i = 0; i < SCAPE.suns; i++) {
		draw_sun(random() * SCAPE.canv.height, sunalpha);
	}

	if(SCAPE.layers) {
		for(i = 0; i < SCAPE.layers; i++) {
//			console.log(i, i+1.0, SCAPE.layers);
			draw_hills(SCAPE.canv.height * SCAPE.horizon,
//lerp(0, SCAPE.canv.height * SCAPE.horizon,
//							(i + 1.0) / SCAPE.layers),
					   lerp_color(SCAPE.sky, SCAPE.ground,
								  (i + 1.0) / SCAPE.layers));
		}
	}
	//console.log(SCAPE);
}

function apply() {
	SCAPE.seed = parseInt(document.getElementsByName("seed")[0].value, null);
	SCAPE.sky = document.getElementsByName("sky")[0].value;
	SCAPE.ground = document.getElementsByName("ground")[0].value;
	SCAPE.horizon = parseFloat(document.getElementsByName("horizon")[0].value,
							   null);
	SCAPE.layers = parseInt(document.getElementsByName("layers")[0].value,
							null);
	SCAPE.hill = parseFloat(document.getElementsByName("hill")[0].value, null);
	SCAPE.jaggy = parseFloat(document.getElementsByName("jaggy")[0].value,
							 null);
	SCAPE.suns = parseInt(document.getElementsByName("suns")[0].value, null);
	draw();
}
function setup() {
	document.getElementsByName("seed")[0].value = SCAPE.seed;
	document.getElementsByName("sky")[0].value = random_color();
	document.getElementsByName("ground")[0].value = random_color();
	document.getElementsByName("horizon")[0].value = Math.max(Math.min(random(), 0.7), 0.3);
	document.getElementsByName("layers")[0].value = 1 + Math.floor((random() * 3));
	document.getElementsByName("hill")[0].value = random() * 0.5;
	document.getElementsByName("jaggy")[0].value = random() * 50;
	document.getElementsByName("suns")[0].value = Math.floor(random() * 2) + 1;

	apply();
}
function randomize() {
	SCAPE.seed = new Date().getMilliseconds() * new Date().getSeconds();
	setup();
}

window.addEventListener("load", function() {
	SCAPE.canv = document.getElementById("display");
	SCAPE.ctx = SCAPE.canv.getContext("2d");

	setup();
});