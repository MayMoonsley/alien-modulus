const util = {
    generate: (length, func) => {
        const r = [];
        for (let i = 0; i < length; i++) {
            r[i] = func(i);
        }
        return r;
    },
    shuffle: (arr) => {
        const r = [];
        for (let i = 0; i < arr.length; i++) {
            r[i] = arr[i];
        }
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.round(Math.random() * i);
            const temp = r[i];
            r[i] = r[j];
            r[j] = temp;
        }
        return r;
    },
    table: (width, height, func, colHeads, rowHeads) => {
        const table = document.createElement('table');
        const header = document.createElement('tr');
        for (let x = -1; x < width; x++) {
            const th = document.createElement('th');
            th.scope = 'col';
            if (x === -1) {
                th.innerHTML = '×';
            } else {
                th.innerHTML = colHeads[x];
            }
            header.appendChild(th);
        }
        table.appendChild(header);
        for (let y = 0; y < height; y++) {
            const row = document.createElement('tr');
            const th = document.createElement('th');
            th.scope = 'row';
            th.innerHTML = rowHeads[y];
            row.appendChild(th);
            for (let x = 0; x < width; x++) {
                const cell = document.createElement('td');
                cell.innerText = func(x, y);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        return table;
    }
};

const game = {
    init: function() {
        this.tablesDiv = document.getElementById('gameTables');
        this.guessDiv = document.getElementById('guess');
        this.newGameInput = document.getElementById('modInput');
        this.guessDisplay = document.getElementById('guessCount');
        this.newGame(10);
    },
    newGame: function(mod) {
        if (mod === undefined) {
            mod = parseInt(this.newGameInput.value);
        }
        this.gameState = new GameState(mod);
        this.setIncorrect(0);
        this.renderTables();
        this.renderGuessNodes();
    },
    setIncorrect: function(x) {
        this.incorrectGuesses = x;
        this.guessDisplay.innerText = x;
    },
    guess: function(num, char) {
        if (this.gameState.mapping[num] === char) {
            return true;
        } else {
            this.setIncorrect(this.incorrectGuesses + 1);
            return false;
        }
    },
    renderTables: function() {
        const mod = this.gameState.modulus;
        const nums = util.generate(mod, i => i);
        this.tablesDiv.innerHTML = '';
        this.tablesDiv.appendChild(util.table(
            mod, mod,
            (a, b) => (a * b) % mod, nums, nums
        ));
        this.tablesDiv.appendChild(util.table(mod, mod, (a, b) => {
            return this.gameState.multiplyStr(this.gameState.chars[a], this.gameState.chars[b]);
        }, this.gameState.chars, this.gameState.chars));
    },
    renderGuessNodes: function() {
        this.guessDiv.innerHTML = '';
        for (let i = 0; i < this.gameState.modulus; i++) {
            this.guessDiv.appendChild(this.renderGuessNode(i));
        }
    },
    renderGuessNode: function(num) {
        const node = document.createElement('div');
        const label = document.createElement('p');
        label.innerText = `${this.gameState.chars[num]} = `;
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = this.gameState.modulus - 1;
        input.size = 3;
        label.appendChild(input);
        node.appendChild(label);
        const button = document.createElement('button');
        button.type = 'button';
        button.innerText = 'Guess';
        button.onclick = function() {
            const right = game.guess(parseInt(input.value), game.gameState.chars[num]);
            if (right) {
                this.disabled = true;
                input.disabled = true;
                label.appendChild(document.createTextNode(' ✓'));
            } else {
                input.value = '';
            }
        };
        node.appendChild(button);
        return node;
    }
};

function GameState(modulus) {
    this.modulus = modulus;
    this.incorrectGuesses = 0;
    const chars = util.generate(modulus, i => String.fromCharCode(i + 65));
    this.chars = chars.join('');
    this.mapping = util.shuffle(chars).join('');
}

GameState.prototype.multiplyNum = function(a, b) {
    if (typeof a === 'string') {
        a = this.mapping.indexOf(a);
    }
    if (typeof b === 'string') {
        b = this.mapping.indexOf(b);
    }
    return (a * b) % this.modulus;
}

GameState.prototype.multiplyStr = function(a, b) {
    return this.mapping[this.multiplyNum(a, b)];
}

const G = new GameState(10);