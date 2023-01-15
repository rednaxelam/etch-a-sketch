setCanvasDimensions(100, 100);

// !!! setCanvasDimensions can be written in a way such that performing the checks in addBorderClasses is not needed. Change later if happy with structure of divs in the Canvas
function setCanvasDimensions(numRows, numCols) {
  const canvas = document.querySelector('#drawing-canvas');
  for (let i = 0; i < numRows; i++) {
    const canvasRow = createElement('div', {'class': ['canvas-row', 'canvas-include-row-border'], 'data-row': `${i}`});
    addBordersClasses(canvasRow, i, numRows);
    for (let j = 0; j < numCols; j++) {
      const canvasElement = createElement('div', {'class': ['canvas-element', 'canvas-include-element-border'], 'data-row': `${i}`, 'data-col': `${j}`});
      addBordersClasses(canvasElement, i, numRows, j, numCols);
      canvasRow.append(canvasElement);
    }
    canvas.append(canvasRow);
  }
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