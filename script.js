let displayValue = '0';
let historyValue = '';
let isDeg = true;

const displayElement = document.getElementById('display');
const historyElement = document.getElementById('history');
const modeTag = document.getElementById('modeTag');

function updateDisplay() {
  displayElement.textContent = displayValue;
  historyElement.textContent = historyValue;
}

function appendValue(val) {
  if (displayValue === '0' && val !== '.') {
    displayValue = val;
  } else {
    displayValue += val;
  }
  updateDisplay();
}

function appendFunc(funcStr) {
  if (displayValue === '0') {
    displayValue = funcStr;
  } else {
    displayValue += funcStr;
  }
  updateDisplay();
}

function appendOp(op) {
  displayValue += ` ${op} `;
  updateDisplay();
}

function clearAll() {
  displayValue = '0';
  historyValue = '';
  updateDisplay();
}

function deleteLast() {
  if (displayValue.length > 1) {
    displayValue = displayValue.trimEnd();
    if (displayValue.endsWith('sin(') || displayValue.endsWith('cos(') || displayValue.endsWith('tan(') || displayValue.endsWith('log(') || displayValue.endsWith('ln(')) {
      displayValue = displayValue.slice(0, -4);
    } else {
      displayValue = displayValue.slice(0, -1);
    }
    if (displayValue === '') displayValue = '0';
  } else {
    displayValue = '0';
  }
  updateDisplay();
}

function toggleSign() {
  if (displayValue !== '0') {
    if (displayValue.startsWith('-')) {
      displayValue = displayValue.slice(1);
    } else {
      displayValue = '-' + displayValue;
    }
    updateDisplay();
  }
}

function toggleDegRad() {
  isDeg = !isDeg;
  modeTag.textContent = isDeg ? 'DEG' : 'RAD';
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function calculate() {
  try {
    historyValue = displayValue;
    let parsedExp = displayValue;

    // Remplazo de operadores visuales a expresiones JavaScript
    parsedExp = parsedExp.replace(/×/g, '*').replace(/÷/g, '/');
    parsedExp = parsedExp.replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
    parsedExp = parsedExp.replace(/\^2/g, '**2').replace(/\^/g, '**');

    // Funciones trigonométricas con grado/radián
    const toRad = isDeg ? '(Math.PI / 180) *' : '';
    parsedExp = parsedExp.replace(/sin\(/g, `Math.sin(${toRad}`);
    parsedExp = parsedExp.replace(/cos\(/g, `Math.cos(${toRad}`);
    parsedExp = parsedExp.replace(/tan\(/g, `Math.tan(${toRad}`);

    // Logaritmos y raíz
    parsedExp = parsedExp.replace(/log\(/g, 'Math.log10(');
    parsedExp = parsedExp.replace(/ln\(/g, 'Math.log(');
    parsedExp = parsedExp.replace(/sqrt\(/g, 'Math.sqrt(');
    parsedExp = parsedExp.replace(/abs\(/g, 'Math.abs(');

    // Factoriales
    parsedExp = parsedExp.replace(/fact\(([0-9]+)\)/g, (_, p1) => factorial(parseInt(p1)));

    const result = Function(`'use strict'; return (${parsedExp})`)();

    if (isNaN(result) || !isFinite(result)) {
      displayValue = 'Error';
    } else {
      displayValue = Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');
    }
  } catch (error) {
    displayValue = 'Error';
  }
  updateDisplay();
}
