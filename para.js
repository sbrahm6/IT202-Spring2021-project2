

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
let heart = "/sprites/heart/heart";

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
    constructor(image, x, y, width, height, dx, show) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.show = show;
    }

    scroll(lo, hi) {
        this.x -= this.dx;
        if (this.x <= 0) {
            this.show = true;                   // BUG: coins 2 & 3 never reach set condition 
            this.x = getRandomInt(lo, hi);
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

function component(width, height, color, x, y, type, ctx) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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
    const heartImage = new Image();

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

    // INITIALIZATION OF ESSENTIAL VARS

    let frames = 0;
    let rand;
    let gc_rand;
    let difficulty = 2;
    let lives = 3;

    let x = 100;
    let y = 200;
    let dog_x = 1600;
    let gc_x = 300;
    let score = 0;

    let show1 = true, show2 = true, show3 = true;
    let gc = [];
    let show = [show1, show2, show3];
    let numCoins = 3;
    let spacing = 50;


    // Draw loop
    const render = () => {

        frames += 1; // FRAME COUNTER


        // if (frames > 1) {
        //     for (let c = 0; c < numCoins; c++)
        //         console.log(gc[c].show);
        // }


        // if (frames == 300) alert("STOP");

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
                    lives--;
                    action = walk;
                    i = 1;
                    if (lives <= 0) {
                        alert('\n--->YOU ARE DEAD!!  \n\n--->Press OK to Restart<---');
                        x = 100;
                        lives = 3;
                    }
                }
            }

            // Cycles through set of 15 character sprite animation "frames" 
            i = i % 15 + 1;
        }

        // Animation frame cycling for sprite animations
        charImage.src = action + i + ').png';
        dogImage.src = doggo + (i % 5 + 1) + '.png';
        coinImage.src = coin + (i % 9 + 1) + '.png';
        heartImage.src = heart + '.png';


        // SET THE DIFFICULTY TO SCALE WITH TIME (EVERY 600 FRAMES)
        x += velocity;
        if (frames % 600 == 0) difficulty++;
        if (i == 1) {
            rand = getRandomInt(difficulty, difficulty + 3);
            gc_rand = getRandomInt(difficulty, difficulty + 1);
        }

        // INITIALIZE SPRITE: (image, x, y, width, height)
        boy = new CharacterSprite(charImage, x, y, 307, 282);

        // objectSprite parameters: (image, x, y, width, height, dx)
        dog = new objectSprite(dogImage, dog_x, 360, 130, 81, rand);

        life1 = new objectSprite(heartImage, 16, 16, 32, 32);
        life2 = new objectSprite(heartImage, 48, 16, 32, 32);
        life3 = new objectSprite(heartImage, 80, 16, 32, 32);

        let life = [life1, life2, life3];

        if (frames > 100) {

            // console.log(frames, gc[0].show, 'x:' + x, 'gc[0].x:' + gc[0].x);
            // alert("FRAME halt");
        }

        for (let c = 0; c < numCoins; c++) {
            gc[c] = new objectSprite(coinImage, gc_x, 100, 32, 32, gc_rand, show[c]);
            gc_x += spacing;
        }

        // gc[c] = new objectSprite(coinImage, gc_x, 100, 32, 32, gc_rand, show1);
        // gc[c] = new objectSprite(coinImage, gc_x + 50, 100, 32, 32, gc_rand, show2);
        // gc[c] = new objectSprite(coinImage, gc_x + 100, 100, 32, 32, gc_rand, show3);

        // COIN GENERATION AND COLLECTION
        if (action == jump) {

            for (let c = 0; c < numCoins; c++) {
                if (x <= gc[c].x && x >= gc[c].x - 100 && gc[c].show == true) {
                    gc[c].show = false;
                    score++;
                }

            }

            // if (x <= gc[c].x && x >= gc[c].x - 100) {
            //     gc[c].show = false; score++;
            //     // console.log("gc_x: " + gc_x + "; x: " + x);
            // }
            // if (x <= gc[c].x && x >= gc[c].x - 100) { gc[c].show = false; score++; }
            // if (x <= gc[c].x && x >= gc[c].x - 100) { gc[c].show = false; score++; }
        }

        // COIN SCOREBOARD
        gcScore = new component("30px", "Consolas", "black", 280, 40, "text", ctx);
        gcScore.text = "SCORE: " + score;
        gcScore.update();


        // SIMULATES COLLISON(OVERLAP) BETWEEN SPRITE OBJECTS AND TRIGGERS DEATH ANIMATION
        if (x >= dog_x - 70 && x <= dog_x + 60 && action != jump && action != dead) {
            i = 1;
            action = dead;
        }

        // DRAW CANVAS FUNCTION FOR CURRENT FRAME

        boy.draw(ctx);

        for (let h = 0; h < lives; h++) {
            console.log(lives);
            life[h].draw(ctx);
        }


        dog.scroll(750, 2600);
        dog_x = dog.x;
        dog.draw(ctx);

        for (let c = 0; c < numCoins; c++) {
            gc[c].scroll(750, 800);
            show[c] = gc[c].show;

            if (gc[c].show == true) gc[c].draw(ctx);
        }
        gc_x = gc[0].x;


        // gc[c].scroll(750, 800);
        // gc_x = gc[c].x;
        // show1 = gc[c].show;
        // if (show1) gc[c].draw(ctx);

        // // console.log(show1, gc[c].show);


        // gc[c].scroll(750, 800);
        // show2 = gc[c].show;
        // if (show2) gc[c].draw(ctx);

        // gc[c].scroll(750, 800);
        // show3 = gc[c].show;
        // if (show3) gc[c].draw(ctx);

        window.requestAnimationFrame(render);
    }
    render();
}