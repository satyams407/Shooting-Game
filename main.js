  /*
    This javascript file created by Satyam Sehgal 
	on 15/2/2017
  */

   function myspacegame(){  

	   //dimensions for canvas
        var width_of_canvas = 600;
        var height_of_canvas = 450;
        var FPS = 30;
		var gameScore = 0.00;
		var health=30;
		
		//var gameMusic = new Audio();
	    //gameMusic.src = "sounds/gameMusic.mp3";
	    //gameMusic.loop = true;
	
        // Background music
		Sound.play('gameMusic');
		
		//defining the structure of player
        var player = {
          color: "#f00000",
          x: width_of_canvas/2,
          y: 400,
          width: 20,
          height: 30,
		  health: 30,
          draw: function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
          }
        };
        

        var playerBullets = [];
        
	  //creating instance of bullet
        function Bullet(I) {
          I.active = true;
        
          I.xVelocity = 0;
          I.yVelocity = -I.speed;
          I.width = 3;
          I.height = 3;
          I.color = "#0000f6";
        
          I.inBounds = function() {
            return I.x >= 0 && I.x <= width_of_canvas &&
              I.y >= 0 && I.y <= height_of_canvas;
          };
        
          I.draw = function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
          };
          
          I.update = function() {
            I.x += I.xVelocity;
            I.y += I.yVelocity;
        
            I.active = I.active && I.inBounds();
          };
        
          I.explode = function() {
            this.active = false;
           };
          return I;
        }
        
		//creating enemies instances
        enemies = [];
        specialenemies=[];
        
		function Enemy(I) {
          I = I || {};
        
          I.active = true;
          I.age = Math.floor(Math.random() * (height_of_canvas-60));
          
          I.color = "#f00";
        
          I.x = width_of_canvas / 4 + Math.random() * width_of_canvas / 2;
          I.y = 0;
          I.xVelocity = 0;
		  
		  //Incresing the levels of game by incresing the speed of comming enimies
		  if(gameScore<=500) I.yVelocity = 2;
          else if(gameScore>500 && gameScore<1000) I.yVelocity = 3;
		  else if(gameScore>1000 && gameScore<2000) I.yVelocity = 6;
		  else I.yVelocity =8;
		
		  
          I.width = 32;
          I.height = 32;
          I.special = 0;
		  
          I.inBounds = function() {
            return I.x >= 0 && I.x <= width_of_canvas &&
              I.y >= 0 && I.y <= height_of_canvas;
          };
        
          I.sprite = Sprite("enemy");
        
          I.draw = function() {
            this.sprite.draw(canvas, this.x, this.y);
          };
        
          I.update = function() {
            I.x += I.xVelocity;
            I.y += I.yVelocity;
        
            I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);
        
            I.age++;
        
            I.active = I.active && I.inBounds();
          };
        
          I.explode = function() {
            Sound.play("explosion");
            this.active = false;
           };
          return I;
        };
		
		//function for special type of enemy
		function SpecialEnemy(I) {
          I = I || {};
        
          I.active = true;
          I.age = Math.floor(Math.random() * (height_of_canvas-60));
          
          I.color = "#0ff";
        
          I.x = width_of_canvas / 4 + Math.random() * width_of_canvas / 2;
          I.y = 0;
          I.xVelocity = 0;
		  
		  if(gameScore>=1000) I.yVelocity = 3;
		  else I.yVelocity=1;
		  
          I.width = 32;
          I.height = 32;
        
          I.inBounds = function() {
            return I.x >= 0 && I.x <= width_of_canvas &&
              I.y >= 0 && I.y <= height_of_canvas;
          };
        
          I.sprite = Sprite("special_enemy");
        
          I.draw = function() {
            this.sprite.draw(canvas, this.x, this.y);
          };
        
          I.update = function() {
            I.x += I.xVelocity;
            I.y += I.yVelocity;
        
            I.xVelocity = .3 * Math.sin(I.age * Math.PI / 64);
        
            I.age++;
        
            I.active = I.active && I.inBounds();
          };
        
          I.explode = function() {
            Sound.play("Blaster");
            this.active = false;
           };
          return I;
        };
		
		
		
		//creating canvas 
        var canvasElement = $("<canvas width='" + width_of_canvas + "' height='" + height_of_canvas + "'></canvas");
        var canvas = canvasElement.get(0).getContext("2d");
        canvasElement.appendTo('body');
        
        setInterval(function() {
          update();
          draw();
        }, 1000/FPS);
        
		//Keyboard Controls
        function update() {
          if(keydown.space) {
            player.shoot();
          }
        
          if(keydown.left) {
            player.x -= 5;
          }
        
          if(keydown.right) {
            player.x += 5;
          }
        
          player.x = player.x.clamp(0, width_of_canvas - player.width);
          
          playerBullets.forEach(function(bullet) {
            bullet.update();
          });
        
          playerBullets = playerBullets.filter(function(bullet) {
            return bullet.active;
          });
          
          enemies.forEach(function(enemy) {
            enemy.update();
          });
        
          enemies = enemies.filter(function(enemy) {
            return enemy.active;
          });
		  
		  specialenemies.forEach(function(enemy) {
            enemy.update();
          });
        
          specialenemies = specialenemies.filter(function(enemy) {
            return enemy.active;
          });
        
          handleCollisions();
        
         //for Special type of enemy  		
		if(gameScore>=100 && (gameScore%100)==0){
			  if(Math.random() < .03) specialenemies.push(SpecialEnemy()); 
		 }
		
		  //increasing frequency of enimies when game level got higher
          if(gameScore>1000)
		  {		
            if(Math.random() < .03) 
		    {
             enemies.push(Enemy());
		    }
		  }
		  else
		  {
		   if(Math.random() < .06) 
		   	{
             enemies.push(Enemy());
            }
		  }
		  
		  if(gameScore>=3000) {
			  alert("Congratuations!! You have won this game, now you can do party ");
				document.location.reload();
		  }
        }
        
        player.shoot = function() {
          Sound.play("shoot");
        
          var bulletPosition = this.midpoint();
        
          playerBullets.push(Bullet({
            speed: 5,
            x: bulletPosition.x,
            y: bulletPosition.y
          }));
        };
        
        player.midpoint = function() {
          return {
            x: this.x + this.width/2,
            y: this.y + this.height/2
          };
        };
        
        function draw() {
          canvas.clearRect(0, 0, width_of_canvas, height_of_canvas);
          player.draw();
          drawScore();
		  drawhealth();
          playerBullets.forEach(function(bullet) {
            bullet.draw();
          });
        
          enemies.forEach(function(enemy) {
            enemy.draw();
          });
		  
		   specialenemies.forEach(function(enemy) {
            enemy.draw();
          });
        }
        
        //function to handle whether two objects collides or not
		function collides(a, b) {
          return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
        }
        
		// handling collisions for every (enemy,bullet) and (player,enemy) instances
        function handleCollisions()
		{
          playerBullets.forEach(function(bullet) {
            enemies.forEach(function(enemy) {
              if(collides(bullet, enemy)) {
                enemy.explode();
				gameScore+=10;
                bullet.active = false;
              }
            });
          });
        
          enemies.forEach(function(enemy) {
            if(collides(enemy, player)) {
			health-=10;
			if(health <= 0) {
		     	alert("Game Over and Your Score: "+ gameScore);
				document.location.reload();
			}
              enemy.explode();
              player.explode();
            }
          });
		  
		  playerBullets.forEach(function(bullet) {
            specialenemies.forEach(function(enemy) {
              if(collides(bullet, enemy)) {
                enemy.explode();
				gameScore+=30;
                bullet.active = false;
              }
            });
          });
        
		  
		     specialenemies.forEach(function(enemy) {
               if(collides(enemy,player)){
			    health-=10;
			   
			   if(health <= 0) {
		     	alert("Game Over and Your Score: "+ gameScore);
				document.location.reload();
			 }
               enemy.explode();
               player.explode();
             }
            });
		  
		  enemies.forEach(function(enemy){
		     if((enemy.y + enemy.height)>=height_of_canvas){
			    alert("Game Over and Your Score: " + gameScore);
			 	document.location.reload();
		      }	
		    });
        
		}
		
		//function to display Score of game 
       function drawScore() {
        canvas.font = "14px Verdana";
        canvas.fillStyle = "#0095DD";
        canvas.fillText("Score: "+ gameScore, width_of_canvas-120, 20);
       }
	   
	   //function to display health of player 
	   function drawhealth(){
	    canvas.font = "14px Verdana";
        canvas.fillStyle = "#f00";
        canvas.fillText("Health: " + health, 8, 20);
	   }
       
	   player.explode = function() {
          this.active = false;
        };
        
        player.sprite = Sprite("player");
        
        player.draw = function() {
          this.sprite.draw(canvas, this.x, this.y);
        };
   };