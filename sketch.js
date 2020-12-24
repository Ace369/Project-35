var dog, happyDog, database, foodS, foodStock;
var fedTime, lastFed,feed, addFood, foodObj, foodS;

function preload()
{
  happyDog = loadImage("images/dogImg1.png");
  dogImg = loadImage("images/dogImg.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);
  
  dog = createSprite(200, 200, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();
  
}


function draw() {  
  background(46, 139, 87);

  foodObj.display();

  fedTime = database.ref('FedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Fed: " + lastFed%12 + " PM", 350, 30);
  }else if(lastFed == 0){
    text("Last Fed: 12 AM", 350, 30);
  }else{
    text("Last Fed: " + lastFed + " AM", 350, 30);
  }

  drawSprites();
  //add styles here

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}