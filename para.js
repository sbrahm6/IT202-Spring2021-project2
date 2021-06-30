let frames = 0;
let charSpeed = 0;
let dogSpeed = 0;
let rand;
let difficulty = 2;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


let i = 1;

// Character Sprite Actions
let idle = '/sprites/png/idle/Idle (';
let walk = '/sprites/png/walk/Walk (';
let jump = '/sprites/png/jump/Jump (';
let run = '/sprites/png/run/Run (';
let dead = '/sprites/png/dead/Dead (';

let doggo = "/sprites/dog/Shepherd_run_";
let coin = "/sprites/coin/goldCoin";

let action = walk;
let velocity = 0;

function controls(event) {

    if (event.key == "ArrowRight" && action == walk) {
        // console.log("ArrowRight key was pressed!");
        action = run;
        velocity = 3;

    } else if (event.key == "ArrowLeft" && action != jump) {
        // console.log("ArrowLeft key was pressed!");
        action = walk;
        velocity = -3;
    } else if (event.key == "ArrowUp" && action != jump) {
        // console.log("ArrowUp key was pressed!");
        i = 1;
        action = jump;
    } else if (event.key == "k" && action != dead) {
        action = dead;
        i = 1;
    }
}

function keyup_controls(event) {

    if (event.key == "ArrowRight" && action != jump) {
        action = walk;
        velocity = 0;
    } else if (event.key == "ArrowLeft") {
        velocity = 0;
    }
}


class ScrollingSprite {
    constructor(image, x, y, width, height, speed) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    scroll() {
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = this.width - 1;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class CharacterSprite {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class objectSprite {
    constructor(image, x, y, width, height, dx) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
    }

    scroll() {
        this.x -= this.dx;
        if (this.x <= 0) {
            this.x = getRandomInt(750, 2600)
        }
    }

    draw(ctx) {
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, 40, 0, Math.PI * 2);
        // ctx.fillStyle = "#0095DD";
        // ctx.fill();
        // ctx.closePath();

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    }
}

window.onload = () => {

    const canvas = document.getElementById("render-canvas");
    const ctx = canvas.getContext('2d');

    const backgroundImage = new Image();
    backgroundImage.src = '/sprites/seaview/seaview_sky.png';
    backgroundImage.position = { x: 0, y: 0 }

    const backgroundSprite = new ScrollingSprite(backgroundImage, 0, 0, canvas.width, canvas.height, 0);
    const backgroundSprite2 = new ScrollingSprite(backgroundImage, -canvas.width, 0, canvas.width, canvas.height, 0);

    const backgroundCloudsImage = new Image();
    backgroundCloudsImage.src = '/sprites/seaview/seaview_clouds.png';

    const cloudSprite = new ScrollingSprite(backgroundCloudsImage, 0, 0, canvas.width, canvas.height, .5);
    const cloudSprite2 = new ScrollingSprite(backgroundCloudsImage, -canvas.width, 0, canvas.width, canvas.height, 1);

    const seaImage = new Image();
    seaImage.src = '/sprites/seaview/seaview_sea.png';

    const middleSprite = new ScrollingSprite(seaImage, 0, 0, canvas.width, canvas.height, 1);
    const middleSprite2 = new ScrollingSprite(seaImage, -canvas.width, 0, canvas.width, canvas.height, 1);

    const foregroundImage = new Image();
    foregroundImage.src = '/sprites/seaview/seaview_foreground_empty.png';

    const foregroundSprite = new ScrollingSprite(foregroundImage, 0, 0, canvas.width, canvas.height, 2);
    const foregroundSprite2 = new ScrollingSprite(foregroundImage, -canvas.width, 0, canvas.width, canvas.height, 2);

    const dogImage = new Image();
    const coinImage = new Image();
    const charImage = new Image();

    const spriteArray = [
        backgroundSprite,
        backgroundSprite2,
        cloudSprite,
        cloudSprite2,
        middleSprite,
        middleSprite2,
        foregroundSprite,
        foregroundSprite2
    ];

    // INITIAL SPRITE POSITIONING
    let x = 100;
    let y = 200;
    let dogX = 1600;


    // Draw loop
    const render = () => {
        frames += 1; // FRAME COUNTER
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        spriteArray.forEach(sprite => {
            sprite.scroll();
            sprite.draw(ctx);
        });

        if (frames % 4 == 0) {

            // Character Movement Controls using event listeners
            // ------------------------------------------------------------------------
            document.addEventListener("keydown", controls);
            document.addEventListener("keyup", keyup_controls);
            // ------------------------------------------------------------------------

            // Setting the boundaries of character movement to edges of game window
            if (x < 0) {
                velocity = 0; x = 0;
            }
            else if (x > 700) {
                velocity = 0; x = 700;
            }

            // jumping arc action formula
            if (action == jump) {
                y = 4 * (i * i) - (60 * i) + 200; //equation derived through testing (parabola equation)
                action = (i == 15) ? walk : jump;
                velocity = (action == walk) ? 0 : velocity;
            }

            // Prevents accidental disruption of the death animation
            if (action == dead) {
                document.removeEventListener("keydown", controls);
                if (i == 15) {
                    alert('YOU ARE DEAD!!');
                    i = 1;
                    action = walk;
                    x = 100;
                }
            }

            // Cycles through set of 15 character sprite animation "frames" 
            i = i % 15 + 1;
        }

        // Dynamic frame cycling for sprite animations
        charImage.src = action + i + ').png';
        dogImage.src = doggo + (i % 5 + 1) + '.png';
        coinImage.src = coin + (i % 9 + 1) + '.png';

        // SET THE DIFFICULTY TO SCALE WITH TIME (EVERY 600 FRAMES)
        x += velocity;
        if (frames % 600 == 0) difficulty++;
        if (i == 1) rand = getRandomInt(difficulty, difficulty + 5);

        // INITIALIZE SPRITE OBJECT PROPERTIES: (IMG SOURCE, LOCATION, SIZE, SPEED)
        charSprite = new CharacterSprite(charImage, x, y, 307, 282, charSpeed);
        dogSprite = new objectSprite(dogImage, dogX, 360, 130, 81, rand);
        coinSprite = new objectSprite(coinImage, 300, 100, 32, 32, 1);


        // SIMULATES COLLISON(OVERLAP) BETWEEN SPRITE OBJECTS AND TRIGGERS DEATH ANIMATION
        if (x >= dogX - 70 && x <= dogX + 60 && action != jump && action != dead) {
            i = 1;
            action = dead;
        }

        // DRAW CANVAS FUNCTION FOR CURRENT FRAME
        charSprite.draw(ctx);
        dogSprite.scroll();
        dogX = dogSprite.x;
        dogSprite.draw(ctx);
        coinSprite.draw(ctx);
        coinSprite.scroll();

        window.requestAnimationFrame(render);
    }
    render();
}