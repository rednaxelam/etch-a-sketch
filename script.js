let globalRowsMaxIndex;
let globalColsMaxIndex;
let currentColor = '#000000';
let savedColor = '#000000';
let previewNewColor = previewNewColorDefault;
let displayCurrentColor = displayCurrentColorDefault;
let setNewColor = setNewColorDefault;
let setNewColorHold = setNewColorHoldDefault;
createNewCanvas(30, 30);
addButtonListeners();
toggleBrush();

function removeCanvasListeners() {
  const canvas = getCanvas();
  for (let row = canvas.firstChild; row !== null; row = row.nextSibling) {
    for (let element = row.firstChild; element !== null; element = element.nextSibling) {
      element.removeEventListener('mousedown', setNewColor);
      element.removeEventListener('mouseover', setNewColorHold);
    }
  }
}

function updateCanvasListeners() {
  const canvas = getCanvas();
  for (let row = canvas.firstChild; row !== null; row = row.nextSibling) {
    for (let element = row.firstChild; element !== null; element = element.nextSibling) {
      element.addEventListener('mousedown', setNewColor);
      element.addEventListener('mouseover', setNewColorHold);
    }
  }
}

function addButtonListeners() {
  document.querySelector('#clear-canvas-button').addEventListener('click', clearCanvas);
  document.querySelector('#set-resolution-button').addEventListener('click', promptNewDimensions);
  document.querySelector('#toggle-borders-button').addEventListener('click', toggleBorders);
  document.querySelector('#brush-button').addEventListener('click', toggleBrush);
  document.querySelector('#eraser-button').addEventListener('click', toggleEraser);
  document.querySelector('#fill-button').addEventListener('click', toggleFill);
}

function toggleBrush() {
  currentColor = savedColor;
  removeCanvasListeners();
  setNewColor = setNewColorDefault;
  setNewColorHold = setNewColorHoldDefault;
  updateCanvasListeners();
  getCanvas().classList.remove('fill-icon');
  document.querySelector('#brush-button').classList.add('brush-active');
  document.querySelector('#eraser-button').classList.remove('eraser-active');
  document.querySelector('#fill-button').classList.remove('fill-active');
}

function toggleEraser() {
  currentColor = '#FFFFFF';
  removeCanvasListeners();
  setNewColor = setNewColorDefault;
  setNewColorHold = setNewColorHoldDefault;
  updateCanvasListeners();
  getCanvas().classList.remove('fill-icon');
  document.querySelector('#eraser-button').classList.add('eraser-active');
  document.querySelector('#brush-button').classList.remove('brush-active');
  document.querySelector('#fill-button').classList.remove('fill-active');
}

function toggleFill() {
  currentColor = savedColor;
  removeCanvasListeners();
  setNewColor = setNewColorFill;
  setNewColorHold = setNewColorHoldFill;
  updateCanvasListeners();
  getCanvas().classList.add('fill-icon');
  document.querySelector('#fill-button').classList.add('fill-active');
  document.querySelector('#brush-button').classList.remove('brush-active');
  document.querySelector('#eraser-button').classList.remove('eraser-active');
}

function setNewColorFill() {
  const targetColor = this.getAttribute('data-color');
  if (targetColor === currentColor) return;
  else {
    this.setAttribute('data-color', currentColor);
    this.setAttribute('style', `background-color: ${currentColor}`);
    const row = Number(this.getAttribute('data-row'));
    const col = Number(this.getAttribute('data-col'));
    setNewColorFillHelper(row, col - 1, targetColor);
    setNewColorFillHelper(row, col + 1, targetColor);
    setNewColorFillHelper(row - 1, col, targetColor);
    setNewColorFillHelper(row + 1, col, targetColor);
  }
}

function setNewColorFillHelper(row, col, targetColor) {
  if ((row < 0 || row > globalRowsMaxIndex) || (col < 0 || col > globalColsMaxIndex)) return;
  let canvasElement = document.querySelector('#drawing-canvas').childNodes.item(row).childNodes.item(col);
  if (canvasElement.getAttribute('data-color') !== targetColor) return;
  else {
    canvasElement.setAttribute('data-color', currentColor);
    canvasElement.setAttribute('style', `background-color: ${currentColor}`);
    const row = Number(canvasElement.getAttribute('data-row'));
    const col = Number(canvasElement.getAttribute('data-col'));
    setNewColorFillHelper(row, col - 1, targetColor);
    setNewColorFillHelper(row, col + 1, targetColor);
    setNewColorFillHelper(row - 1, col, targetColor);
    setNewColorFillHelper(row + 1, col, targetColor);
  }
}

function setNewColorHoldFill() {
  return;
}

