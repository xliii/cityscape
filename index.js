let bg = document.body;

const N = 20;
const N_LAYERS = 3;

const CELL_X = 24;
const CELL_Y = 40;

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

    draw();
}

function draw() {
    for (let layer = N_LAYERS; layer > 0; layer--) {
        let xOffset = 0;

        for (let i = 0; i < N; i++) {
            let w = random(MAX_WIDTH, MIN_WIDTH);
            let h = random(MAX_HEIGHT, MIN_HEIGHT);
            bg.append(createBuilding(xOffset, w, h, layer));

            xOffset += w + random(MAX_X_OFFSET);
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