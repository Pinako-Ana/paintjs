const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const undoBtn = document.getElementById("jsUndo");
const redoBtn = document.getElementById("jsRedo");

const INITIAL_COLOR = "#2c2c2c";

canvas.width = 700;
canvas.height = 700;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, 700, 700);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

// ctx.fillStyle = "green";
// ctx.fillRect(50, 20, 100, 50);

// ctx.fillStyle = "purple";
// ctx.fillRect(70, 10, 100, 50);

let img = new Image();
let painting = false;
let isin = false;
let filling = false;
let undoStack = [canvas.toDataURL()];
let redoStack = [];

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

function onmouseup(event) {
  //마우스를 땔 때 언두스택에 저장
  painting = false;
  undoStack.push(canvas.toDataURL());
  redoStack = [];
}
function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    // console.log("creating path in ", x, y);
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    // console.log("creating line in ", x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function handleColor(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

function onMouseEnter(event) {
  isin = true;
  ctx.beginPath();
}

function onmouseleave(event) {
  isin = false;
  ctx.closePath();
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

function handleCanvasClick() {
  if (filling) {
    ctx.fillRect(0, 0, 700, 700);
  }
}

function handleContextMenu(event) {
  event.preventDefault();
}
function handleSaveClick(event) {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "PaintJS";
  link.click();
}
function handleUndo() {
  if (undoStack.length > 1) {
    undoRedo(redoStack, undoStack);
  }
}
function handleRedo() {
  if (redoStack.length >= 1) {
    undoRedo(undoStack, redoStack);
  }
}
function undoRedo(pushStack, popStack) {
  pushStack.push(popStack.pop());
  ctx.clearRect(0, 0, 700, 700);
  let pic = new image();
  pic.Image = popStack[popStack.length - 1];
  pic.addEventListener("load", () => {
    ctx.drawImage(pic, 0, 0);
  });
}
if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", onmouseup);
  canvas.addEventListener("mouseleave", onmouseleave);
  canvas.addEventListener("mouseenter", onMouseEnter);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleContextMenu);
}

Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColor)
);

if (range) {
  range.addEventListener("input", handleRangeChange);
}

if (mode) {
  mode.addEventListener("click", handleModeClick);
}
if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}
if (undoBtn) {
  undoBtn.addEventListener("click", handleUndo);
}
if (redoBtn) {
  redoBtn.addEventListener("click", handleRedo);
}
