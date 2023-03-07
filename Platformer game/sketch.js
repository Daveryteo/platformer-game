var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var treePos_y;
var canyon;
var collectable;
var game_score;
var flagpole;
var lives;

var jumpSound;
var fallingsound;
var gameoversound;
var winsound;
var itemsound;
var backgroundsound;
var backgroundsoundplayed;
var enemysound;

var platforms;

var enemies;

function preload()
{
    soundFormats('mp3','wav');

    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    fallingsound = loadSound('assets/Falling.wav');
    fallingsound.setVolume(0.1);
    gameoversound = loadSound('assets/Game over.wav');
    gameoversound.setVolume(0.1);
    winsound = loadSound('assets/Victory.wav');
    winsound.setVolume(0.1);
    itemsound = loadSound('assets/Collect Item.wav');
    itemsound.setVolume(0.1);
    backgroundsound = loadSound('assets/Background.wav');
    backgroundsound.setVolume(0.1);
    enemysound = loadSound('assets/Enemy death.wav');
    enemysound.setVolume(0.1);
}


function setup()
{
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;

    //Lives
    lives = 3;

    //Start game
    startGame();

    //Initialise platforms
    platforms = [
        createPlatforms(200, floorPos_y - 40, 100),
        createPlatforms(600, floorPos_y - 50, 100),
        createPlatforms(750, floorPos_y - 90, 100),
        createPlatforms(900, floorPos_y - 130, 100),
        createPlatforms(1050, floorPos_y - 90, 100),
        createPlatforms(1200, floorPos_y - 90, 100),
        createPlatforms(1850, floorPos_y - 60, 100),
        createPlatforms(2000, floorPos_y - 105, 100),
        createPlatforms(2150, floorPos_y - 150, 100),
        createPlatforms(3050, floorPos_y - 50, 100),
        createPlatforms(3200, floorPos_y - 95, 100),
        createPlatforms(3350, floorPos_y - 140, 100),
    ];

    //Enemies
    enemies = [
        new Enemy(40, floorPos_y - 20, 50, false),
        new Enemy(750, floorPos_y - 20, 200, false),
        new Enemy(1150, floorPos_y - 20, 150, false),
        new Enemy(1900, floorPos_y - 20, 200, false),
        new Enemy(3300, floorPos_y - 20, 200, false)
    ];
}


