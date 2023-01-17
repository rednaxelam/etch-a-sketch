createNewCanvas(30, 30);
addButtonListeners();
console.log(Number(''));
currentColor = '#000000';

function addButtonListeners() {
  document.querySelector('#clear-canvas-button').addEventListener('click', clearCanvas);
  document.querySelector('#set-resolution-button').addEventListener('click', promptNewDimensions);
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

function previewNewColor() {
  this.setAttribute('style', `background-color: ${currentColor}`);
}

function displayCurrentColor() {
  this.setAttribute('style', `background-color: ${this.getAttribute('data-color')}`)
}

function setNewColor() {
  this.setAttribute('data-color', `${currentColor}`);
}

function setNewColorHold(e) {
  if (e.buttons === 1) this.setAttribute('data-color', `${currentColor}`);
}

// !!! createNewCanvas can be written in a way such that performing the checks in addBorderClasses is not needed. Change later if happy with structure of divs in the Canvas
function createNewCanvas(numRows, numCols) {
  removeCurrentCanvas();
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