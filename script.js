/* This file is divided into ${x} sections:

-Initial Webpage Calls and Global Variables 
-Canvas Creation
-Canvas Manipulation
-Brush Behavior
-Color Palette
-Opacity
-Utility Functions

Each section has a comment with a "##" and section name above it for easy navigation. */

/* ## Initial Webpage Calls and Global Variables */

let globalRowsMaxIndex;
let globalColsMaxIndex;
let currentColor = '#000000ff';
let savedColor = '#000000ff';
let currentOpacity = 'ff';
let eraserActive = false;
let previewNewColor = previewNewColorDefault;
let displayCurrentColor = displayCurrentColorDefault;
let setNewColor = setNewColorDefault;
let setNewColorHold = setNewColorHoldDefault;

initializePage()

function initializePage() {
  createNewCanvas(30, 30);
  createStandardColorPalette();
  addButtonListeners();
  toggleBrush();
  initializeOpacitySlider();
}

function addButtonListeners() {
  document.querySelector('#clear-canvas-button').addEventListener('click', clearCanvas);
  document.querySelector('#set-dimensions-view-options').addEventListener('click', displayNewDimensionsSlider);
  document.querySelector('#toggle-borders-button').addEventListener('click', toggleBorders);
  document.querySelector('#brush-button').addEventListener('click', toggleBrush);
  document.querySelector('#eraser-button').addEventListener('click', toggleEraser);
  document.querySelector('#fill-button').addEventListener('click', toggleFill);
  document.querySelector('#add-color-button').addEventListener('click', addNewColorPaletteChoice);
  document.querySelector('#add-color-button').addEventListener('click', disableColorDeleteMode);
  document.querySelector('#remove-color-button').addEventListener('click', enableColorDeleteMode);
}

/* ## Canvas Creation */

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
      const canvasElement = createElement('div', {'class': ['canvas-element', 'canvas-include-element-border'], 'data-row': `${i}`, 'data-col': `${j}`, 'data-color': '#ffffffff', 'style': 'background-color: #ffffffff;'});
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

/* ## Canvas Manipulation*/

