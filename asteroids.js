/****************************************
        
CONSTANTS! USE THIS TO MODIFY THE GAME

****************************************/

const FPS = 30; //Frames per Second 
//Ship
const SHIP_SIZE = 30 //Ship Size in Pixels
const SHIP_THRUST = 5;
const SHIP_INV_DUR = 3; //Durations of ships invisibility in seconds
const SHIP_BLINK_DUR = 0.1; //Durations of ships blink during invisibility in seconds
const TURN_SPEED =  360; //Turn Speed in Degrees per Second
const FRICTION = 0.8; //Between 0 and 1, Determines Friction
//Asteroids
const ROIDS_NUM = 12; //Starting number of asteroids
const ROIDS_SIZE = 100; //Starting size of asteroids in pixels
const ROIDS_SPEED = 50; //Max starting speed of asteriods in pixels per second
const ROIDS_VERT = 10; //Average number of sides on each asteroid
const ROIDS_JAG = 0.2; //Jagged edges of asteroids (0 = 1, 1 = Lots)
//Stars
const STAR_SIZE = 0.5; //Star size
const STAR_AMOUNT = 1000; //How many stars on background
const STAR_RADIUS = 2; //How big the stars are
//Collison
const SHOW_CENTRE_DOT = false; 
const SHOW_BOUNDING = false;
const SHIP_EXPLODE_DUR = 0.5; //Duration of ships explosion


//Get canvas * context
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

setInterval(update, 1000 / FPS);


//Ship Object
var ship = newShip();

//Event Handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(event) {
    switch(event.keyCode) {
        case 37: //Left Arrow (Rotate Left)
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
            break;
        case 38: //Up Arrow (Thrust Forward)
            ship.thrusting = true;
            break;
        case 39: //Right Arrow (Rotate Right)
            ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
            break;
    }
}

function keyUp(event) {
    switch(event.keyCode) {
        case 37: //Left Arrow (STOP Rotating Left)
            ship.rot = 0;
            break;
        case 38: //Up Arrow (STOP Thrust Forward)
            ship.thrusting = false;
            break;
        case 39: //Right Arrow (STOP Rotate Right)
            ship.rot = 0;
            break;
    }
}

/*

Stars

*/
var stars = [];

createStars();

function createStars() {
    stars = [];
    var x, y;
    for(let i = 0; i < STAR_AMOUNT; i++) {
        x = Math.floor(Math.random() * canvas.width);
        y = Math.floor(Math.random() * canvas.height);
        stars.push(newStar(x, y));
    }
}

function newStar(x, y) {
    var star = {
        x: x,
        y: y,
        r: Math.random() * STAR_RADIUS / 2,
        a: Math.random() * Math.PI,
        o: Math.round(Math.random() * 10) / 10
    };
    return star;
}

/*

Asteroids

*/
//Set up Asteroids
var roids = [];
createAsteroids();

function createAsteroids() {
    roids = [];
    var x, y;
    for(let i = 0; i < ROIDS_NUM; i++) {
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE  * 2 + ship.r);
        roids.push(newAsteroid(x, y));
    }
}

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function explodeShip() {
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);

}

function newAsteroid(x, y) {
    var roid = {
        x: x,
        y: y,
        xv: Math.random() * ROIDS_SPEED / FPS * (Math.random < 0.5 ? 1 : -1),
        yv: Math.random() * ROIDS_SPEED / FPS * (Math.random < 0.5 ? 1 : -1),
        r: ROIDS_SIZE / 2,
        a: Math.random() * Math.PI * 2,
        vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
        offset: []
    };

    //Create vertex offset array
    for (let i = 0; i < roid.vert; i++) {
        roid.offset.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG)
    }
    return roid;
}

function newShip() {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: SHIP_SIZE / 2,
        a: 90 / 180 * Math.PI, //Convert to radians
        blinkNum: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),
        blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
        explodeTime: 0,
        rot: 0,
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        }
    }
}