function draw()
{
    // fill the sky blue
    background(100, 155, 255);

    //Background music
    backgroundsoundplayed = backgroundsound.isLoaded();
    if(backgroundsoundplayed == true)
    {
        backgroundsound.playMode('untilDone');
        backgroundsound.loop();
    }

    if(isPlummeting == true || flagpole.isReached == true)
    {
        backgroundsound.stop();
    }

    // draw some green ground
    noStroke();
    fill(0,155,0);
    rect(0, floorPos_y, width, height/4);

    //Move the screen
    push();
    translate(scrollPos, 0);

    // Draw clouds.
    drawclouds();

    // Draw canyons.
    for(var i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
        if(isPlummeting == true)
        {
            if(gameChar_y <= floorPos_y)
            {

            }
            else
            {
                gameChar_y += 1;
                isLeft = false;
                isRight = false;
                if(lives > 0)
                {
                    fallingsound.playMode('untilDone');
                    fallingsound.play();
                }
            }

        }
    }

    // Draw mountains.
    drawmountains();

    // Draw trees.
    drawtrees();

    //Draw platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }

    // Draw collectable items.
    for(var i = 0; i < collectable.length; i++)
    {
        if(collectable[i].isFound == false)
        {
            drawCollectable(collectable[i]);
            checkCollectable(collectable[i]);
        }
    }

    //Flagpole
    renderFlagpole();

    //Draw enemies
    for(var i = 0; i < enemies.length; i++)
    {
        if(enemies[i].dead == false)
        {
            enemies[i].draw();
            var death = enemies[i].checkContact(gameChar_world_x, gameChar_y);
            if(death == true)
            {
                if(lives > 0)
                {
                    lives -= 1;
                    if(lives != 0)
                    {
                        startGame();
                    }
                    fallingsound.playMode('untilDone')
                    fallingsound.play();
                    break;
                }
            }
        }
    }

    //Move the screen
    pop();

    // Draw game character.
    drawGameChar();

    //Score counter
    fill(0);
    noStroke;
    textSize(20);
    text("Score: " + game_score, 20, 20);
    text("Lives:", 20, 90);

    //Check if player died
    checkPlayerDie();

    //Draw lives
    for(var i = 0; i < lives; i++)
    {
        var xpos = 100 + 50 * i;
        var ypos = 90;
        stroke(0);
        strokeWeight(1);
        fill(255, 105, 180);
        //body
        ellipseMode(CENTER);
        ellipse(xpos, ypos, 40);
        //Eyes
        fill(0, 0, 139);
        ellipseMode(CENTER);
        ellipse(xpos - 5,
            ypos - 5,
            5,
            10);
        ellipse(xpos + 5,
            ypos - 5,
            5,
            10);
        fill(255);
        ellipse(xpos - 5,
            ypos - 7,
            3,
            6);
        ellipse(xpos + 5,
            ypos - 7,
            3,
            6);
        //Mouth
        fill(255, 60, 60);
        ellipse(xpos,
            ypos + 10,
            5);
        noFill();
        noStroke();
    }

    //Ending screen
    if(lives < 1)
    {
        textSize(50);
        noStroke();
        text("Game Over", width/2 - 70, height/2);
        textSize(20);
        text("Press space to continue",
            width/2 - 50,
            height/2 + 40);
        gameoversound.playMode('untilDone');
        gameoversound.play();
        return;
    }

    else if(flagpole.isReached == true)
    {
        textSize(50);
        noStroke();
        fill(0);
        text("Level Complete", width/2 - 100, height/2);
        textSize(20);
        text("Press space to continue",
            width/2 - 50,
            height/2 + 40);
        winsound.playMode('untilDone');
        winsound.play();
        return;
    }

    // Logic to make the game character move or the background scroll.
    if(isLeft)
    {
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 5;
        }
        else
        {
            scrollPos += 5;
        }
    }

    if(isRight)
    {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 5;
        }
        else
        {
            // negative for moving against the background
            scrollPos -= 5;
        }
    }

    // Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var contact = false;

        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkcontact(gameChar_world_x, gameChar_y) == true)
            {
                contact = true;
                break;
            }
        }
        if(contact == false)
        {
            gameChar_y += 2;
            isFalling = true;
        }
        else
        {
            isFalling = false;
        }
    }
    else
    {
        isFalling = false;
    }

    //Check if flagpole is reached
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }

    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if(flagpole.isReached == false && lives > 0)
    {
        if(key == 'A' || keyCode == 37)
        {
            console.log("left");
            isLeft = true;
        }

        if(key == 'D' || keyCode == 39)
        {
            console.log("right");
            isRight = true;
        }


        if(key == 'S' || keyCode == 40)
        {
            for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkcontact(gameChar_world_x, gameChar_y))
                {
                    gameChar_y += 1;
                    isFalling = true;
                    break;
                }
            }
        }

        //SPACE BAR
        if(keyCode == 32 || key == "W" || keyCode == 38)
        {
            console.log("up");
            var con = false;
            for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkcontact(gameChar_world_x, gameChar_y))
                {
                    con = true;
                    break;
                }
            }
            if(gameChar_y < floorPos_y && con == false)
            {
            }
            else if(gameChar_y > floorPos_y && gameChar_y != floorPos_y + 1)
            {
            }
            else if(gameChar_y == floorPos_y || gameChar_y == floorPos_y + 1)
            {
                gameChar_y = floorPos_y;
                gameChar_y -= 80;
                jumpSound.play();
            }
            else if (con == true)
            {
                gameChar_y -= 80;
                jumpSound.play();
            }

        }
    }
    else if(lives < 1 || flagpole.isReached == true)
    {
        if(keyCode == 32)
        {
            newgame();
        }
    }
}

