const FPS = 30; //Frames per Second 
const SHIP_SIZE = 30 //Ship Size in Pixels
const SHIP_THRUST = 5;
const TURN_SPEED =  360; //Turn Speed in Degrees per Second
const FRICTION = 0.8; //Between 0 and 1, Determines Friction
const ROIDS_NUM = 3; //Starting number of asteroids
const ROIDS_SIZE = 100; //Starting size of asteroids in pixels
const ROIDS_SPEED = 50; //Max starting speed of asteriods in pixels per second

var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

setInterval(update, 1000 / FPS);

//Ship Object
var ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI, //Convert to radians
    rot: 0,
    thrusting: false,
    thrust: {
        x: 0,
        y: 0
    }
}

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

//Set up Asteroids
// var roids = [];
// createAsteroids();

// function createAsteroids() {
//     roids = [];
//     for(let i = 0; i < ROIDS_NUM; i++) {
//         x = Math.random() * canvas.width;
//         roids.push(newAsteroid(x, y));
//     }
// }
// function newAsteroid() {
//     var roid = {
//         x: x,
//         y: y,
//         xv: Math.random() * ROIDS_SPEED / FPS * (Math.random < 0.5 ? 1 : -1),
//         yv: Math.random() * ROIDS_SPEED / FPS * (Math.random < 0.5 ? 1 : -1),
//         r: ROIDS_SIZE / 2,
//         a: Math.random() * Math.PI * 2;
//     };
//     return roid;
// }
function update() {
    //Draw Background
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Thrust Ship
    if (ship.thrusting) {
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;

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

    } else {
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
    }
    
    //Draw Ship
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

    //Move Ship
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;

    //Rotate Ship
    ship.a += ship.rot;

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

    //Centre Dot
    //context.fillStyle = "red";
    //context.fillRect(ship.x - 1, ship.y - 1, 2, 2);
}