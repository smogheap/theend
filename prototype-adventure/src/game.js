var GAME = {
	thing: {
		"ship": {
			"name": "blank",
			"above": [
				{
					"name": "ring0",
					"image": "image/ship-ring-door.png",
					"scale": 0.02,
					"alpha": 1,
					"rotate": 0,
					"pivot": {
						x: 128,
						y: 128
					},
					"above": [
						{
							"name": "ring1",
							"image": "image/ship-ring-blank.png",
							"scale": 3.9,
							"alpha": 1,
							"rotate": 0,
							"offset": {
								x: 128,
								y: 128
							},
							"pivot": {
								x: 128,
								y: 128
							},
							"above": [
								{
									"name": "ring2",
									"image": "image/ship-ring-stasis.png",
									"scale": 3.9,
									"alpha": 1,
									"rotate": 0,
									"offset": {
										x: 128,
										y: 128
									},
									"pivot": {
										x: 128,
										y: 128
									},
									"above": [
										{
											"name": "ring3",
											"image": "image/ship-ring-dark.png",
											"scale": 3.9,
											"alpha": 1,
											"rotate": 0,
											"offset": {
												x: 128,
												y: 128
											},
											"pivot": {
												x: 128,
												y: 128
											},
											"above": [
												{
													"name": "ring4",
													"image": "image/ship-ring-blue.png",
													"scale": 3.9,
													"alpha": 1,
													"rotate": 0,
													"offset": {
														x: 128,
														y: 128
													},
													"pivot": {
														x: 128,
														y: 128
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		}
	},
	obj: {},
	scene: null,
	rot: 0,
	scale: 0,
	jaggy: false
};

function mousemove(e) {
	GAME.rot = e.clientX / 2;
}
function mousewheel(e) {
	if(e.deltaY > 0) {
		GAME.scale *= 0.75;
	} else {
		GAME.scale *= 1.5;
	}
	GAME.scale = Math.max(GAME.scale, 0.02);
	GAME.scale = Math.min(GAME.scale, 1.2);
}
function mouseclick(e) {
	GAME.jaggy = !GAME.jaggy;
	GAME.scene.setJaggy(GAME.jaggy);
}

function start() {
	GAME.scene = new penduinSCENE(document.querySelector("canvas"),
								  640, 360, tick);
	GAME.obj.ship.x = 320;
	GAME.obj.ship.y = 180;
	GAME.scene.addOBJ(GAME.obj.ship);

	GAME.rot = GAME.obj.ship.$.ring0.rotate;
	GAME.scale = GAME.obj.ship.$.ring0.scale;

	window.addEventListener("mousemove", mousemove);
	window.addEventListener("wheel", mousewheel);
	window.addEventListener("click", mouseclick);
}

function tick(time) {
	GAME.obj.ship.$.ring0.rotate = (GAME.obj.ship.$.ring0.rotate + GAME.rot)/2;
	GAME.obj.ship.$.ring0.scale = (GAME.obj.ship.$.ring0.scale + GAME.scale)/2;
}

function combineCallbacks(cbList, resultsVary, cb) {
	var results = [];
	var res = [];
	var uniq = [];
	while(results.length < cbList.length) {
		results.push(null);
	}

	cbList.every(function(callback, idx) {
		return callback(function(val) {
			res.push(val);
			results[idx] = val;
			if(uniq.indexOf(val) < 0) {
				uniq.push(val);
			}
			if(res.length === cbList.length) {
				if(uniq.length === 1) {
					cb(uniq[0], results);
				} else if(uniq.length > 1) {
					cb(resultsVary, results);
				} else {
					cb(null, results);
				}
			}
		});
	});
}

window.addEventListener("load", function() {
	var cbs = [];

	// load ship armatures
	Object.keys(GAME.thing).every(function(key) {
		cbs.push(function(cb) {
			GAME.obj[key] = new penduinOBJ(GAME.thing[key], cb);
			return true;
		});
		return true;
	});

	combineCallbacks(cbs, null, start);
});
