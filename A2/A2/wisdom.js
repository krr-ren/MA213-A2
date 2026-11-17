
let closedBook;
let bookOpen = false;
let opening = false;

let openingStart = 0;
let openingDuration = 800;

// Closing animation
let closing = false;
let closingStart = 0;
let closingDuration = 800;

// Prompt text animation
let promptStart = 0;
let promptDuration = 4500;
let promptFadeDuration = 1000;

let openBook;

function setup() {
    let canvas = createCanvas(984, 672);
    canvas.parent("p5-container");

    // Load the closed book
    loadImage("assets/images/book_closed.png", function(img) {
        closedBook = img;
    });

    // Load the open book
    loadImage("assets/images/book_open.png", function(img) {
        openBook = img;
    });
}

function draw() {
    background(20, 21, 28);

    if (!closedBook || !openBook) {
        return;
    }

    // Opening animation
    if (opening) {
        let progress = (millis() - openingStart) / openingDuration;
        progress = constrain(progress, 0, 1);

        tint(255, 255 * (1 - progress));
        image(closedBook, 0, 0);

        tint(255, 255 * progress);
        image(openBook, 0, 0);

        noTint();

        if (progress >= 1) {
            opening = false;
            bookOpen = true;
            promptStart = millis();
        }
    }

    // Closing animation
    else if (closing) {
        let progress = (millis() - closingStart) / closingDuration;
        progress = constrain(progress, 0, 1);

        // Fade out the open book
        tint(255, 255 * (1 - progress));
        image(openBook, 0, 0);

        // Fade in the closed book
        tint(255, 255 * progress);
        image(closedBook, 0, 0);

        noTint();

        // Go to ending page
        if (progress >= 1) {
            window.location.href = "ending.html";
        }
    }

    // Display the open book
    else if (bookOpen) {
        image(openBook, 0, 0);

        drawWritings();
        drawPrompt();
    }

    // Display the closed book
    else {
        image(closedBook, 0, 0);
    }
}

function mousePressed() {

    // Open the book
    if (!bookOpen && !opening && !closing) {

        if (
            mouseX > 480 &&
            mouseX < 940 &&
            mouseY > 50 &&
            mouseY < 620
        ) {
            opening = true;
            openingStart = millis();
        }
    }

    // Interact with the open book
    else if (bookOpen && !closing) {

        // Click inside the book pages
        if (
            mouseX > 100 &&
            mouseX < 880 &&
            mouseY > 100 &&
            mouseY < 600
        ) {
            writingX = mouseX;
            writingY = mouseY;

            isTyping = true;
            currentWriting = "";
        }

        // Click outside the book
        else {
            closing = true;
            closingStart = millis();

            bookOpen = false;
            isTyping = false;
            isDrawing = false;
        }
    }
}

function drawPrompt() {

    let elapsed = millis() - promptStart;

    let promptAlpha = 255;

    // Fade out after the display duration
    if (elapsed > promptDuration) {
        promptAlpha = map(
            elapsed,
            promptDuration,
            promptDuration + promptFadeDuration,
            255,
            0
        );

        promptAlpha = constrain(promptAlpha, 0, 255);
    }

    // Stop displaying the prompt
    if (promptAlpha <= 0) {
        return;
    }

    push();

    textAlign(CENTER, CENTER);
    noStroke();

    // Main prompt
    fill(90, 58, 35, promptAlpha);
    textSize(25);
    text(
        "What are you searching for?",
        300,
        160
    );

    pop();
}

// User writing
let writings = [];
let currentWriting = "";

let writingX = 0;
let writingY = 0;

let isTyping = false;

// User drawing
let drawings = [];
let currentDrawing = [];
let isDrawing = false;

function drawWritings() {

    push();

    // Text settings
    fill(50, 40, 35);
    textSize(18);
    textAlign(LEFT, TOP);

    // Display completed writings
    for (let i = 0; i < writings.length; i++) {
        text(
            writings[i].content,
            writings[i].x,
            writings[i].y,
            250
        );
    }

    // Display current writing
    if (currentWriting !== "") {
        text(
            currentWriting,
            writingX,
            writingY,
            250
        );
    }

    // Drawing settings
    stroke(50, 40, 35);
    strokeWeight(3);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    noFill();

    // Display completed drawings
    for (let i = 0; i < drawings.length; i++) {
        drawLine(drawings[i]);
    }

    // Display current drawing
    if (currentDrawing.length > 0) {
        drawLine(currentDrawing);
    }

    pop();
}

function keyPressed() {

    if (!bookOpen || !isTyping) {
        return;
    }

    // Press Enter to finish the current writing
    if (keyCode === ENTER) {

        if (currentWriting !== "") {
            writings.push({
                content: currentWriting,
                x: writingX,
                y: writingY
            });
        }

        currentWriting = "";
        isTyping = false;

        return false;
    }

    // Press Backspace to delete
    if (keyCode === BACKSPACE) {
        currentWriting = currentWriting.slice(0, -1);
        return false;
    }

    // Ignore special keys
    if (
        keyCode === SHIFT ||
        keyCode === CONTROL ||
        keyCode === ALT
    ) {
        return false;
    }
}

function keyTyped() {

    if (!bookOpen || !isTyping) {
        return;
    }

    if (key.length === 1) {
        currentWriting += key;
    }

    return false;
}

function drawLine(points) {

    if (points.length < 2) {
        return;
    }

    beginShape();

    for (let i = 0; i < points.length; i++) {
        vertex(points[i].x, points[i].y);
    }

    endShape();
}

function mouseDragged() {

    if (!bookOpen) {
        return;
    }

    // Only draw inside the book pages
    if (
        mouseX > 100 &&
        mouseX < 880 &&
        mouseY > 100 &&
        mouseY < 600
    ) {

        isDrawing = true;
        isTyping = false;

        currentDrawing.push({
            x: mouseX,
            y: mouseY
        });
    }
}

function mouseReleased() {

    if (isDrawing) {

        if (currentDrawing.length > 0) {
            drawings.push(currentDrawing);
        }

        currentDrawing = [];
        isDrawing = false;
    }
}