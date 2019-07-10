var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var fps = 30; //frames per second
var ballSpeedX = 10;
var ballSpeedY = 4;
var paddle1Y = 250;
const paddle_height = 100;
var paddle2Y = 250;
const paddle_thickness = 10;
var player1score = 0;
var player2score = 0;
const winning_score = 2;
var showWinScreen = false;


function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt){
	if (showWinScreen) {
		player1score = 0;
		player2score = 0;
		showWinScreen = false;
	}
}


window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	setInterval(function() {
			moveEverything();
			drawEverything();	
		}, 1000/fps);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove', function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (paddle_height/2);
		});
}

function ballReset(){
	if(player1score >= winning_score || player2score >= winning_score){
		showWinScreen = true;
	}
	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX = -ballSpeedX;
}

function computerMovement() {
	var paddle2YCenter = paddle2Y + (paddle_height/2);
	if (paddle2YCenter < ballY-35) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY+35){
		paddle2Y -= 6;
	}
}

function moveEverything(){
	if (showWinScreen){
		return;
	}
	computerMovement();
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	if (ballX < 0) {
		if (ballY > paddle1Y && ballY < paddle1Y+paddle_height) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY-(paddle1Y+paddle_height/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2score ++; //must be before ballReset()
			ballReset();
		}
	}
	if (ballX > canvas.width) {
		if (ballY > paddle2Y && ballY < paddle2Y+paddle_height) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY-(paddle2Y+paddle_height/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1score ++; //must be before ballReset()
			ballReset();
		}
	}

	if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for(var i=0;i<canvas.height;i+=40) {
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
}
function drawEverything() {
	colorRect(0,0,canvas.width,canvas.height, 'black');
	if (showWinScreen){
		if(player1score >= winning_score){
			canvasContext.fillStyle= "white";
			canvasContext.fillText("Left player wom!", 350,200)
		} else if (player2score >= winning_score){
			canvasContext.fillStyle= "white";
			canvasContext.fillText("Right player won!", 350,200)
		}
		canvasContext.fillStyle= "white";
		canvasContext.fillText("Click to continue", 350,500);
		return;
	}
	drawNet();
	colorRect(0,paddle1Y,paddle_thickness,paddle_height, 'white'); //draws player paddle
	colorRect(canvas.width-paddle_thickness,paddle2Y,paddle_thickness,paddle_height, 'white'); //draws AI paddle
	colorCircle(ballX,ballY,10,'white'); //draws ball
	canvasContext.fillText(player1score, 100,100);
	canvasContext.fillText(player2score, canvas.width-100,100);
}




function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
	canvasContext.fill();
}



function colorRect(leftX, topY, width,height,drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width,height);
}


