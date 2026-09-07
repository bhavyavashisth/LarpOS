// js/apps/calculator.js - Calculator application
export default class CalculatorApp {
  constructor() {
    this.display = '0';
    this.expression = '';
    this.result = null;
    this.history = [];
  }

  render(container) {
    container.innerHTML = `
      <div class="calc-app" style="height:100%;display:flex;flex-direction:column;padding:16px;background:#141a20;">
        <div class="calc-display" id="calc-display" style="background:#0d1117;border-radius:8px;padding:16px;text-align:right;font-size:2rem;color:#d4e2ed;margin-bottom:12px;min-height:80px;font-family:monospace;overflow:hidden;">
          ${this.display}
        </div>
        <div class="calc-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;flex:1;">
          <button class="calc-clear" data-action="clear">C</button>
          <button data-action="sign">±</button>
          <button data-action="percent">%</button>
          <button class="calc-op" data-action="divide">÷</button>
          <button data-value="7">7</button>
          <button data-value="8">8</button>
          <button data-value="9">9</button>
          <button class="calc-op" data-action="multiply">×</button>
          <button data-value="4">4</button>
          <button data-value="5">5</button>
          <button data-value="6">6</button>
          <button class="calc-op" data-action="subtract">−</button>
          <button data-value="1">1</button>
          <button data-value="2">2</button>
          <button data-value="3">3</button>
          <button class="calc-op" data-action="add">+</button>
          <button data-value="0" style="grid-column:span 2;">0</button>
          <button data-value=".">.</button>
          <button class="calc-eq" data-action="equals">=</button>
        </div>
      </div>
    `;

    this.displayEl = container.querySelector('#calc-display');
    this.container = container;

    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        const action = btn.dataset.action;
        if (value !== undefined) {
          this.inputValue(value);
        } else if (action) {
          this.inputAction(action);
        }
      });
    });

    // Keyboard support
    document.addEventListener('keydown', this.handleKey.bind(this));
  }

  inputValue(value) {
    if (this.display === '0' && value !== '.') {
      this.display = value;
    } else {
      this.display += value;
    }
    this.updateDisplay();
  }

  inputAction(action) {
    switch(action) {
      case 'clear':
        this.display = '0';
        this.expression = '';
        this.result = null;
        break;
      case 'sign':
        if (this.display.startsWith('-')) {
          this.display = this.display.slice(1);
        } else if (this.display !== '0') {
          this.display = '-' + this.display;
        }
        break;
      case 'percent':
        this.display = String(parseFloat(this.display) / 100);
        break;
      case 'add':
        this.calculate('+');
        break;
      case 'subtract':
        this.calculate('-');
        break;
      case 'multiply':
        this.calculate('*');
        break;
      case 'divide':
        this.calculate('/');
        break;
      case 'equals':
        this.calculate('=');
        break;
    }
    this.updateDisplay();
  }

  calculate(op) {
    const current = parseFloat(this.display);
    if (this.result === null) {
      this.result = current;
    } else if (this.expression) {
      switch(this.expression) {
        case '+': this.result += current; break;
        case '-': this.result -= current; break;
        case '*': this.result *= current; break;
        case '/': this.result = current !== 0 ? this.result / current : 'Error'; break;
      }
    }
    
    if (op === '=') {
      this.display = String(this.result);
      this.result = null;
      this.expression = '';
    } else {
      this.expression = op;
      this.display = '0';
    }
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.displayEl) {
      this.displayEl.textContent = this.display;
    }
  }

  handleKey(e) {
    const key = e.key;
    if (key >= '0' && key <= '9') {
      this.inputValue(key);
    } else if (key === '.') {
      this.inputValue('.');
    } else if (key === 'Enter' || key === '=') {
      this.inputAction('equals');
    } else if (key === 'Escape') {
      this.inputAction('clear');
    } else if (key === '+') {
      this.inputAction('add');
    } else if (key === '-') {
      this.inputAction('subtract');
    } else if (key === '*') {
      this.inputAction('multiply');
    } else if (key === '/') {
      this.inputAction('divide');
    }
  }
}