function update() {
    var blinkOn = ship.blinkNum % 2 == 0;
    var exploding = ship.explodeTime > 0; 

    //Draw Background
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Thrust Ship
    if (ship.thrusting) {
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;

        if(!exploding &&  blinkOn) {
        //Draw Thrust
        context.fillStyle = "yellow";
        context.strokeStyle = "orange";
        context.lineWidth = SHIP_SIZE / 12;
        context.beginPath();

        context.moveTo( //Rear Left
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
        );
        context.lineTo( //Rear Centre
            ship.x - ship.r * 5 / 3 * Math.cos(ship.a),
            ship.y + ship.r * 5 / 3 * Math.sin(ship.a)
        );
        context.lineTo( //Rear right of ship
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
        );
        context.closePath();
        context.fill();
        context.stroke();
        }

    } else {
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
    }

    //Draw Stars
    context.fillStyle = "white";
    for (let i = 0; i < stars.length; i++) {
        var x, y, r, a;
        x = stars[i].x;
        y = stars[i].y;
        r = stars[i].r;
        a = stars[i].a;
        o = stars[i].o;
        context.globalAlpha = o;
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
    }
    context.globalAlpha = 1;

    /****************************************
        
    Draw Asteroids

    ****************************************/
    context.lineWidth = SHIP_SIZE / 20;

    for (let i = 0; i < roids.length; i++) {
        context.strokeStyle = "slategrey";
        var x, y, r, a, vert, offset;
        //Get Properties
        x = roids[i].x;
        y = roids[i].y;
        r = roids[i].r;
        a = roids[i].a;
        vert = roids[i].vert;
        offset = roids[i].offset;

        //Draw Path
        context.beginPath();
        context.moveTo(
            x + r * offset[0] * Math.cos(a),
            y + r * offset[0] * Math.sin(a)
        );

        //Draw Polygon
        for (let k = 1; k < vert; k++) {
            context.lineTo(
                x + r * offset[k] * Math.cos(a + k * Math.PI * 2 / vert),
                y + r * offset[k] * Math.sin(a + k * Math.PI * 2 / vert)
            );
        }
        context.closePath();
        context.stroke();
        context.fillStyle = "black";
        context.fill();

        if(SHOW_BOUNDING) {
            context.strokeStyle="lime";
            context.beginPath();
            context.arc(x, y, r, 0, Math.PI * 2, false);
            context.stroke();
        }

    }

    /****************************************
        
    Draw Ship

    ****************************************/
    if (!exploding) {
        if (blinkOn) {
            context.strokeStyle = "white";
            context.lineWidth = SHIP_SIZE / 20;
            context.beginPath();
            context.moveTo( // nose of the ship
                ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
                ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
            );
            context.lineTo( // rear left
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
            );
            context.lineTo( // rear right
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
            );
            context.closePath();
            context.stroke();
            context.fillStyle = "black";
            context.fill();
        }
        //Handle Blinking
        if(ship.blinkNum > 0) {
            //Reduce Blink Time
            ship.blinkTime--;
            //Reduce Blink Num
            if (ship.blinkTime == 0) {
                ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                ship.blinkNum--;
            }
        }
    } else {
        //Draw Explosion
        context.fillStyle="darkred";
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle="red";
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle="orange";
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle="yellow";
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle="white";
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
        context.fill();
    }


    /****************************************
        
    Collison Control

    ****************************************/
    if(SHOW_BOUNDING) {
        context.strokeStyle="lime";
        context.beginPath();
        context.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
        context.stroke();
    }

    if(!exploding) {
        //Check for Collisions
        if(ship.blinkNum == 0) {
            for (let i = 0; i < roids.length; i++) {
                if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
                    explodeShip();
                }
            }
        }

        //Move Ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;

        //Rotate Ship
        ship.a += ship.rot;

    } else {
        ship.explodeTime--;

        if (ship.explodeTime ==  0) {
            ship = newShip();
        }
    }

    //Handle edge of screen
    if (ship.x < 0 - ship.r) {
        ship.x = canvas.width + ship.r;
    } else if (ship.x > canvas.width + ship.r) {
        ship.x = 0 - ship.r;
    }
    if (ship.y < 0 - ship.r) {
        ship.y = canvas.height + ship.r;
    } else if (ship.y > canvas.height + ship.r) {
        ship.y = 0 - ship.r;
    }

    //Move Asteroid
    for (let i = 0; i < roids.length; i++) {
        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].yv;

        //Handle Edge of Screen
        if (roids[i].x < 0 - roids[i].r) {
            roids[i].x = canvas.width + roids[i].r;
        } else if (roids[i].x > canvas.width + roids[i].r) {
            roids[i].x = 0 - roids[i].r
        }
        if (roids[i].y < 0 - roids[i].r) {
            roids[i].y = canvas.height + roids[i].r;
        } else if (roids[i].y > canvas.height + roids[i].r) {
            roids[i].y = 0 - roids[i].r
        }
    }

}