function keyReleased()
{

    if(key == 'A' || keyCode == 37)
    {
        isLeft = false;
    }

    if(key == 'D' || keyCode == 39)
    {
        isRight = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
    // draw game character
    if(isLeft && isFalling)
    {
        // add your jumping-left code
        stroke(0);
        strokeWeight(1);
        //ARMS
        ellipseMode(CORNERS);
        fill(255, 105, 180);
        ellipse(gameChar_x + 20,
            gameChar_y - 55,
            gameChar_x,
            gameChar_y - 35);
        //Body
        ellipseMode(CENTER);
        ellipse(gameChar_x,
            gameChar_y - 30,
            40);
        //ARMS
        ellipseMode(CORNERS);
        fill(255, 105, 180);
        ellipse(gameChar_x + 25,
            gameChar_y - 50,
            gameChar_x + 5,
            gameChar_y - 30);
        //Feet
        fill(220, 20, 60);
        ellipseMode(CORNERS);
        ellipse(gameChar_x - 27,
            gameChar_y,
            gameChar_x - 2,
            gameChar_y - 15);
        ellipse(gameChar_x + 25,
            gameChar_y,
            gameChar_x + 10,
            gameChar_y - 20);
        //Eyes
        ellipseMode(CENTER);
        fill(0, 0, 139);
        ellipse(gameChar_x - 5,
            gameChar_y - 35,
            5,
            10);
        ellipse(gameChar_x - 15,
            gameChar_y - 35,
            5,
            10);
        fill(255);
        ellipse(gameChar_x - 5,
            gameChar_y - 37,
            3,
            6);
        ellipse(gameChar_x - 15,
            gameChar_y - 37,
            3,
            6);
        //Mouth
        fill(255, 60, 60);
        ellipse(gameChar_x - 8,
            gameChar_y - 20,
            7);

    }
    else if(isRight && isFalling)
    {
        // add your jumping-right code
        stroke(0);
        strokeWeight(1);
        //ARMS
        ellipseMode(CORNERS);
        fill(255, 105, 180);
        ellipse(gameChar_x - 20,
            gameChar_y - 55,
            gameChar_x,
            gameChar_y - 35);
        //Body
        ellipseMode(CENTER);
        ellipse(gameChar_x,
            gameChar_y - 30,
            40);
        //ARMS
        ellipseMode(CORNERS);
        fill(255, 105, 180);
        ellipse(gameChar_x - 25,
            gameChar_y - 50,
            gameChar_x - 5,
            gameChar_y - 30);
        //Feet
        fill(220, 20, 60);
        ellipseMode(CORNERS);
        ellipse(gameChar_x - 25,
            gameChar_y,
            gameChar_x - 10,
            gameChar_y - 20);
        ellipse(gameChar_x + 27,
            gameChar_y,
            gameChar_x + 2,
            gameChar_y - 15);
        //Eyes
        ellipseMode(CENTER);
        fill(0, 0, 139);
        ellipse(gameChar_x + 5,
            gameChar_y - 35,
            5,
            10);
        ellipse(gameChar_x + 15,
            gameChar_y - 35,
            5,
            10);
        fill(255);
        ellipse(gameChar_x + 5,
            gameChar_y - 37,
            3,
            6);
        ellipse(gameChar_x + 15,
            gameChar_y - 37,
            3,
            6);
        //Mouth
        fill(255, 60, 60);
        ellipse(gameChar_x + 8,
            gameChar_y - 20,
            7);
        noFill();
        noStroke();

    }
    else if(isLeft)
    {
        // add your walking left code
        stroke(0);
        strokeWeight(1);
        //Arms
        ellipseMode(CORNERS);
        fill(255, 105, 180);
        ellipse(gameChar_x - 25,
            gameChar_y - 45,
            gameChar_x - 5,
            gameChar_y - 25);
        ellipse(gameChar_x + 25,
            gameChar_y - 45,
            gameChar_x + 5,
            gameChar_y - 25);
        //Body
        ellipseMode(CENTER);
        ellipse(gameChar_x,
            gameChar_y - 30,
            40);
        //Feet
        fill(220, 20, 60);
        ellipseMode(CORNERS);
        ellipse(gameChar_x - 27,
            gameChar_y,
            gameChar_x - 2,
            gameChar_y - 15);
        ellipse(gameChar_x + 25,
            gameChar_y,
            gameChar_x + 10,
            gameChar_y - 20);
        //Eyes
        ellipseMode(CENTER);
        fill(0, 0, 139);
        ellipse(gameChar_x - 15,
            gameChar_y - 35,
            5,
            10);
        ellipse(gameChar_x - 5,
            gameChar_y - 35,
            5,
            10);
        fill(255);
        ellipse(gameChar_x - 15,
            gameChar_y - 37,
            3,
            6);
        ellipse(gameChar_x - 5,
            gameChar_y - 37,
            3,
            6);
        //Mouth
        fill(255, 60, 60);
        ellipse(gameChar_x - 10,
            gameChar_y - 22,
            5);
        noFill();
        noStroke();

    }
    else if(isRight)
    {
        // add your walking right code
        stroke(0);
        strokeWeight(1);
        //ARMS
        ellipseMode(CORNERS);
        fill(255, 105, 180);
        ellipse(gameChar_x - 25,
            gameChar_y - 45,
            gameChar_x - 5,
            gameChar_y - 25);
        ellipse(gameChar_x + 25,
            gameChar_y - 45,
            gameChar_x + 5,
            gameChar_y - 25);
        //Body
        ellipseMode(CENTER);
        ellipse(gameChar_x,
            gameChar_y - 30,
            40);
        //Feet
        fill(220, 20, 60);
        ellipseMode(CORNERS);
        ellipse(gameChar_x - 25,
            gameChar_y,
            gameChar_x - 10,
            gameChar_y - 20);
        ellipse(gameChar_x + 27,
            gameChar_y,
            gameChar_x + 2,
            gameChar_y - 15);
        //Eyes
        ellipseMode(CENTER);
        fill(0, 0, 139);
        ellipse(gameChar_x + 5,
            gameChar_y - 35,
            5,
            10);
        ellipse(gameChar_x + 15,
            gameChar_y - 35,
            5,
            10);
        fill(255);
        ellipse(gameChar_x + 5,
            gameChar_y - 37,
            3,
            6);
        ellipse(gameChar_x + 15,
            gameChar_y - 37,
            3,
            6);
        //Mouth
        fill(255, 60, 60);
        ellipse(gameChar_x + 10,
            gameChar_y - 22,
            5);
        noFill();
        noStroke();

    }
    else if(isFalling || isPlummeting)
    {
        // add your jumping facing forwards code
        stroke(0);
        strokeWeight(1);
        //Feet
        fill(220, 20, 60);
        ellipseMode(CORNERS);
        ellipse(gameChar_x - 15,
            gameChar_y,
            gameChar_x - 2,
            gameChar_y - 20);
        //Arms
        fill(255, 105, 180);
        ellipse(gameChar_x - 25,
            gameChar_y - 50,
            gameChar_x - 3,
            gameChar_y - 30);
        ellipse(gameChar_x + 25,
            gameChar_y - 50,
            gameChar_x + 3,
            gameChar_y - 30);
        //Body
        ellipseMode(CENTER);
        ellipse(gameChar_x,
            gameChar_y - 30,
            40);
        //Other feet
        fill(220, 20, 60);
        ellipseMode(CORNERS);
        ellipse(gameChar_x + 15,
            gameChar_y,
            gameChar_x + 4,
            gameChar_y - 20);
        //Eyes
        ellipseMode(CENTER);
        fill(0, 0, 139);
        ellipse(gameChar_x - 5,
            gameChar_y - 35,
            5,
            10);
        ellipse(gameChar_x + 5,
            gameChar_y - 35,
            5,
            10);
        fill(255);
        ellipse(gameChar_x - 5,
            gameChar_y - 37,
            3,
            6);
        ellipse(gameChar_x + 5,
            gameChar_y - 37,
            3,
            6);
        //Mouth
        fill(255, 60, 60);
        ellipse(gameChar_x,
            gameChar_y - 20,
            10);
        noFill();
        noStroke();

    }
    else
    {
        // add your standing front facing code
        stroke(0);
        strokeWeight(1);
        //Arms
        fill(255, 105, 180);
        ellipseMode(CORNERS);
        ellipse(gameChar_x - 25,
            gameChar_y - 40,
            gameChar_x - 5,
            gameChar_y - 20);
        ellipse(gameChar_x + 25,
            gameChar_y - 40,
            gameChar_x + 5,
            gameChar_y - 20);
        //Body
        ellipseMode(CENTER);
        ellipse(gameChar_x,
            gameChar_y - 30,
            40);
        //Feet
        fill(220, 20, 60);
        ellipseMode(CORNERS);
        ellipse(gameChar_x - 20,
            gameChar_y,
            gameChar_x - 5,
            gameChar_y - 15);
        ellipse(gameChar_x + 20,
            gameChar_y,
            gameChar_x + 5,
            gameChar_y - 15);
        //Eyes
        fill(0, 0, 139);
        ellipseMode(CENTER);
        ellipse(gameChar_x - 5,
            gameChar_y - 35,
            5,
            10);
        ellipse(gameChar_x + 5,
            gameChar_y - 35,
            5,
            10);
        fill(255);
        ellipse(gameChar_x - 5,
            gameChar_y - 37,
            3,
            6);
        ellipse(gameChar_x + 5,
            gameChar_y - 37,
            3,
            6);
        //Mouth
        fill(255, 60, 60);
        ellipse(gameChar_x,
            gameChar_y - 20,
            10);
        noFill();
        noStroke();

    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawclouds()
{
    for (var i = 0; i < clouds.length; i++) {
        fill(255, 255, 255);
        ellipse(clouds[i].x - 40,
            clouds[i].y + 10,
            60 * clouds[i].scale);
        ellipse(clouds[i].x - 40,
            clouds[i].y + 30,
            60 * clouds[i].scale);
        ellipse(clouds[i].x,
            clouds[i].y,
            60 * clouds[i].scale);
        ellipse(clouds[i].x,
            clouds[i].y + 40,
            60 * clouds[i].scale);
        ellipse(clouds[i].x + 40,
            clouds[i].y + 5,
            60 * clouds[i].scale);
        ellipse(clouds[i].x + 40,
            clouds[i].y + 35,
            60 * clouds[i].scale);
    }
}

// Function to draw mountains objects.
function drawmountains()
{
    for (var i = 0; i < mountains.length; i++) {
        //Draw Mountain
        fill(105);
        triangle(mountains[i].x,
            mountains[i].y,
            mountains[i].x + 100,
            mountains[i].y - 232,
            mountains[i].x + 200,
            mountains[i].y);
        triangle(mountains[i].x + 100,
            mountains[i].y,
            mountains[i].x + 200,
            mountains[i].y - 282,
            mountains[i].x + 300,
            mountains[i].y);
        triangle(mountains[i].x + 150,
            mountains[i].y,
            mountains[i].x + 250,
            mountains[i].y - 257,
            mountains[i].x + 350,
            mountains[i].y);
        fill(255);
        triangle(mountains[i].x + 100,
            mountains[i].y - 232,
            mountains[i].x + 91,
            mountains[i].y - 212,
            mountains[i].x + 109,
            mountains[i].y - 212);
        triangle(mountains[i].x + 200,
            mountains[i].y - 282,
            mountains[i].x + 193,
            mountains[i].y - 262,
            mountains[i].x + 207,
            mountains[i].y - 262);
        triangle(mountains[i].x + 250,
            mountains[i].y - 257,
            mountains[i].x + 242,
            mountains[i].y - 237,
            mountains[i].x + 258,
            mountains[i].y - 237);
    }
}

// Function to draw trees objects.
function drawtrees()
{
    for (var i = 0; i < trees_x.length; i++) {
        //Leaves
        fill(0, 155, 0);
        ellipse(trees_x[i] + 10,
            treePos_y + 14,
            120);
        ellipse(trees_x[i] - 30,
            treePos_y + 34,
            80);
        ellipse(trees_x[i] + 50,
            treePos_y + 34,
            80);

        //Trunk
        fill(139, 69, 19);
        quad(trees_x[i] - 20,
            treePos_y + 144,
            trees_x[i],
            treePos_y + 44,
            trees_x[i] + 20,
            treePos_y + 44,
            trees_x[i] + 40,
            treePos_y + 144);
        triangle(trees_x[i] - 5,
            treePos_y + 74,
            trees_x[i] + 15,
            treePos_y + 64,
            trees_x[i] - 40,
            treePos_y + 32);
        triangle(trees_x[i] + 5,
            treePos_y + 54,
            trees_x[i] + 20,
            treePos_y + 64,
            trees_x[i] + 70,
            treePos_y + 12);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(160,82,45);
    rect(t_canyon.x_pos + 30,
        432,
        t_canyon.width,
        144,);
    fill(0,155,0);
    rect(t_canyon.x_pos,
        432,
        50,
        144,
        10,
        10,
        0,
        10);
    rect(t_canyon.x_pos + 160,
        432,
        50,
        144,
        10,
        10,
        10,
        0);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos + 65 && gameChar_world_x < t_canyon.x_pos + 145)
    {
        var pcontact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkcontact(gameChar_world_x,gameChar_y) == true)
            {
                pcontact = true;
                break;
            }
        }
        if(pcontact == false)
        {
            gameChar_y += 1;
            if(gameChar_y > floorPos_y)
            {
                isPlummeting = true;
            }
            else
            {
                isPlummeting = false;
            }
        }
        else
        {
            isPlummeting = false;
        }
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(220, 20, 60);
    strokeWeight(1);
    stroke(0);
    triangle(t_collectable.x_pos - 10,
        t_collectable.y_pos - 40,
        t_collectable.x_pos - 20,
        t_collectable.y_pos - 30,
        t_collectable.x_pos - 10,
        t_collectable.y_pos - 30);
    triangle(t_collectable.x_pos - 10,
        t_collectable.y_pos - 30,
        t_collectable.x_pos + 10,
        t_collectable.y_pos - 30,
        t_collectable.x_pos,
        t_collectable.y_pos - 40);
    triangle(t_collectable.x_pos + 10,
        t_collectable.y_pos - 30,
        t_collectable.x_pos + 10,
        t_collectable.y_pos - 40,
        t_collectable.x_pos + 20,
        t_collectable.y_pos - 30);
    triangle(t_collectable.x_pos - 10,
        t_collectable.y_pos - 40,
        t_collectable.x_pos,
        t_collectable.y_pos - 40,
        t_collectable.x_pos - 10,
        t_collectable.y_pos - 30);
    triangle(t_collectable.x_pos,
        t_collectable.y_pos - 40,
        t_collectable.x_pos + 10,
        t_collectable.y_pos - 40,
        t_collectable.x_pos + 10,
        t_collectable.y_pos - 30);
    triangle(t_collectable.x_pos - 10,
        t_collectable.y_pos - 30,
        t_collectable.x_pos + 10,
        t_collectable.y_pos - 30,
        t_collectable.x_pos,
        t_collectable.y_pos);
    triangle(t_collectable.x_pos - 20,
        t_collectable.y_pos - 30,
        t_collectable.x_pos - 10,
        t_collectable.y_pos - 30,
        t_collectable.x_pos,
        t_collectable.y_pos);
    triangle(t_collectable.x_pos + 10,
        t_collectable.y_pos - 30,
        t_collectable.x_pos + 20,
        t_collectable.y_pos - 30,
        t_collectable.x_pos,
        t_collectable.y_pos);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 45)
    {
        t_collectable.isFound = true;
        game_score += 10;
        itemsound.play();
    }
}

// Function to render flagpole

function renderFlagpole()
{
    push();
    strokeWeight(6);
    stroke(200);
    line(flagpole.x_pos,
        floorPos_y,
        flagpole.x_pos,
        floorPos_y - 250);
    noStroke();
    fill(0);
    if(flagpole.isReached)
    {
        triangle(flagpole.x_pos,
            floorPos_y - 250,
            flagpole.x_pos,
            floorPos_y - 200,
            flagpole.x_pos + 50,
            floorPos_y - 225);
    }
    else
    {
        triangle(flagpole.x_pos,
            floorPos_y - 50,
            flagpole.x_pos,
            floorPos_y,
            flagpole.x_pos + 50,
            floorPos_y - 25);
    }
    pop();
}

// Function to check flagpole
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15)
    {
        flagpole.isReached = true;
    }
}

