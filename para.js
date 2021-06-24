let frames = 0;
let charSpeed = 0;
let dogSpeed = 0;



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
        if (this.x <= -800) {
            this.x = 800 - 1;
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


    const charImage = new Image();

    let i = 1;
    let x = 100;
    let y = 200;
    let dogX = 1600;


    let idle = '/sprites/png/idle/Idle (';
    let walk = '/sprites/png/walk/Walk (';
    let jump = '/sprites/png/jump/Jump (';
    let run = '/sprites/png/run/Run (';
    let dead = '/sprites/png/dead/Dead (';

    let doggo = "/sprites/dog/Shepherd_run_";

    let action = walk;
    let held = false;


    // let charSprite = new CharacterSprite(charImage, 100, 200, 307, 282, 0);

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

    // Draw loop
    const render = () => {
        frames += 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        spriteArray.forEach(sprite => {
            sprite.scroll();
            sprite.draw(ctx);
        });

        if (frames % 4 == 0) {

            if (frames % 300 == 0) {
                document.addEventListener("keydown", (event) => {
                    if (event.key == "ArrowRight") {
                        console.log("ArrowRight key was pressed!");

                        if (!held) {
                            held = true;
                            action = run;
                        }
                        x++;
                        // console.log(x);


                    } else if (event.key == "ArrowLeft") {
                        // console.log("ArrowLeft key was pressed!");
                        action = walk;
                        x -= 1;

                    } else if (event.key == "ArrowUp") {
                        if (!held) {
                            held = true;
                            action = jump;
                            i = 1;

                            // setTimeout(() => {
                            //     action = walk;
                            // }, 72 * (15 - i));  //calculated ~72 ms per animation frame (15 total)
                        }

                    } else if (event.key == "k") {
                        if (!held) {
                            held = true;
                            action = dead;
                            i = 1;
                            setTimeout(() => {
                                action = walk;
                            }, 72 * (15 - i));  //calculated ~72 ms per animation frame (15 total)
                        }
                        // FUNCTION CALL

                    } else {
                        action = walk;
                    }

                });
            }

            if (action == jump) {
                y = 4 * (i * i) - (60 * i) + 200; //equation derived through testing (parabola equation)
                action = (i == 15) ? walk : jump;
                held = (action == walk) ? false : true;
            }

            i = i % 15 + 1;

        }

        document.addEventListener("keyup", (event) => {

            if (event.key == "ArrowRight") {
                action = walk;
                held = false;
                charSpeed = 0;
            }
            else if (event.key == "ArrowUp") {
                if (action != jump) {
                    // held = false;
                    // y = 200;
                }
            } else if (event.key == "k") {
                if (action != dead) held = false;
            }
        });

        // console.log(i);

        charImage.src = action + i + ').png';
        dogImage.src = doggo + (i % 5 + 1) + '.png';

        charSprite = new CharacterSprite(charImage, x, y, 307, 282, charSpeed);
        dogSprite = new objectSprite(dogImage, dogX, 340, 174, 108, 4);

        // console.log(charImage.src)

        charSprite.draw(ctx);
        dogSprite.scroll();
        dogX = dogSprite.x;
        dogSprite.draw(ctx);

        window.requestAnimationFrame(render);
    }
    render();
}