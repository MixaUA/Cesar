// --- CONSTANTS ---
const alpha = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ".split("");
const total = alpha.length;
const step = 360 / total;

const input = document.getElementById('input-text');
const output = document.getElementById('output-text');
const clearInputBtn = document.getElementById('clear-input-btn');
const clearOutputBtn = document.getElementById('clear-output-btn');

// --- STATE ---
let currentShift = 0;
let cumulativeAngle = 0;
let lastEditedSource = 'input'; 

// --- INITIALIZATION ---
function performInitialSetup() {
    const outer = document.getElementById('outer-content');
    const inner = document.getElementById('inner-content');
    alpha.forEach((char, i) => {
        const angle = i * step;
        drawSector(outer, char, angle, 160, 185, 135);
        drawSector(inner, char, angle, 110, 135, 45);
    });
    
    // Hide clear buttons by default
    clearInputBtn.style.display = 'none';
    clearOutputBtn.style.display = 'none';
    
    // Ensure correct height on load
    autoResize(input);
    autoResize(output);
}

// --- SVG DRAWING ---
function drawSector(container, char, angle, textR, lineR, innerR) {
    const rad = (angle - 90) * Math.PI / 180;
    const lineRad = (angle + step/2 - 90) * Math.PI / 180;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 200 + innerR * Math.cos(lineRad));
    line.setAttribute("y1", 200 + innerR * Math.sin(lineRad));
    line.setAttribute("x2", 200 + lineR * Math.cos(lineRad));
    line.setAttribute("y2", 200 + lineR * Math.sin(lineRad));
    line.setAttribute("class", "line");
    container.appendChild(line);

    const xText = 200 + textR * Math.cos(rad);
    const yText = 200 + textR * Math.sin(rad);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", xText); text.setAttribute("y", yText);
    text.setAttribute("class", "letter" + (char === 'А' ? ' red' : ''));
    text.setAttribute("transform", `rotate(${angle}, ${xText}, ${yText})`);
    text.style.fontSize = (innerR < 100) ? "13px" : "15px";
    text.textContent = char;
    container.appendChild(text);
}

// --- UI INTERACTIONS ---

function rotateDisk(dir) {
    currentShift = (currentShift + dir + total) % total;
    cumulativeAngle += dir * step;
    updateUI();
}

function resetDisk() {
    currentShift = 0;
    cumulativeAngle = 0;
    updateUI();
}

function updateUI() {
    document.getElementById('outer-group').style.transform = `rotate(${cumulativeAngle}deg)`;
    document.getElementById('shift-display').textContent = currentShift;
    processText(lastEditedSource);
}

function onUserType(source) {
    lastEditedSource = source;
    autoResize(input);
    autoResize(output);
    processText(source);
    
    // Show/hide clear buttons based on content
    clearInputBtn.style.display = input.value.length > 0 ? 'block' : 'none';
    clearOutputBtn.style.display = output.value.length > 0 ? 'block' : 'none';
}

function clearEverything() {
    input.value = "";
    output.value = "";
    autoResize(input);
    autoResize(output);
    lastEditedSource = 'input';
    // Hide buttons after clearing
    clearInputBtn.style.display = 'none';
    clearOutputBtn.style.display = 'none';
}

function copyText(id, btn) {
    const text = document.getElementById(id).value;
    if(!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const oldText = btn.innerText;
        btn.innerText = 'OK!';
        setTimeout(() => btn.innerText = oldText, 2000);
    });
}

// --- CORE LOGIC ---

function processText(source) {
    if (source === 'input') {
        output.value = transform(input.value, -currentShift);
        autoResize(output);
    } else {
        input.value = transform(output.value, currentShift);
        autoResize(input);
    }
}

function transform(text, shift) {
    return text.toUpperCase().split("").map(char => {
        const index = alpha.indexOf(char);
        if (index === -1) return char;
        return alpha[(index + shift + total * 10) % total];
    }).join("");
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// --- START ---
// Wait for the document and fonts to be fully loaded before initializing
document.fonts.ready.then(() => {
    performInitialSetup();
});

