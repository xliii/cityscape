const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');

let bg = document.querySelector("#bg");

const N_BUILDINGS_PER_LAYER = 40;
const N_LAYERS = 3;
const N_STARS = 1000;

const CELL_X = 12;
const CELL_Y = 20;

const WINDOW_REL_WIDTH = 0.25;
const WINDOW_REL_HEIGHT = 0.325;

// building setup
const MIN_WIDTH = 4;
const MAX_WIDTH = 5;
const MIN_HEIGHT = 6;
const MAX_HEIGHT = 14;

const MAX_X_OFFSET = 4;

// fade configuration
const TARGET_FADE_TIME = 60000;

// falling star
const FALLING_STAR_LAYERS = 50;
const FALLING_STAR_STEP = 2;
const FALLING_STAR_OPACITY_STEP = 0.03;

// clouds
const N_CLOUDS = 8;

init(type);

function init(type) {
    document.documentElement.style.setProperty("--CELL-X", CELL_X + "px");
    document.documentElement.style.setProperty("--CELL-Y", CELL_Y + "px");
    document.documentElement.style.setProperty("--WINDOW-REL-WIDTH", String(WINDOW_REL_WIDTH));
    document.documentElement.style.setProperty("--WINDOW-REL-HEIGHT", String(WINDOW_REL_HEIGHT));

    if (type === "day") {
        drawDay();
    } else if (type === "evening") {
        drawEvening();
    } else {
        drawNight();
    }

    //initDebug();
}

function drawEvening() {
    document.body.classList.add("evening");

    drawSun();
    drawBuildings();
}

function drawSun() {
    let s = document.createElement("div");
    s.classList.add("sun");

    bg.append(s);
}

function drawNight() {
    drawStars();
    drawBuildings();
    initFallingStars();

    fadeWindows();
}

function drawDay() {
    document.body.classList.add("day");

    drawBuildings();
    initClouds();
}

function initClouds() {
    for (let i = 0; i < N_CLOUDS; i++) {
        let x = -200;
        let y = random(window.innerHeight / 2);
        let duration = random(40, 25);
        let delay = random(20);
        createCloud(x, y, duration, delay);
    }
}

function createCloud(x, y, duration, delay) {
    let c = document.createElement("div");
    c.classList.add("cloud");
    c.dataset.type = String(random(1));
    c.dataset.size = String(random(2));

    c.style.left = x + "px";
    c.style.top = y + "px";
    c.style.animationDuration = duration + "s";
    c.style.animationDelay = delay + "s";

    bg.append(c);
}

function initDebug() {
    let time = 0;

    setInterval(() => {
        time++;
        let windows = document.querySelectorAll(".window").length;
        let faded = document.querySelectorAll(".window.fade").length;
        document.querySelector("#timer").innerHTML = time + " | " + faded + "/" + windows;
    }, 1000);
}

function initFallingStars() {
    setTimeout(() => {
        createFallingStar();
        initFallingStars();
    }, random(20000, 5000));
}

function createFallingStar() {
    let x = random(window.innerWidth);
    let y = -50;

    let s = document.createElement("div");
    s.classList.add("fallingStar");

    s.style.left = x + "px";
    s.style.top = y + "px";

    let boxShadow = [];

    for (let i = 1; i < FALLING_STAR_LAYERS; i++) {
        boxShadow.push(`${i * FALLING_STAR_STEP}px -${i * FALLING_STAR_STEP}px rgba(255,255,255,${1 - FALLING_STAR_OPACITY_STEP * i})`);
    }

    s.style.boxShadow = boxShadow.join(',');
    bg.append(s);
}

function createStar(x, y) {
    let s = document.createElement("div");
    s.classList.add("star");
    s.classList.add(Math.random() > 0.5 ? "warm" : "cold");
    s.dataset.size = String(random(3));
    s.style.animationDuration = random(5, 2) + "s";
    s.style.animationDelay = Math.random() * 3 + "s";

    s.style.left = x + "px";
    s.style.top = y + "px";
    return s;
}

function drawStars() {
    for (let i = 0; i < N_STARS; i++) {
        let x = random(window.innerWidth);
        let y = random(window.innerHeight);

        bg.append(createStar(x, y));
    }
}

function drawBuildings() {
    for (let layer = N_LAYERS; layer > 0; layer--) {
        let xOffset = 0;

        for (let i = 0; i < N_BUILDINGS_PER_LAYER; i++) {
            let w = random(MAX_WIDTH, MIN_WIDTH);
            let h = random(MAX_HEIGHT, MIN_HEIGHT);
            bg.append(createBuilding(xOffset, w, h, layer));

            xOffset += w + random(MAX_X_OFFSET);

            if (xOffset * CELL_X > window.innerWidth) {
                break;
            }
        }
    }
}

function fadeWindows() {
    let windows = document.querySelectorAll(".window");
    //totalTime = totalWindows / batch * interval
    let batch = 4;

    let interval = Math.floor(TARGET_FADE_TIME / windows.length * batch);
    console.log("Total windows: " + windows.length);
    console.log("Target duration: " + TARGET_FADE_TIME);
    console.log("Fade interval: " + interval);

    let shuffled = [...windows].sort(() => 0.5 - Math.random());
    let pos = 0;

    setInterval(() => {
        for (let i = pos; i < pos + batch; i++) {
            shuffled[i]?.classList.add("fade");
        }
        pos += batch;
    }, interval);
}

function createBuilding(xOffset, w, h, layer) {
    let b = document.createElement("div");
    b.classList.add("building");
    b.dataset.layer = layer;

    b.style.left = xOffset * CELL_X + "px";

    b.style.width = w * CELL_X + "px";
    b.style.height = h * CELL_Y + "px";

    //create windows
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            b.append(createWindow(x * CELL_X, y * CELL_Y));
        }
    }

    return b;
}

function random(to, from = 0) {
    return Math.floor(Math.round(Math.random() * to) + from);
}

function createWindow(x, y) {
    let w = document.createElement("div");
    w.classList.add("window");
    w.style.top = y + "px";
    w.style.left = x + "px";

    w.dataset.brightness = String(random(3));

    return w;
}