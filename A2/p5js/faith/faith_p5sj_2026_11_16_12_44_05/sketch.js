
let candleImg;
let fireImg;

let candleLoaded = false;
let fireLoaded = false;

let flameX = 150;
let flameY = 430;

let dragging = false;
let candleLit = false;

// Light glow animation
let glowSize = 0;
let glowAlpha = 0;

let whiteAlpha = 0;
let transitionStarted = false;

// Bottom of the wick
let wickX = 360;
let wickY = 535;

function setup() {
    createCanvas(600, 900);
    imageMode(CENTER);

    loadImage("candle.jpg",
        function(img) {
            candleImg = img;
            candleLoaded = true;
        }
    );

    loadImage("fire.png",
        function(img) {
            fireImg = img;
            fireLoaded = true;
        }
    );
}

function draw() {
    background(30);

    // Draw candle photo
    if (candleLoaded) {
        image(candleImg, 300, 450, 600, 900);
    }

    // Draw flame
    if (fireLoaded) {
        image(fireImg, flameX, flameY, 120, 150);
    }
    // Draw soft candle glow
    if (candleLit) {
        glowSize = min(glowSize + 1.5, 500);
        glowAlpha = min(glowAlpha + 0.4, 25);

        noStroke();

        fill(255, 190, 100, glowAlpha * 0.25);
        circle(wickX, wickY - 80, glowSize);

        fill(255, 190, 100, glowAlpha * 0.4);
        circle(wickX, wickY - 80, glowSize * 0.65);

        fill(255, 210, 130, glowAlpha * 0.6);
        circle(wickX, wickY - 80, glowSize * 0.3);
}

    // Check whether the flame touches the wick
    if (dragging && !candleLit) {
        let flameBottomX = flameX;
        let flameBottomY = flameY + 56.5;

        let d = dist(flameBottomX, flameBottomY, wickX, wickY);

        if (d < 35) {
            candleLit = true;
            dragging = false;

            // Snap the flame onto the wick
            flameX = wickX;
            flameY = wickY - 56.5;
        }
    }

    // Show success message
    if (candleLit) {
        fill(255);
        textAlign(CENTER);
        textSize(22);
        text("The candle is lit.", 300, 800);
    }

  // Fade the screen to white
    if (candleLit) {
        if (glowSize >= 300) {
            whiteAlpha = min(whiteAlpha + 1, 255);
        }

        if (whiteAlpha > 0) {
            noStroke();
            fill(255, whiteAlpha);
            rect(0, 0, width, height);
        }

        if (whiteAlpha >= 255 && !transitionStarted) {
            transitionStarted = true;
            window.location.href = "ending.html";
        }
    }
}

function mousePressed() {
    let d = dist(mouseX, mouseY, flameX, flameY);

    if (fireLoaded && !candleLit && d < 60) {
        dragging = true;
    }
}

function mouseDragged() {
    if (dragging) {
        flameX = mouseX;
        flameY = mouseY;
    }
}

function mouseReleased() {
    dragging = false;
}
