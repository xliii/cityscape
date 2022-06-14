let bg = document.body;

const N_BUILDINGS_PER_LAYER = 40;
const N_LAYERS = 3;
const N_STARS = 100;

const CELL_X = 12;
const CELL_Y = 20;

const WINDOW_REL_WIDTH = 0.25;
const WINDOW_REL_HEIGHT = 0.325;

// building setup
const MIN_WIDTH = 3;
const MAX_WIDTH = 5;
const MIN_HEIGHT = 6;
const MAX_HEIGHT = 14;

const MAX_X_OFFSET = 4;

const WINDOW_COLORS = 4;

init();

function init() {
    document.documentElement.style.setProperty("--CELL-X", CELL_X + "px");
    document.documentElement.style.setProperty("--CELL-Y", CELL_Y + "px");
    document.documentElement.style.setProperty("--WINDOW-REL-WIDTH", String(WINDOW_REL_WIDTH));
    document.documentElement.style.setProperty("--WINDOW-REL-HEIGHT", String(WINDOW_REL_HEIGHT));

    drawStars();
    drawBuildings();
}

function createStar(x, y) {
    let s = document.createElement("div");
    s.classList.add("star");
    s.dataset.size = random(3);

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
    return Math.floor(Math.random() * to) + from;
}

function createWindow(x, y) {
    let w = document.createElement("div");
    w.classList.add("window");
    w.style.top = y + "px";
    w.style.left = x + "px";

    w.dataset.brightness = random(WINDOW_COLORS);

    return w;
}