// Function to check whether player dies
function checkPlayerDie()
{
    if(gameChar_y > height)
    {
        lives -= 1;
        if(lives > 0)
        {
            startGame();
        }

    }
}

// Function to start game
function startGame()
{
    gameChar_x = width/2;
    gameChar_y = floorPos_y;

    // Variable to control the background scrolling.
    scrollPos = 0;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.
    //trees
    trees_x = [250, 425, 690, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900];
    treePos_y = height / 2;

    //clouds
    clouds = [
        {x: 200, y: random(40,90), scale: 1.0},
        {x: 550, y: random(40,90), scale: 1.0},
        {x: 900, y: random(40,90), scale: 1.0},
        {x: 1250, y: random(40,90), scale: 1.0},
        {x: 1600, y: random(40,90), scale: 1.0},
        {x: 1950, y: random(40,90), scale: 1.0},
        {x: 2300, y: random(40,90), scale: 1.0},
        {x: 2600, y: random(40,90), scale: 1.0},
        {x: 3000, y: random(40,90), scale: 1.0},
        {x: 3300, y: random(40,90), scale: 1.0},
        {x: 3600, y: random(40,90), scale: 1.0},
        {x: 4000, y: random(40,90), scale: 1.0},
    ];

    //mountains
    mountains = [
        {x:50, y:432},
        {x:350, y:432},
        {x:750, y:432},
        {x:1200, y:432},
        {x:1800, y:432},
        {x:2400, y:432},
        {x:3000, y:432},
        {x:3600, y:432},
    ];

    //canyon
    canyon = [
        {x_pos: 50, width: 140},
        {x_pos: 500, width: 140},
        {x_pos: 950, width: 140},
        {x_pos: 1300, width: 140},
        {x_pos: 1700, width: 140},
        {x_pos: 2200, width: 140},
        {x_pos: 2600, width: 140},
        {x_pos: 2800, width: 140},
        {x_pos: 3100, width: 140},
        {x_pos: 3500, width: 140},
        {x_pos: 3750, width: 140},
    ];


    //collectable
    collectable = [
        {x_pos: 200, y_pos: floorPos_y - 50, isFound: false},
        {x_pos: 400, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 800, y_pos: floorPos_y - 100, isFound: false},
        {x_pos: 950, y_pos: floorPos_y - 140, isFound: false},
        {x_pos: 1250, y_pos: floorPos_y - 100, isFound: false},
        {x_pos: 1400, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 1800, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 2200, y_pos: floorPos_y - 160, isFound: false},
        {x_pos: 2500, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 2800, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 3000, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 3400, y_pos: floorPos_y - 150, isFound: false},
        {x_pos: 3850, y_pos: floorPos_y - 20, isFound: false},
    ];

    //Initialise game score
    game_score = 0;

    //Initialise flagpole
    flagpole = {x_pos: 4000, isReached: false };

    //Background music
    backgroundsoundplayed = false;

    //Initialise platforms
    platforms = [
        createPlatforms(200, floorPos_y - 40, 100),
        createPlatforms(600, floorPos_y - 50, 100),
        createPlatforms(750, floorPos_y - 90, 100),
        createPlatforms(900, floorPos_y - 130, 100),
        createPlatforms(1050, floorPos_y - 90, 100),
        createPlatforms(1200, floorPos_y - 90, 100),
        createPlatforms(1850, floorPos_y - 60, 100),
        createPlatforms(2000, floorPos_y - 105, 100),
        createPlatforms(2150, floorPos_y - 150, 100),
        createPlatforms(3050, floorPos_y - 50, 100),
        createPlatforms(3200, floorPos_y - 95, 100),
        createPlatforms(3350, floorPos_y - 140, 100),
    ];

    //Enemies
    enemies = [
        new Enemy(40, floorPos_y - 20, 50, false),
        new Enemy(750, floorPos_y - 20, 200, false),
        new Enemy(1150, floorPos_y - 20, 150, false),
        new Enemy(1900, floorPos_y - 20, 200, false),
        new Enemy(3300, floorPos_y - 20, 200, false)
    ];
}

