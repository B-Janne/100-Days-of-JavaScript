/* =================================================== 
   Pixel Art Generator - reorganized script.js
   - Grouped logically: globals, helpers, grid, tools,
     menus, color handling, events.
   - Defensive: checks for missing DOM nodes before using.
   - Comments explain each block and important steps.
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
         ======  GLOBALS  =======
         ========================= */
  // Grid state
  let currentCols = 16;
  let currentRows = 16;
  let currentCellSize = 16; // px per cell

  // Color/Tool state
  let selectedColor = "#FF96AD";
  let previousColor = selectedColor;
  let currentTool = "pencil"; // 'pencil' or 'eraser'
  let drawing = false;

  /* =========================
         ======  ELEMENTS  =======
         ========================= */
  const canvas = document.getElementById("pixelCanvas");

  // Size / Scale menu elements
  const sizeBtn = document.getElementById("sizeMenuBtn");
  const sizeMenu = document.getElementById("sizeMenu");
  const sizeLabel = document.getElementById("sizeLabel");

  const scaleBtn = document.getElementById("scaleMenuBtn");
  const scaleMenu = document.getElementById("scaleMenu");
  const scaleLabel = document.getElementById("scaleLabel");

  // Tool buttons
  const pencilBtn = document.getElementById("pencil");
  const eraseBtn = document.getElementById("erase");
  const clearBtn = document.getElementById("clear");

  // Color UI
  const colorBtn = document.getElementById("colorPickerBtn");
  const colorIndicator = document.getElementById("currentColorIndicator");
  const colorMenu = document.getElementById("colorMenu");
  const customColorInput = document.getElementById("hiddenCustomColor"); // hidden <input type="color">

  // Convenience list of menus to manage "only one open at a time"
  const menus = [sizeMenu, scaleMenu, colorMenu].filter(Boolean);

  /* =========================
         ======  HELPERS  ========
         ========================= */

  function closeAllMenus(except = null) {
    menus.forEach((m) => {
      if (m && m !== except) m.classList.remove("open");
    });
  }

  function toggleMenu(menu) {
    if (!menu) return;
    const willOpen = !menu.classList.contains("open");
    closeAllMenus(willOpen ? menu : null);
    menu.classList.toggle("open");
  }

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function setIndicatorColor(color) {
    if (!colorIndicator) return;
    if (!color || color === "transparent") {
      colorIndicator.style.backgroundColor = "transparent";
    } else {
      colorIndicator.style.backgroundColor = color;
    }
  }

  /* =========================
         ======  GRID LOGIC  =====
         ========================= */
  function generateGrid(rows, cols, cellSize, pixelData = {}) {
    if (!canvas) return;
    canvas.innerHTML = "";

    const canvasWidth = cols * cellSize;
    const canvasHeight = rows * cellSize;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.display = "grid";
    canvas.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    canvas.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement("div");
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.border = "1px solid #ddd";

        const key = `${r},${c}`;
        if (pixelData[key]) {
          cell.style.backgroundColor = pixelData[key];
        }

        canvas.appendChild(cell);
      }
    }
  }

  function updateCellSize(newCellSize) {
    if (!canvas) return;
    canvas.style.gridTemplateColumns = `repeat(${currentCols}, ${newCellSize}px)`;
    canvas.style.gridTemplateRows = `repeat(${currentRows}, ${newCellSize}px)`;

    canvas.querySelectorAll("div").forEach((cell) => {
      cell.style.width = `${newCellSize}px`;
      cell.style.height = `${newCellSize}px`;
    });

    canvas.style.width = `${currentCols * newCellSize}px`;
    canvas.style.height = `${currentRows * newCellSize}px`;
  }

  function getCurrentPixelData(rows, cols) {
    const data = {};
    if (!canvas) return data;
    const cells = canvas.children;
    for (let i = 0; i < cells.length; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const color = cells[i].style.backgroundColor;
      if (color && color !== "transparent" && color !== "") {
        data[`${r},${c}`] = color;
      }
    }
    return data;
  }

  function updateGridSize(newRows, newCols) {
    if (!canvas) return;
    const oldRows = currentRows;
    const oldCols = currentCols;
    const savedPixelData = getCurrentPixelData(oldRows, oldCols);

    const currentCells = canvas.children.length;
    const desiredCells = newRows * newCols;

    canvas.style.gridTemplateColumns = `repeat(${newCols}, ${currentCellSize}px)`;
    canvas.style.gridTemplateRows = `repeat(${newRows}, ${currentCellSize}px)`;
    canvas.style.width = `${newCols * currentCellSize}px`;
    canvas.style.height = `${newRows * currentCellSize}px`;

    if (desiredCells > currentCells) {
      for (let i = currentCells; i < desiredCells; i++) {
        const cell = document.createElement("div");
        cell.style.width = `${currentCellSize}px`;
        cell.style.height = `${currentCellSize}px`;
        cell.style.border = "1px solid #ddd";
        canvas.appendChild(cell);
      }
    } else if (desiredCells < currentCells) {
      for (let i = currentCells - 1; i >= desiredCells; i--) {
        canvas.removeChild(canvas.children[i]);
      }
    }

    for (let r = 0; r < newRows; r++) {
      for (let c = 0; c < newCols; c++) {
        const key = `${r},${c}`;
        const cellIndex = r * newCols + c;
        if (savedPixelData[key] && canvas.children[cellIndex]) {
          canvas.children[cellIndex].style.backgroundColor =
            savedPixelData[key];
        } else if (canvas.children[cellIndex]) {
          canvas.children[cellIndex].style.backgroundColor = "transparent";
        }
      }
    }

    currentRows = newRows;
    currentCols = newCols;
  }

  generateGrid(currentRows, currentCols, currentCellSize);

  /* =========================
         ======  TOOLS  =========
         ========================= */
  function setActiveTool(buttonEl) {
    document.querySelectorAll(".tool-buttons button").forEach((btn) => {
      btn.classList.remove("active");
    });
    if (buttonEl) buttonEl.classList.add("active");
  }

  setActiveTool(pencilBtn);

  if (pencilBtn) {
    pencilBtn.addEventListener("click", () => {
      currentTool = "pencil";
      setActiveTool(pencilBtn);
    });
  }

  if (eraseBtn) {
    eraseBtn.addEventListener("click", () => {
      currentTool = "eraser";
      setActiveTool(eraseBtn);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!canvas) return;
      canvas.querySelectorAll("div").forEach((cell) => {
        cell.style.backgroundColor = "";
      });
    });
  }

  function paintCell(cell) {
    if (!cell) return;
    if (currentTool === "pencil") {
      cell.style.backgroundColor = selectedColor;
    } else if (currentTool === "eraser") {
      cell.style.backgroundColor = "";
    }
  }

  if (canvas) {
    canvas.addEventListener("mousedown", (e) => {
      if (e.target.parentElement !== canvas) return;
      drawing = true;
      paintCell(e.target);
    });

    canvas.addEventListener("mouseover", (e) => {
      if (!drawing) return;
      if (e.target.parentElement !== canvas) return;
      paintCell(e.target);
    });
  }

  document.addEventListener("mouseup", () => {
    drawing = false;
  });

  /* =========================
         ======  SIZE & SCALE  ===
         ========================= */
  document.querySelectorAll("#sizeMenu .preset-item").forEach((item) => {
    item.addEventListener("click", () => {
      const size = parseInt(item.getAttribute("data-size"));
      if (Number.isNaN(size)) return;
      sizeLabel && (sizeLabel.textContent = `${size}×${size}`);
      sizeMenu && sizeMenu.classList.remove("open");
      updateGridSize(size, size);
    });
  });

  const customWidthEl = document.getElementById("customWidth");
  const customHeightEl = document.getElementById("customHeight");
  if (customWidthEl) {
    customWidthEl.addEventListener("input", (e) => {
      const newWidth = parseInt(e.target.value);
      const newHeight = customHeightEl
        ? parseInt(customHeightEl.value)
        : currentRows;
      document.getElementById("widthValue") &&
        (document.getElementById("widthValue").textContent = newWidth);
      sizeLabel && (sizeLabel.textContent = `${newWidth}×${newHeight}`);
      updateGridSize(newHeight, newWidth);
    });
  }

  if (customHeightEl) {
    customHeightEl.addEventListener("input", (e) => {
      const newHeight = parseInt(e.target.value);
      const newWidth = customWidthEl
        ? parseInt(customWidthEl.value)
        : currentCols;
      document.getElementById("heightValue") &&
        (document.getElementById("heightValue").textContent = newHeight);
      sizeLabel && (sizeLabel.textContent = `${newWidth}×${newHeight}`);
      updateGridSize(newHeight, newWidth);
    });
  }

  document.querySelectorAll("#scaleMenu .preset-item").forEach((item) => {
    item.addEventListener("click", () => {
      const scale = parseInt(item.getAttribute("data-scale"));
      if (Number.isNaN(scale)) return;
      currentCellSize = scale;
      scaleLabel && (scaleLabel.textContent = `×${currentCellSize}`);
      scaleMenu && scaleMenu.classList.remove("open");
      updateCellSize(currentCellSize);
    });
  });

  const customScaleEl = document.getElementById("customScale");
  if (customScaleEl) {
    customScaleEl.addEventListener("input", (e) => {
      currentCellSize = parseInt(e.target.value);
      document.getElementById("scaleValue") &&
        (document.getElementById("scaleValue").textContent = currentCellSize);
      scaleLabel && (scaleLabel.textContent = `×${currentCellSize}`);
      updateCellSize(currentCellSize);
    });
  }

  /* =========================
         ======  MENU TOGGLING ==
         ========================= */
  if (sizeBtn) {
    sizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu(sizeMenu);
    });
  }

  if (scaleBtn) {
    scaleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu(scaleMenu);
    });
  }

  if (colorBtn) {
    colorBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu(colorMenu);
    });
  }

  [sizeMenu, scaleMenu, colorMenu].forEach((m) => {
    if (!m) return;
    m.addEventListener("click", (e) => e.stopPropagation());
  });

  document.addEventListener("click", () => {
    closeAllMenus();
  });

  /* =========================
         ======  COLOR PICKER ===
         ========================= */
  document.querySelectorAll(".color-swatch").forEach((sw) => {
    sw.addEventListener("click", () => {
      const col = sw.getAttribute("data-color");
      if (!col) return;
      selectedColor = col;
      previousColor = col;
      setIndicatorColor(selectedColor);
      closeAllMenus();
    });
  });

  const customTrigger = document.getElementById("customColorTrigger");
  if (customTrigger && customColorInput) {
    customTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      customColorInput.click();
    });

    // live preview
    customColorInput.addEventListener("input", () => {
      selectedColor = customColorInput.value;
      setIndicatorColor(selectedColor);
    });

    // close menu only when user confirms
    customColorInput.addEventListener("change", () => {
      colorMenu && colorMenu.classList.remove("open");
    });
  }

  const clearColorBtn = document.getElementById("clearColorBtn");
  if (clearColorBtn) {
    clearColorBtn.addEventListener("click", () => {
      selectedColor = "transparent";
      setIndicatorColor("transparent");
      colorMenu && colorMenu.classList.remove("open");
    });
  }
});
