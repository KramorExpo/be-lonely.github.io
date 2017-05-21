var gameStates = {
	menu: 		0,
	cutScene1: 	1,
	level1: 	2
};

var direction = {
	none:   0,
	left:   1,
	right:  2,
	up:     3,
	down:   4,
};

var game = {
	// create the root of the scene graph
	cutScene1: {
		container: new PIXI.Container()
	},
	stage1: {
		container: new PIXI.Container(),
	},
	player: {},
	isMoving: false,
	isJumping: false,
	movingDirection: direction.none,
	currentStage: gameStates.stage1,

	textures: {},
	renderer: PIXI.autoDetectRenderer(1200, 600, {backgroundColor : 0xEEE8AA})
};

document.getElementById('PlayerCanvasContainer').appendChild(game.renderer.view);

createBackground(game.stage1);

function createBackground(stage)
{
	stage.bg1 = new PIXI.extras.TilingSprite(LoadTextureFromFile('pic/gori1.png'), game.renderer.width, game.renderer.height);
	stage.bg2 = new PIXI.extras.TilingSprite(LoadTextureFromFile('pic/gori2.png'), game.renderer.width, game.renderer.height);
	stage.bg3 = new PIXI.extras.TilingSprite(LoadTextureFromFile('pic/gori3.png'), game.renderer.width, game.renderer.height);
	stage.bg4 = new PIXI.extras.TilingSprite(LoadTextureFromFile('pic/bg1_4.png'), game.renderer.width, game.renderer.height);

	stage.bg1.position.x = 0;
	stage.bg1.position.y = 0;
	stage.bg2.position.x = 0;
	stage.bg2.position.y = 0;
	stage.bg3.position.x = 0;
	stage.bg3.position.y = 0;
	stage.bg4.position.x = 0;
	stage.bg4.position.y = 0;

	stage.container.addChild(stage.bg1);
	stage.container.addChild(stage.bg2);
	stage.container.addChild(stage.bg3);
	//stage.container.addChild(stage.bg4);
}

function MovieClipFromFiles(filename, extension, startIndex, endIndex)
{
	var textures = LoadTexturesArrayFromFile(filename, extension, startIndex, endIndex);
	var clip = new PIXI.extras.MovieClip(textures);
	return clip;
}

function SetPlayerAnimationStand(pl)
{
	pl.stop();
	pl.textures = [LoadTextureFromFile("pic/player/stand.png")];
	pl.currentFrame = 0;
	pl.play();
}
function SetPlayerAnimationJump(pl)
{
	pl.stop();
	pl.textures = [LoadTextureFromFile("pic/player/1.png")];
	pl.currentFrame = 0;
	pl.play();
}
function SetPlayerAnimationRun(pl)
{
	pl.stop();
	pl.textures = LoadTexturesArrayFromFile("pic/player/", ".png", 1, 8);
	pl.animationSpeed = 0.15;
	pl.currentFrame = 0;
	pl.play();
}
function SetPlayerAnimationWalk(pl)
{
	pl.stop();
	pl.textures = LoadTexturesArrayFromFile("pic/player/", ".png", 1, 8);
	pl.animationSpeed = 0.15;
	pl.currentFrame = 0;
	pl.play();
}

function LoadTexturesArrayFromFile(filename, extension, startIndex, endIndex)
{
	var textures = [];
	for (var i = startIndex; i <= endIndex; i++)
	{
		var image = filename + i + extension;
		var texture = LoadTextureFromFile(image);
		textures.push(texture);
	};
	return textures;
}

function LoadTextureFromFile(filename)
{
	var rtex;
	if(!game.textures.hasOwnProperty(filename)) // текстура не загружена
	{
		game.textures[filename] = PIXI.Texture.fromImage(filename);
	}
	rtex = game.textures[filename];
	return rtex;
}

// function SpriteFromFile(filename)
// {
// 	var spr = new PIXI.Sprite(LoadTextureFromFile(filename));
// 	return spr;
// }

game.player = new PIXI.extras.MovieClip(LoadTexturesArrayFromFile("pic/player/", ".png", 1, 8));
SetPlayerAnimationStand(game.player);
game.player.position.x = 150;
game.player.position.y = 0;

// player.animationSpeed = 0.15;
// player.currentFrame = 0;
//player.play();

game.stage1.container.addChild(game.player);

var playerdy = 0;


function makeKosterAniSprite()
{
	var koster = MovieClipFromFiles("pic/koster", ".png", 1, 5);
	koster.animationSpeed = 0.4;
	koster.currentFrame = 0;
	koster.play();
	return koster;
}

var fakel = new PIXI.Sprite(LoadTextureFromFile('pic/fakel.png'));
//game.stage1.container.addChild(fakel);

var darkness = new PIXI.Sprite(LoadTextureFromFile('pic/darkness.png'));
darkness.anchor.x = 0.5;
darkness.anchor.y = 0.5;
darkness.position.x = 150;
darkness.position.y = 50;
game.stage1.container.addChild(darkness);

var groundFiles = ['pic/floor1.png','pic/floor2.png','pic/floor3.png','pic/floor4.png'];
var grounds = [];
var tshift = 0;
for (var i = 0; i < 5; i++) {
	var tground = new PIXI.Sprite(LoadTextureFromFile((groundFiles[getRandomInt(0,groundFiles.length-1)])));
	tground.position.x = tshift;
	tground.position.y = 425;
	tshift += 300;
	grounds.push(tground);
	game.stage1.container.addChild(tground);
};

var obstacles = [];  // препятствия

var cameraShift = 0; // насколько сдвинута камера от начала