//New game after no more lives
function newgame()
{
    gameChar_x = width/2;
    gameChar_y = floorPos_y;

    // Variable to control the background scrolling.
    scrollPos = 0;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.
    //trees
    trees_x = [250, 425, 690, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900];
    treePos_y = height / 2;

    //clouds
    clouds = [
        {x: 200, y: random(40,90), scale: 1.0},
        {x: 550, y: random(40,90), scale: 1.0},
        {x: 900, y: random(40,90), scale: 1.0},
        {x: 1250, y: random(40,90), scale: 1.0},
        {x: 1600, y: random(40,90), scale: 1.0},
        {x: 1950, y: random(40,90), scale: 1.0},
        {x: 2300, y: random(40,90), scale: 1.0},
        {x: 2600, y: random(40,90), scale: 1.0},
        {x: 3000, y: random(40,90), scale: 1.0},
        {x: 3300, y: random(40,90), scale: 1.0},
        {x: 3600, y: random(40,90), scale: 1.0},
        {x: 4000, y: random(40,90), scale: 1.0},
    ];

    //mountains
    mountains = [
        {x:50, y:432},
        {x:350, y:432},
        {x:750, y:432},
        {x:1200, y:432},
        {x:1800, y:432},
        {x:2400, y:432},
        {x:3000, y:432},
        {x:3600, y:432},
    ];

    //canyon
    canyon = [
        {x_pos: 50, width: 140},
        {x_pos: 500, width: 140},
        {x_pos: 950, width: 140},
        {x_pos: 1300, width: 140},
        {x_pos: 1700, width: 140},
        {x_pos: 2200, width: 140},
        {x_pos: 2600, width: 140},
        {x_pos: 2800, width: 140},
        {x_pos: 3100, width: 140},
        {x_pos: 3500, width: 140},
        {x_pos: 3750, width: 140},
    ];


    //collectable
    collectable = [
        {x_pos: 200, y_pos: floorPos_y - 50, isFound: false},
        {x_pos: 400, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 800, y_pos: floorPos_y - 100, isFound: false},
        {x_pos: 950, y_pos: floorPos_y - 140, isFound: false},
        {x_pos: 1250, y_pos: floorPos_y - 100, isFound: false},
        {x_pos: 1400, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 1800, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 2200, y_pos: floorPos_y - 160, isFound: false},
        {x_pos: 2500, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 2800, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 3000, y_pos: floorPos_y - 20, isFound: false},
        {x_pos: 3400, y_pos: floorPos_y - 150, isFound: false},
        {x_pos: 3850, y_pos: floorPos_y - 20, isFound: false},
    ];

    //Initialise game score
    game_score = 0;

    //Initialise flagpole
    flagpole = {x_pos: 4000, isReached: false };

    //Lives
    lives = 3;

    //Background music
    backgroundsoundplayed = false;

    //Initialise platforms
    platforms = [
        createPlatforms(200, floorPos_y - 40, 100),
        createPlatforms(600, floorPos_y - 50, 100),
        createPlatforms(750, floorPos_y - 90, 100),
        createPlatforms(900, floorPos_y - 130, 100),
        createPlatforms(1050, floorPos_y - 90, 100),
        createPlatforms(1200, floorPos_y - 90, 100),
        createPlatforms(1850, floorPos_y - 60, 100),
        createPlatforms(2000, floorPos_y - 105, 100),
        createPlatforms(2150, floorPos_y - 150, 100),
        createPlatforms(3050, floorPos_y - 50, 100),
        createPlatforms(3200, floorPos_y - 95, 100),
        createPlatforms(3350, floorPos_y - 140, 100),
    ];

    //Enemies
    enemies = [
        new Enemy(40, floorPos_y - 20, 50, false),
        new Enemy(750, floorPos_y - 20, 200, false),
        new Enemy(1150, floorPos_y - 20, 150, false),
        new Enemy(1900, floorPos_y - 20, 200, false),
        new Enemy(3300, floorPos_y - 20, 200, false)
    ];
}

