const canvas = document.getElementById("c"); // canvas element from HTML
const ctx = canvas.getContext("2d"); // 2D rendering context for the canvas.
const stepBtn = document.getElementById("stepBtn"); // button element from HTML

const NumberOfSorts = 40; // number of values to sort
let values = []; //Empty array for initial values.

let i = 0;          // boundary: left side [0..i-1] is sorted
let minIndex = 0;   // index of smallest found so far in this pass

// highlights
let hiI = null;       // current i position
let hiMin = null;     // current min

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function randomize() {
  values = [];
  for (let k = 0; k < NumberOfSorts; k++) values.push(Math.random());
  resetSelectionState();
}

function resetSelectionState() {
  i = 0;
  minIndex = 0;
  hiI = null;
  hiMin = null;
}

function swap(a, b) {
  const t = values[a];
  values[a] = values[b];
  values[b] = t;
}

function drawBars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / NumberOfSorts;

  for (let idx = 0; idx < NumberOfSorts; idx++) {
    const h = values[idx] * canvas.height;
    const x = idx * barWidth;
    const y = canvas.height - h;

    // Base: unsorted
    let fill = "rgba(255,255,255,0.25)";

    // Sorted region
    if (idx < i) fill = "rgba(0,255,120,0.45)";

    // Highlights override
    if (idx === hiI) fill = "rgba(0,150,255,0.7)";     // i
    if (idx === hiMin) fill = "rgba(255,80,80,0.75)";  // min

    ctx.fillStyle = fill;
    ctx.fillRect(x, y, barWidth - 1, h);
  }

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Selection sort step: i=${i}`, 14, 60);
}

// One click = do ONE outer-loop iteration of selection sort
function stepSelectionSort() {
  if (i >= NumberOfSorts - 1) {
    hiI = hiMin = null;
    drawBars();
    return; // done
  }

  // Start pass: assume min is at i
  minIndex = i;

  // Scan the unsorted part to find the smallest value
  for (let j = i + 1; j < NumberOfSorts; j++) {
    if (values[j] < values[minIndex]) {
      minIndex = j;
    }
  }

  // Swap the found min into position i
  if (minIndex !== i) {
    swap(i, minIndex);
  }

  // Set highlights to show what happened this step
  hiI = i;
  hiMin = i;

  // Move boundary forward: i is now sorted
  i++;

  drawBars();
}

stepBtn.addEventListener("click", stepSelectionSort);

window.addEventListener("resize", () => {
  resizeCanvas();
  drawBars();
});

// Init
resizeCanvas();
randomize();
drawBars();