function toggleBorders() {
  const canvas = getCanvas();
  const bordersButton = document.querySelector('#toggle-borders-button');
  if (bordersButton.getAttribute('data-borders') === 'on') {
    bordersButton.setAttribute('data-borders', 'off');
    bordersButton.textContent = 'Enable Borders';
  } else {
    bordersButton.setAttribute('data-borders', 'on');
    bordersButton.textContent = 'Remove Borders';
  }
  for (let row = canvas.firstChild; row !== null; row = row.nextSibling) {
    if (bordersButton.getAttribute('data-borders') === 'on') {
      row.classList.add('canvas-include-row-border');
    } else {
      row.classList.remove('canvas-include-row-border');
    }
    for (let element = row.firstChild; element !== null; element = element.nextSibling) {
      if (bordersButton.getAttribute('data-borders') === 'on') {
        element.classList.add('canvas-include-element-border');
      } else {
        element.classList.remove('canvas-include-element-border');
      }
    }
  }
}

function promptNewDimensions() {
  let newDimensionsString = prompt("(This will clear the canvas)\nEnter the number of rows and columns that you'd like below (maximum 100).");
  if (newDimensionsString === null) return;
  let newDimensions = Number(newDimensionsString);

  while (!validDimension(newDimensions)) {
    if (newDimensionsString === '') alert("Please enter a number. (You can exit without making changes by pressing cancel when prompted for a number).");
    else if (isNaN(newDimensions)) alert("Please enter a number.");
    else if (!Number.isInteger(num)) alert("Please enter a whole number.");
    else if (num <= 0 || num > 100) alert("Please enter a number between 1 and 100 (inclusive)");
    newDimensionsString = prompt("(This will clear the canvas)\nEnter the number of rows and columns that you'd like below (maximum 100).");
    if (newDimensionsString === null) return;
    newDimensions = Number(newDimensionsString);
  }

  createNewCanvas(newDimensions, newDimensions);
}

function validDimension(num) {
  return Number.isInteger(num) && num > 0 && num <= 100;
}

// you don't need to create an element list in this way
function clearCanvas() {
  const elementList = document.querySelectorAll('.canvas-element');
  for (let i = 0; i < elementList.length; i++) {
    elementList.item(i).setAttribute('style', 'background-color: #FFFFFF');
    elementList.item(i).setAttribute('data-color', '#FFFFFF');
  }
}

function previewNewColorDefault() {
  this.setAttribute('style', `background-color: ${currentColor}`);
}

function displayCurrentColorDefault() {
  this.setAttribute('style', `background-color: ${this.getAttribute('data-color')}`)
}

function setNewColorDefault() {
  this.setAttribute('data-color', `${currentColor}`);
}

function setNewColorHoldDefault(e) {
  if (e.buttons === 1) this.setAttribute('data-color', `${currentColor}`);
}

// !!! createNewCanvas can be written in a way such that performing the checks in addBorderClasses is not needed. Change later if happy with structure of divs in the Canvas
function createNewCanvas(numRows, numCols) {
  removeCurrentCanvas();
  globalRowsMaxIndex = numRows - 1;
  globalColsMaxIndex = numCols - 1;
  const canvas = document.querySelector('#drawing-canvas');
  for (let i = 0; i < numRows; i++) {
    const canvasRow = createElement('div', {'class': ['canvas-row', 'canvas-include-row-border'], 'data-row': `${i}`});
    addBordersClasses(canvasRow, i, numRows);
    for (let j = 0; j < numCols; j++) {
      const canvasElement = createElement('div', {'class': ['canvas-element', 'canvas-include-element-border'], 'data-row': `${i}`, 'data-col': `${j}`, 'data-color': '#FFFFFF'});
      addBordersClasses(canvasElement, i, numRows, j, numCols);
      addCanvasElementListeners(canvasElement)
      canvasRow.append(canvasElement);
    }
    canvas.append(canvasRow);
  }
}

function removeCurrentCanvas() {
  const canvas = document.querySelector('#drawing-canvas');
  while (canvas.hasChildNodes()) {
    canvas.removeChild(canvas.firstChild);
  }
}

function addCanvasElementListeners(canvasElement) {
  canvasElement.addEventListener('mouseenter', previewNewColor);
  canvasElement.addEventListener('mouseleave', displayCurrentColor);
  canvasElement.addEventListener('mousedown', setNewColor);
  canvasElement.addEventListener('mouseover', setNewColorHold);
}



function addBordersClasses(element, i, numRows, j = undefined, numCols = undefined) {
  if (i === 0) {
    element.classList.add('borders-top');
  }
  if (i === (numRows - 1)) {
    element.classList.add('borders-bottom');
  }
  if (j === 0) {
    element.classList.add('borders-left');
  }
  if (j === numCols - 1) {
    element.classList.add('borders-right')
  }
}

// got structure of createElement function (with changes made by myself) from Derlin's answer on https://stackoverflow.com/questions/43168284/javascript-createelement-function
function createElement(type, attributes = {}) {
  const element = document.createElement(type);
  for (const key in attributes) {
    if (key === "class") {
        const classArray = attributes["class"];
        for (let i = 0; i < classArray.length; i++) {
          element.classList.add(classArray[i]);
        }
    } else {
      element.setAttribute(key, attributes[key]);
    }
  }
  return element;
}

function getCanvas() {
  return document.querySelector('#drawing-canvas');
}