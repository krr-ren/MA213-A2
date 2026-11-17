let threads = [];

// Target shapes after releasing
let targetThreads = [];

// Animation progress for each thread
let threadProgress = [0, 0, 0, 0];

// Track which threads have been selected
let threadSelected = [false, false, false, false];

// Ending transition
let allReleased = false;
let endingStart = 0;
let endingDelay = 1000;
let whiteAlpha = 0;

function setup() {
    let canvas = createCanvas(984, 672);
    canvas.parent("p5-container");

    // Thread 1
    threads.push([
        {x: 150, y: 250},
        {x: 300, y: 100},
        {x: 450, y: 500},
        {x: 600, y: 150},
        {x: 800, y: 400}
    ]);

    // Thread 2
    threads.push([
        {x: 150, y: 450},
        {x: 350, y: 550},
        {x: 500, y: 150},
        {x: 650, y: 500},
        {x: 850, y: 200}
    ]);

    // Thread 3
    threads.push([
        {x: 200, y: 150},
        {x: 400, y: 400},
        {x: 550, y: 550},
        {x: 700, y: 100},
        {x: 850, y: 450}
    ]);

    // Thread 4
    threads.push([
        {x: 150, y: 350},
        {x: 350, y: 150},
        {x: 500, y: 450},
        {x: 700, y: 350},
        {x: 850, y: 550}
    ]);

  // Target shape for Thread 1
targetThreads.push([
    {x: 0, y: 150},
    {x: 246, y: 170},
    {x: 492, y: 145},
    {x: 738, y: 170},
    {x: 984, y: 150}
]);

// Target shape for Thread 2
targetThreads.push([
    {x: 0, y: 280},
    {x: 246, y: 300},
    {x: 492, y: 275},
    {x: 738, y: 300},
    {x: 984, y: 280}
]);

// Target shape for Thread 3
targetThreads.push([
    {x: 0, y: 410},
    {x: 246, y: 430},
    {x: 492, y: 405},
    {x: 738, y: 430},
    {x: 984, y: 410}
]);

// Target shape for Thread 4
targetThreads.push([
    {x: 0, y: 540},
    {x: 246, y: 560},
    {x: 492, y: 535},
    {x: 738, y: 560},
    {x: 984, y: 540}
]);
  // Check whether all threads have been released
if (
    threadSelected.every(selected => selected) &&
    threadProgress.every(progress => progress >= 1)
) {
    if (!allReleased) {
        allReleased = true;
        endingStart = millis();
    }
}

// Start the ending transition
if (allReleased) {

    if (millis() - endingStart > endingDelay) {

        whiteAlpha = min(whiteAlpha + 2, 255);

        noStroke();
        fill(255, whiteAlpha);
        rect(0, 0, width, height);

        // Navigate to ending page
        if (whiteAlpha >= 255) {
            window.location.href = "ending.html";
        }
    }
}
}


function draw() {
    background(242, 237, 225);

    // Draw all threads
    for (let i = 0; i < threads.length; i++) {

        // Update animation progress
        if (threadSelected[i]) {
            threadProgress[i] = min(
                threadProgress[i] + 0.015,
                1
            );
        }

        // Create the animated shape
        let animatedThread = [];

        let progress = threadProgress[i];

        // Smooth animation
        let easedProgress = progress * progress * (3 - 2 * progress);

        for (let j = 0; j < threads[i].length; j++) {

            let x = lerp(
                threads[i][j].x,
                targetThreads[i][j].x,
                easedProgress
            );

            let y = lerp(
                threads[i][j].y,
                targetThreads[i][j].y,
                easedProgress
            );

            animatedThread.push({
                x: x,
                y: y
            });
        }

        drawThread(animatedThread);
    }

    // Check if all threads have been released
    if (
        threadSelected.every(selected => selected) &&
        threadProgress.every(progress => progress >= 1)
    ) {
        if (!allReleased) {
            allReleased = true;
            endingStart = millis();
        }
    }

    // Start the ending transition
    if (allReleased) {
        if (millis() - endingStart > endingDelay) {

            // Gradually fade to white
            whiteAlpha += 2;
            whiteAlpha = min(whiteAlpha, 255);

            noStroke();
            fill(255, whiteAlpha);
            rect(0, 0, width, height);

            // Redirect to ending page
            if (whiteAlpha >= 255) {
                window.location.href = "ending.html";
            }
        }
    }
}

        drawThread(animatedThread);


function drawThread(thread) {

    noFill();
    stroke(75, 55, 45);
    strokeWeight(3);
    strokeCap(ROUND);

    // Draw a smooth curve between each pair of points
    for (let i = 0; i < thread.length - 1; i++) {

        let p0 = thread[max(0, i - 1)];
        let p1 = thread[i];
        let p2 = thread[i + 1];
        let p3 = thread[min(thread.length - 1, i + 2)];

        let previousX = p1.x;
        let previousY = p1.y;

        // Calculate intermediate points
        for (let t = 0.05; t <= 1.001; t += 0.05) {

            let t2 = t * t;
            let t3 = t2 * t;

            let x = 0.5 * (
                (2 * p1.x) +
                (-p0.x + p2.x) * t +
                (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2 +
                (-p0.x + 3*p1.x - 3*p2.x + p3.x) * t3
            );

            let y = 0.5 * (
                (2 * p1.y) +
                (-p0.y + p2.y) * t +
                (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * t2 +
                (-p0.y + 3*p1.y - 3*p2.y + p3.y) * t3
            );

            line(previousX, previousY, x, y);

            previousX = x;
            previousY = y;
        }
    }
}

function isNearThread(mouseX, mouseY, thread) {

    for (let i = 0; i < thread.length - 1; i++) {

        let p0 = thread[max(0, i - 1)];
        let p1 = thread[i];
        let p2 = thread[i + 1];
        let p3 = thread[min(thread.length - 1, i + 2)];

        // Sample points along the curve
        for (let t = 0.05; t <= 1.001; t += 0.05) {

            let t2 = t * t;
            let t3 = t2 * t;

            let x = 0.5 * (
                2 * p1.x +
                (-p0.x + p2.x) * t +
                (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2 +
                (-p0.x + 3*p1.x - 3*p2.x + p3.x) * t3
            );

            let y = 0.5 * (
                2 * p1.y +
                (-p0.y + p2.y) * t +
                (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * t2 +
                (-p0.y + 3*p1.y - 3*p2.y + p3.y) * t3
            );

            if (dist(mouseX, mouseY, x, y) < 18) {
                return true;
            }
        }
    }

    return false;
}

function mousePressed() {

    for (let i = 0; i < threads.length; i++) {

        // Ignore threads that have already been released
        if (threadSelected[i]) {
            continue;
        }

        if (isNearThread(mouseX, mouseY, threads[i])) {

            threadSelected[i] = true;

            console.log("Thread " + (i + 1) + " released!");

            return;
        }
    }
}