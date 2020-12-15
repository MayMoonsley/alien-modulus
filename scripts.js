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
        this.gameState = new GameState(10);
        this.renderTables();
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