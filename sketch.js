var backgroundImage;
var mario, marioRunning, marioCollided;
var edge;
var ground, groundImage, invisibleGround;
var brick, brickImage;
var obstacle, obstacleImage;
var PLAY=1;
var END=0;
var gameState= PLAY;
var gameOver, gameOverImage;
var restart, restartImage;
var coin, coinImage;
var score=0;
var coinCollected=0;
var checkPointSound, dieSound, jumpSound;

function preload(){
  backgroundImage=loadImage("bg.png");
  
  marioRunning= loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  
  marioCollided= loadAnimation("collided.png");
  
  groundImage=loadImage("ground2.png");
  
  brickImage=loadImage("brick.png");
  
  obstacleImage=loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  coinImage= loadAnimation("coin1.png","coin2.png","coin3.png","coin4.png");
  
  gameOverImage= loadImage("gameOver.png");
  
  restartImage= loadImage("restart.png");
  
  checkPointSound= loadSound("checkPoint.mp3");
  
  dieSound= loadSound("die.mp3");
  
  jumpSound= loadSound("jump.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  ground= createSprite(width/2,height-57,width,20);
  ground.addImage("ground",groundImage);
  ground.scale=1.4;
  
  invisibleGround= createSprite(width/2,height-100,width,10);
  invisibleGround.visible= false;
  
  //mario
  mario= createSprite(140,height-100,20,50);
  mario.addAnimation("running", marioRunning);
  mario.addAnimation("collided", marioCollided);
  mario.scale=1.8;
  
  gameOver= createSprite(width/2,height/2- 50);
  gameOver.addImage("gameover", gameOverImage);
  gameOver.scale=0.7;
  
  restart= createSprite(width/2,height/2);
  restart.addImage("restart", restartImage);
  restart.scale=0.5;
  
  brickGroup = new Group();
  obstacleGroup= new Group();
  coinGroup= new Group();
  
  edge= createEdgeSprites();
}

function draw(){
  background(backgroundImage);
  
  stroke("black");
  textSize(20);
  text("Score= "+ score, 450,20);
  
  stroke("black");
  textSize(20);
  text("Coin= "+ coinCollected, 350,20);
  //console.log(mario.y);
  
  if(gameState===PLAY){
    gameOver.visible=false;
    restart.visible=false;
    
    ground.velocityX=-8;
    
    if(ground.x<0){
    ground.x=ground.width/2;
  }
    
    if((touches.length > 0 || keyDown("SPACE")) && mario.y  >= height-120) {
    mario.velocityY=-20;
    jumpSound.play();
    touches=[];
  }
  mario.velocityY=mario.velocityY+1;
    
   for (var i = 0; i < brickGroup.length; i++) {

        if(brickGroup.get(i).isTouching(mario)){
        brickGroup.get(i).remove()
        score =score+1;
        }
   }
    
    for (var a = 0; a < coinGroup.length; a++) {

        if(coinGroup.get(a).isTouching(mario)){
        coinGroup.get(a).remove()
        coinCollected =coinCollected+5;
        }
   }
    
    if((coinCollected>0 && coinCollected%100===0) || (score>0 && score%10===0)){
      checkPointSound.play();
    }
    
    spawnCoin();
    spawnBrick();
    spawnObastacle();
    
    if(mario.isTouching(obstacleGroup)){
      gameState=END;
      dieSound.play();
    }
    
    
  }
  else if(gameState===END){
    gameOver.visible=true;
    restart.visible=true;
    
    mario.velocityY=0;
    
    ground.velocityX=0;
    
    mario.changeAnimation("collided",marioCollided);
    
    coinGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    
    coinGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    
    if(touches.length>0 || keyDown("SPACE")){
      reset();
      touches=[]
    }
    
  }
  
  mario.collide(invisibleGround);
  
  
  drawSprites();
  
}

function spawnBrick(){
  if(frameCount%70===0){
    brick=createSprite(width+20,height-400,40,10);
    brick.addImage("brick",brickImage);
    brick.y= Math.round(random(300,380));
    brick.velocityX=-6;
    brick.lifetime=220;
    brick.depth=mario.depth;
    mario.depth=mario.depth+1;
    brickGroup.add(brick)
  }
}

function spawnObastacle(){
  if(frameCount%110===0){
    obstacle= createSprite(600,height-130,20,30);
    obstacle.addAnimation("obstacle", obstacleImage);
    obstacle.velocityX=-5;
    obstacle.scale=0.9;
    obstacle.lifetime=120;
    obstacleGroup.add(obstacle);
  }
}

function reset(){
  gameState=PLAY
  
  mario.changeAnimation("running", marioRunning);
  
  gameOver.visible= false;
  restart.visible= false;
  
  score=0;
  coinCollected=0;
  
  coinGroup.destroyEach();
  brickGroup.destroyEach();
  obstacleGroup.destroyEach();
  
}

function spawnCoin(){
  if(frameCount%160===0){
    coin= createSprite(width+20,height-300,40,10);
    coin.addAnimation("coin", coinImage);
    coin.y= Math.round(random(300,400));
    coin.velocityX=-4;
    coin.scale=0.1;
    coin.lifetime=220;
    coinGroup.add(coin);
  }
}