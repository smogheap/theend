SCAPE = {
	canv: null,
	ctx: null,
	ui: null,

	sky: "#0088ff",
	ground: "#448800",
	horizon: 0.5,
	layers: 2,
	hill: 0.25,
	jaggy: 10,
	suns: 1,
	moons: 1
};


function lerp(from, to, amt) {
	return (1 - amt) * from + amt * to;
}

function random_color() {
	var r = Math.floor(Math.random() * 255).toString(16);
	if(r.length < 2) { r = "0" + r; }
	var g = Math.floor(Math.random() * 255).toString(16);
	if(g.length < 2) { g = "0" + g; }
	var b = Math.floor(Math.random() * 255).toString(16);
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
	console.log(col1, col2, fade, "#"+r+g+b);
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
		height = horizon - (SCAPE.canv.height * (Math.random() * SCAPE.hill));
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
	console.log(radius);
	SCAPE.ctx.beginPath();
	SCAPE.ctx.arc(Math.random() * (SCAPE.canv.width / 2),
				  Math.random() * (SCAPE.canv.height * SCAPE.horizon),
				  radius, 0, Math.PI * 2);
	SCAPE.ctx.closePath();
	SCAPE.ctx.fill();
	SCAPE.ctx.restore();
}
function draw() {
	SCAPE.ctx.fillStyle = SCAPE.sky;
	SCAPE.ctx.fillRect(0, 0, SCAPE.canv.width, SCAPE.canv.height);

	var i;

	var sunalpha = Math.min(Math.random() + 0.5, 1);
	for(i = 0; i < SCAPE.suns; i++) {
		draw_sun(Math.random() * SCAPE.canv.height, sunalpha);
	}

	if(SCAPE.layers) {
		for(i = 0; i < SCAPE.layers; i++) {
			console.log(i, i+1.0, SCAPE.layers);
			draw_hills(SCAPE.canv.height * SCAPE.horizon,
//lerp(0, SCAPE.canv.height * SCAPE.horizon,
//							(i + 1.0) / SCAPE.layers),
					   lerp_color(SCAPE.sky, SCAPE.ground,
								  (i + 1.0) / SCAPE.layers));
		}
	}
	//console.log(SCAPE);
}

window.addEventListener("load", function() {
	SCAPE.canv = document.getElementById("display");
	SCAPE.ctx = SCAPE.canv.getContext("2d");
	SCAPE.ui = document.getElementById("ui");
	SCAPE.sky = random_color();
	SCAPE.ground = random_color();
	SCAPE.horizon = Math.max(Math.min(Math.random(), 0.7), 0.3);
	SCAPE.layers = 1 + Math.floor((Math.random() * 3));
	SCAPE.hill = Math.random() * 0.5;
	SCAPE.jaggy = Math.random() * 50;
	SCAPE.suns = Math.floor(Math.random() * 2) + 1;
	draw();
});