//Function to create platforms
function createPlatforms(x, y, length)
{
    var platform =
        {
            x: x,
            y: y,
            length: length,
            draw: function()
            {
                stroke(0);
                fill(255, 215, 0);
                rect(this.x, this.y, this.length, 10, 5, 5, 5, 5);
            },
            checkcontact: function(cX, cY)
            {
                if(cX > this.x && cX < this.x + this.length)
                {
                    var d = this.y - cY;
                    if(d >= 0 && d < 2)
                    {
                        return true;
                    }
                }
                return false;
            }
        };
    return platform;
}

//Function to create enemies
function Enemy(x, y, range, dead)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentx = x;
    this.inc = 1;
    this.dead = dead;
    this.update = function()
    {
        this.currentx += this.inc;
        if(flagpole.isReached == true || lives < 1)
        {
            this.inc = 0;
        }
        else if(this.currentx >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if(this.currentx < this.x)
        {
            this.inc = 1;
        }
    }
    this.draw = function()
    {
        this.update();
        //draw the enemies
        //Head
        stroke(0);
        fill(100);
        rect(this.currentx - 20,
             this.y - 20,
             40,
             40,
             5,
             5,
             5,
             5);
        //Eyes
        fill(255);
        noStroke();
        ellipse(this.currentx - 8, this.y - 8, 10);
        ellipse(this.currentx + 8, this.y - 8, 10);
        fill(0);
        ellipse(this.currentx - 8, this.y - 8, 5);
        ellipse(this.currentx + 8, this.y - 8, 5);
        //Eyebrows
        fill(0);
        noStroke();
        beginShape();
        vertex(this.currentx - 15, this.y - 20);
        vertex(this.currentx - 5, this.y - 15);
        vertex(this.currentx - 5, this.y - 10);
        vertex(this.currentx - 15, this.y - 15);
        endShape(CLOSE);
        beginShape();
        vertex(this.currentx + 15, this.y - 20);
        vertex(this.currentx + 5, this.y - 15);
        vertex(this.currentx + 5, this.y - 10);
        vertex(this.currentx + 15, this.y - 15);
        endShape(CLOSE);
        //Mouth
        stroke(0);
        fill(255);
        rect(this.currentx - 10, this.y + 5, 20, 10);
        rect(this.currentx - 10, this.y + 5, 5, 5);
        rect(this.currentx - 10, this.y + 10, 5, 5);
        rect(this.currentx - 5, this.y + 5, 5, 5);
        rect(this.currentx - 5, this.y + 10, 5, 5);
        rect(this.currentx, this.y + 5, 5, 5);
        rect(this.currentx, this.y + 10, 5, 5);
        rect(this.currentx + 5, this.y + 5, 5, 5);
        rect(this.currentx + 5, this.y + 10, 5, 5);
    }
    this.checkContact = function(gamex, gamey)
    {
        var d = dist(gamex, gamey, this.currentx, this.y);
        if(gamey > this.y - 30 && gamex > this.currentx - 25 && gamex < this.currentx + 25 && gamey <= this.y - 20)
        {
            this.dead = true;
            game_score += 10;
            enemysound.playMode('untilDone');
            enemysound.play();
        }
        else if(gamey == floorPos_y && gamex < this.currentx + 45 && gamex > this.currentx - 45)
        {
            return true;
        }
        else if(d < 30)
        {
            return true;
        }
        return false;
    }
}