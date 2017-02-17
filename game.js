$(document).ready(function(){
	// variable - canvas
	var canvas = $("#gameCanvas");
	var context= canvas.get(0).getContext("2d");
	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();
	
	// variable - game
	var playGame;
	var score;
	var TimeCheck;
	var loop_TimerCheck;
	
	// variable  - ch
	var mainX;
	var mainY;
	var k_up = false;
	var k_left = false;
	var k_right = false;
	
	var my_state = false;
	var my_motion = false;
	
	var jump_state = false; //오를때 false 내릴때 true;
	var i_g = 0;
	var i_a = 0;
	
	var lastwall = 0;

	var i_down = 0;
	var my_down = 0;

	var i_drop = false;
	var getscore = false;
	// img src
	var Main_image = new Image();
	Main_image.src = "image/Main.png";
	
	// ui
	var ui = $("#gameUI");
	var uiIntro = $("#gameIntro");
	var uiStats = $("#gameStats");
	var uiComplete = $("#gameComplete");
	var uiPlay = $("#gamePlay");
	var uiReset = $("#gameResetbutton");
	
	var ui_left = $("#key_left");
	var ui_jump = $("#key_jump");
	var ui_right = $("#key_right");
	
	var uiScore = $(".gameScore");
	var uiTime = $(".gameTime");
	
	
	

	var wall1 = function(x,y,width,speed,direct){
		this.x = x;
		this.y = y;
		this.width = width;
		this.speed = speed;
		this.direct= direct;
	};
	var wall1s = new Array();
	

	

	
	
	function startGame(){
		uiScore.html("0");
		uiTime.html("60");
		uiStats.show();
		playGame = true;
		
		animate();

	};

	function CompleteGame(){
		for(var i = 0; i <= 5; i++){
			var tmpDeadwalls = wall1s[i];
			wall1s.splice(wall1s.indexOf(tmpDeadwalls),1);
		}
		uiComplete.show();


		playGame = false

	};


	function init(){
		wall1s.push(new wall1(0,500 + 32,canvasWidth,0,0));
		for(var i = 0; i < 5; i ++){
			var width = 40+Math.random()*50;
		
			var x = 10 + (Math.random() * (canvasWidth-width-10));
			var y = 400-(i * 100) + 32;
			var speed = 2+Math.random()*4;
			var direct = Math.random()*1;
			wall1s.push(new wall1(x,y,width,speed,direct));
		};
		mainX = canvasWidth/2 - 16;
		mainY = 500;
		getscore  = false;
		i_a = 0;
		i_g = 0;
		jump_state = false;
		my_state = false;
		my_motion = false;
		i_drop = false;
		score = 0;
		uiStats.hide();
		uiComplete.hide();
		TimeCheck = 60;
		loop_TimerCheck = 0;
	
		


		i_down = 0;
		uiPlay.click(function(e){
			e.preventDefault();
			uiIntro.hide();
			startGame();
		});


		ui_left.mousedown(function(e){
			e.preventDefault();
			k_left = true;
		});
		ui_left.mouseup(function(e){
			e.preventDefault();
			k_left = false;
		});
		ui_right.mousedown(function(e){
			e.preventDefault();
			k_right = true;
		});
		ui_right.mouseup(function(e){
			e.preventDefault();
			k_right = false;
		});
		ui_jump.mousedown(function(e){
			e.preventDefault();
			k_up = true;
		});
		ui_jump.mouseup(function(e){
			e.preventDefault();
			k_up = false;
		});

	};

	function jump(){
		i_g += i_a;
		if(i_g > 0){
			jump_state = true;
		};
		for (var k = 0; k < Math.abs(i_g) ; k++){
			if(jump_state == false){
				mainY --;
			}else{
				mainY ++;
			};
			
			var wall1sLength = wall1s.length;
			for( var i = 0; i < wall1sLength; i++){

				var tmpwall1 = wall1s[i];
				
				hit(mainX+11,mainY,10,32,tmpwall1.x,tmpwall1.y,tmpwall1.width,10);
			};
			
			
		};
	};
	
	function hit_wait(x1,y1,w1,h1,x2,y2,w2,h2,i2){
		var k = 0;
		mainY ++;
		if(x1 + w1 > x2 && x1 < x2 + w2){
			if(y1 + h1 >= y2 && y1 + h1 - 1 < y2 + 2 ){
				k = 1;
			};
		};
		if(k == 0){
			if(x1 + w1 > x2 && x1 < x2 + w2){
				if(y1 + h1 + 1 >= y2 && y1 + h1 - 1 < y2 + 3 ){
					k = 1;
				};
			};
			if(k == 0){
			my_state = true;
			i_drop = true;
			//jump_state = true;
			i_g = 0;
			}
		}else{
			i_drop = false;
			mainY = y2 - 32;
			my_state = false;
			jump_state = false;
		};

	};
	
	function hit(x1,y1,w1,h1,x2,y2,w2,h2){
		if(x1 + w1 > x2 && x1 < x2 + w2){
			if(jump_state == false){
				if(y1 >= y2 + h2 && y1 - 1 < y2 + h2 ){
					i_g = 0;
					jump_state = false;
				};
			}else{
				if(y1 + h1 >= y2 && y1 + h1 - 1 < y2 + 2 ){
					mainY = y2 - 32;
					my_state = false;
					jump_state = false;
					
					var wall1sLength = wall1s.length;
					for( var i = 5; i == wall1sLength; i--){
						
						var tmpwall1 = wall1s[i];
						var tmpwall2 = wall1s[i-1];
						tmpwall2 = tmpwall1;
						
					};
					if(getscore  == false){
					getscore = true;
					var width; 
					if(score < 40){
					width = 60+Math.random()*(50-score);
					}else{
					width = 10 + Math.random()*30;
					};
					score ++;
					TimeCheck++;
					uiScore.html(score);
					uiTime.html(TimeCheck);
					var x = 10 + (Math.random() * (canvasWidth-width-10));
					var y = 100*(-1 * score) + 32;
					
					var speed = 2+Math.random()*(4+score)/2;
					var direct = Math.random()*1;
					wall1s.push(new wall1(x,y,width,speed,direct));
					i_down += 100;
					}
				};
			};

		};
	};

	function down100(){
		my_down +=2;
	};	

	document.onkeydown = function(e){
		var press_key = e || window.event;
		switch (press_key.keyCode) {
			case 38: k_up = true; break;
			case 37: k_left = true; break;//le
			case 39: k_right = true; break;//ri
		}
	};
	document.onkeyup = function(e){
		var press_key = e || window.event;
		switch (press_key.keyCode) {
			case 38: k_up = false; break;
			case 37: k_left = false; break;//le
			case 39: k_right = false; break;//ri
		}
	};
	
	function animate(){

		context.clearRect(0,0,canvasWidth,canvasHeight);
		context.fillStyle = "rgb(100,100,100)";
		
		if(loop_TimerCheck == 25){
			loop_TimerCheck = 0;
			TimeCheck--;
			uiTime.html(TimeCheck);
			//uiStats.show();
		};
		loop_TimerCheck++;
		if(i_down > 0){
			down100();
			i_down -=2;
		};
		if(k_left == true){
			mainX -= 6;
		};
		if(k_right == true){
			mainX += 6;
		};
		if(k_up == true){
			if(my_state == false){
				getscore = false;
				i_a = 1;
				i_g = -20;
				my_state = true;
				//alert(lastwall);
				var tmpDeadwalls = wall1s[0];
				wall1s.splice(wall1s.indexOf(tmpDeadwalls),1);

			};
		};

		if(mainY + 32 > canvasHeight){
			CompleteGame();
		};
		if(TimeCheck < 0){
			CompleteGame();
		};
		if(i_drop==true){
			mainY++;
			i_g ++;
		};
		var wall1sLength = wall1s.length;
		for( var i = 0; i < wall1sLength; i++){
			var tmpwall1 = wall1s[i];
			tmpwall1.x += tmpwall1.speed;
			if(tmpwall1.x < 0){
				tmpwall1.speed *= -1;
			}else if(tmpwall1.x + tmpwall1.width > canvasWidth){
				tmpwall1.speed *= -1;
			};
			context.fillRect(tmpwall1.x,tmpwall1.y + my_down ,tmpwall1.width,10);
		};
		if(my_state == false){
			my_motion = !my_motion;
			context.drawImage(Main_image,32 + my_motion * 32,0,32,32,mainX,mainY  + my_down ,32,32);
			mainX += wall1s[0].speed;
			hit_wait(mainX + 11,mainY,10,32,wall1s[0].x,wall1s[0].y,wall1s[0].width,10);
		}else{
			jump();
			context.drawImage(Main_image,96,0,32,32,mainX,mainY + my_down,32,32);
		};


		
		if(playGame){
			setTimeout(animate,40);
		};
	};
	init();
});