// start animating
animate();

function animate() {
	requestAnimationFrame(animate);
	sleep(10);
	if (game.currentStage === gameStates.stage1) {
		animateStage1();
	};
	
}

function animateStage1()
{
	var player = game.player;

	darkness.position.x -= 0.05;

	var stage = game.stage1;
	if(game.movingDirection === direction.right) {
		stage.bg1.tilePosition.x -= 0.2;
		stage.bg2.tilePosition.x -= 0.6;
		stage.bg3.tilePosition.x -= 3;
		stage.bg4.tilePosition.x -= 8;
		for (var i = 0; i < grounds.length; i++) {
			grounds[i].position.x -= 8;
		};
		if(grounds[0].position.x <= -300) {
			stage.container.removeChild(grounds[0]);
			grounds[0].destroy();
    		grounds.splice(0, 1); // remove the first element
    		var tground = new PIXI.Sprite(PIXI.Texture.fromImage(groundFiles[getRandomInt(0,groundFiles.length-1)]));
    		tground.position.x = grounds[grounds.length-1].position.x + 300;
    		tground.position.y = 425;
    		grounds.push(tground);
    		stage.container.addChild(tground);
    	}
    }
    else if(game.movingDirection === direction.left) {
    	stage.bg1.tilePosition.x += 0.2;
    	stage.bg2.tilePosition.x += 0.6;
    	stage.bg3.tilePosition.x += 3;
    	stage.bg4.tilePosition.x += 8;
    	for (var i = 0; i < grounds.length; i++) {
    		grounds[i].position.x += 8;
		}	
	}
	else {
	}

	game.stage1.container.addChild(darkness);

	player.position.y += playerdy;

	if(playerdy > 0)
		playerdy -= 1;
	else if(playerdy < 0)
		playerdy += 1;

	if(game.isJumping)
	{
		if(collidesWithAny(game.player, grounds))
			player.position.y += 15;
		else
		{
			game.isJumping = false;
			if(game.movingDirection != direction.none)
				SetPlayerAnimationRun();
			else
				SetPlayerAnimationStand();
		}
		// if(333 - player.position.y < 15)
		// 	player.position.y = 333;
	}
	else
		if(playerdy > 0 || playerdy < 0)
			playerdy = Math.round(playerdy/2);

	game.renderer.render(game.stage1.container);
}

function collidesWithAny(item, collidables)
{
	var cl = false;
	for (var i = 0; i < collidables.length; i++) {
		if(collides(item, collidables[i]))
		{
			cl = true;
		}
	};
	return cl;
}

function isOnTopOf(pl, fl) {
	var x1 = pl.position.x,
		y1 = pl.position.y,
		x2 = fl.position.x,
		y2 = fl.position.y,
		w1 = pl.width,
		h1 = pl.height,
		w2 = fl.width,
		h2 = fl.height
		ax1 = pl.anchor.x,
		ay1 = item1.anchor.y,
		ax2 = fl.anchor.x,
		ay2 = fl.anchor.y;
	x1 -= w1 * ax1;
	y1 -= h1 * ay1;
	x2 -= w2 * ax2;
	y2 -= h2 * ay2;
	//var firstIsAbove = 
}

function collides(item1, item2) {
	var x1 = item1.position.x,
		y1 = item1.position.y,
		x2 = item2.position.x,
		y2 = item2.position.y,
		w1 = item1.width,
		h1 = item1.height,
		w2 = item2.width,
		h2 = item2.height
		ax1 = item1.anchor.x,
		ay1 = item1.anchor.y,
		ax2 = item2.anchor.x,
		ay2 = item2.anchor.y;
	x1 -= w1 * ax1;
	y1 -= h1 * ay1;
	x2 -= w2 * ax2;
	y2 -= h2 * ay2;

	var collidebyX = (x1 + w1 >= x2) && (x1 + w1 <= x2 + w2),
		collidebyY = (y1 + h1 >= y2) && (y1 + h1 <= y2 + h2);
	
	return (collidebyX || collidebyY);
}

//keyboard(32).press = function(){ jumpSound() };
//The jump sound
function jumpSound() {
	soundEffect(
    523.25,       //frequency
    0.05,         //attack
    0.2,          //decay
    "sine",       //waveform
    3,            //volume
    0.8,          //pan
    0,            //wait before playing
    600,          //pitch bend amount
    true,         //reverse
    100,          //random pitch range
    0,            //dissonance
    undefined,    //echo: [delay, feedback, filter]
    undefined     //reverb: [duration, decay, reverse?]
    );
}

document.addEventListener('keydown', function(event) 
{
	if(game.currentStage === gameStates.stage1) {
	    if(event.keyCode == 32 || event.keyCode == 87) { // SPACE
	    	playerdy = -32;
	    	jumpSound();
	    	game.isJumping = true;
	    	SetPlayerAnimationJump(game.player);
	    }
	    if(event.keyCode == 37 || event.keyCode == 65) { // left
	    	game.movingDirection = direction.left;
	    	SetPlayerAnimationRun(game.player);
	    }
	    else if(event.keyCode == 39 || event.keyCode == 68) { // right
	    	game.movingDirection = direction.right;
	    	SetPlayerAnimationRun(game.player);
	    }
	}
});

document.addEventListener('keyup', function(event) {
	if(event.keyCode == 37 || event.keyCode == 65) {
    	game.movingDirection = direction.none;
		SetPlayerAnimationStand(game.player);
	}
	else if(event.keyCode == 39 || event.keyCode == 68) {
    	game.movingDirection = direction.none;
		SetPlayerAnimationStand(game.player);
	}
});

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
} 