// you don't need to create an element list in this way
function clearCanvas() {
  const elementList = document.querySelectorAll('.canvas-element');
  for (let i = 0; i < elementList.length; i++) {
    elementList.item(i).setAttribute('style', 'background-color: #ffffffff');
    elementList.item(i).setAttribute('data-color', '#ffffffff');
  }
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

function displayNewDimensionsSlider() {
  const setDimensionsContainer = document.querySelector('#set-dimensions-container');
  const setDimensionsViewOptionsButton = document.querySelector('#set-dimensions-view-options');
  setDimensionsViewOptionsButton.classList.add('set-dimensions-view-options-active');
  const setDimensionsChoice = createElement('div', {'id': 'set-dimensions-choice', 'style': 'display: flex'});
  const currentDimensions = document.querySelector('#drawing-canvas').childNodes.length;
  const newDimensionsSlider = createElement('input', {'type': 'range', 'min': '1', 'max': '50', 'value': `${currentDimensions}`, 'step': '1', 'id': 'new-dimensions-slider', 'class': ['expand']});
  const newDimensionsSliderValue = createElement('div', {'id': 'new-dimensions-value', 'style': 'margin: 10px; font-size: 20px;'});
  newDimensionsSliderValue.textContent = `${currentDimensions} x ${currentDimensions}`;
  setDimensionsChoice.append(newDimensionsSlider, newDimensionsSliderValue);
  const setNewDimensionsButton = createElement('button', {'id': 'set-dimensions-button'});
  setNewDimensionsButton.textContent = 'Clear All and Change';
  setDimensionsContainer.append(setDimensionsChoice, setNewDimensionsButton);

  setDimensionsViewOptionsButton.removeEventListener('click', displayNewDimensionsSlider);
  setDimensionsViewOptionsButton.addEventListener('click', removeNewDimensionsSlider);
  newDimensionsSlider.addEventListener('input', displaySliderValue);
  setNewDimensionsButton.addEventListener('click', setNewDimensions);
}

function removeNewDimensionsSlider() {
  document.querySelector('#set-dimensions-choice').remove();
  document.querySelector('#set-dimensions-button').remove();

  const setDimensionsViewOptionsButton = document.querySelector('#set-dimensions-view-options');
  setDimensionsViewOptionsButton.classList.remove('set-dimensions-view-options-active');
  setDimensionsViewOptionsButton.removeEventListener('click', removeNewDimensionsSlider);
  setDimensionsViewOptionsButton.addEventListener('click', displayNewDimensionsSlider);
}

function displaySliderValue() {
  const newDimensionsSliderValue = document.querySelector('#new-dimensions-value');
  newDimensionsSliderValue.textContent = `${this.value} x ${this.value}`;
}

function setNewDimensions() {
  const newDimensionsSliderValue = Number(document.querySelector('#new-dimensions-slider').value);
  createNewCanvas(newDimensionsSliderValue, newDimensionsSliderValue);
}

/* ## Brush Behavior */

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

function toggleBrush() {
  currentColor = savedColor;
  eraserActive = false;
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
  currentColor = '#ffffffff';
  eraserActive = true;
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
  eraserActive = false;
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

/* ## Color Palette */

function enableColorDeleteMode() {
  const colorPalette = document.querySelector('#color-palette');
  const removeColorButton = document.querySelector('#remove-color-button');
  removeColorButton.classList.add('remove-color-active');
  removeColorButton.removeEventListener('click', enableColorDeleteMode);
  removeColorButton.addEventListener('click', disableColorDeleteMode);
  for (let paletteElement = colorPalette.firstElementChild; paletteElement !== null; paletteElement = paletteElement.nextElementSibling) {
    paletteElement.removeEventListener('click', enableColor);
    paletteElement.addEventListener('click', removeColor);
    paletteElement.addEventListener('mouseenter', removeColorHighlight);
    paletteElement.addEventListener('mouseleave', removeColorUnhighlight);
  }
}

function removeColor() {
  this.remove();
}

function removeColorHighlight() {
  this.classList.add('remove-color-highlight');
}

function removeColorUnhighlight() {
  this.classList.remove('remove-color-highlight');
}

function disableColorDeleteMode() {
  const colorPalette = document.querySelector('#color-palette');
  const removeColorButton = document.querySelector('#remove-color-button');
  removeColorButton.classList.remove('remove-color-active');
  removeColorButton.removeEventListener('click', disableColorDeleteMode);
  removeColorButton.addEventListener('click', enableColorDeleteMode);
  for (let paletteElement = colorPalette.firstElementChild; paletteElement !== null; paletteElement = paletteElement.nextElementSibling) {
    paletteElement.removeEventListener('click', removeColor);
    paletteElement.removeEventListener('mouseenter', removeColorHighlight);
    paletteElement.removeEventListener('mouseleave', removeColorUnhighlight);
    paletteElement.addEventListener('click', enableColor);
  }
}

function addNewColorPaletteChoice() {
  const colorPalette = document.querySelector('#color-palette');
  const newColor = document.querySelector('#add-color-choose-color').value;
  const newColorPaletteChoice = createColorPaletteChoice(newColor);
  colorPalette.appendChild(newColorPaletteChoice);
}

function createStandardColorPalette() {
  const colorPalette = document.querySelector('#color-palette');
  const standardColours = ['#000000', '#ff0000', '#3399ff', '#00cc00', '#00ff00', '#0000ff', '#cc3399', '#cc00ff', '#ff9900', '#ffff00', '#99ff99', '#999966'];
  for (let i = 0; i < standardColours.length; i++) {
    paletteElement = createColorPaletteChoice(standardColours[i]);
    colorPalette.append(paletteElement);
  }
}

function createColorPaletteChoice(colorHex) {
  const paletteElement = createElement('div', {'class': ['color-palette-element'], 'data-color': colorHex});
  paletteElement.setAttribute('style', `background-color: ${colorHex}`);
  paletteElement.addEventListener('click', enableColor);
  return paletteElement;
}

function enableColor() {
  // the following boolean expression is only true if the eraser is enabled
  if (eraserActive) toggleBrush();
  const newColor = this.getAttribute('data-color') + currentOpacity;
  currentColor = newColor;
  savedColor = newColor;
  const opacityColorPreview = document.querySelector('#opacity-color-preview');
  opacityColorPreview.setAttribute('style', `background-color: ${newColor}`);
  removeActiveColorStyling();
  this.classList.add('color-palette-element-active');
}

function removeActiveColorStyling() {
  const colorPalette = document.querySelector('#color-palette');
  for (let paletteElement = colorPalette.firstElementChild; paletteElement !== null; paletteElement = paletteElement.nextElementSibling) {
    if (paletteElement.classList.contains('color-palette-element-active')) paletteElement.classList.remove('color-palette-element-active');
  }
}

/* ## Opacity */

function initializeOpacitySlider() {
  const opacitySlider = document.querySelector('#opacity-slider');
  const opacityNumber = document.querySelector('#opacity-number');
  const opacityColorPreview = document.querySelector('#opacity-color-preview');
  opacityNumber.textContent = `${opacitySlider.value}%`;
  opacityColorPreview.setAttribute('style', `background-color: ${savedColor}`);
  opacitySlider.addEventListener('input', changeColorOpacity);
}

function convertDecPercentToHexString(decString) {
  return (Math.round(Number(decString)*2.55).toString(16));
}

function changeColorOpacity() {
  const opacitySlider = document.querySelector('#opacity-slider');
  const opacityNumber = document.querySelector('#opacity-number');
  opacityNumber.textContent = `${opacitySlider.value}%`;
  const opacityColorPreview = document.querySelector('#opacity-color-preview');
  currentOpacity = convertDecPercentToHexString(opacitySlider.value);
  savedColor = savedColor.slice(0, 7) + currentOpacity;
  if (!eraserActive) {
    currentColor = savedColor;
  }
  opacityColorPreview.setAttribute('style', `background-color: ${savedColor}`);
}

/* ## Utility Functions */

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