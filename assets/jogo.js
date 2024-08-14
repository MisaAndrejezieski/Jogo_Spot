const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry', 'grapes', 'lemon', 'lucky_seven', 'orange', 'pear', 'strawberry', 'watermelon',
];

const BASE_SPINNING_DURATION = 2.7;
const COLUMN_SPINNING_DURATION = 0.3;

const PRIZES = {
    'apple': 10,
    'apricot': 20,
    'banana': 30,
    'big_win': 100,
    'cherry': 15,
    'grapes': 25,
    'lemon': 5,
    'lucky_seven': 50,
    'orange': 10,
    'pear': 20,
    'strawberry': 30,
    'watermelon': 40,
};

const WEIGHTS = {
    'apple': 0.2,
    'apricot': 0.1,
    'banana': 0.1,
    'big_win': 0.01,
    'cherry': 0.15,
    'grapes': 0.1,
    'lemon': 0.2,
    'lucky_seven': 0.05,
    'orange': 0.1,
    'pear': 0.1,
    'strawberry': 0.1,
    'watermelon': 0.1,
};

var cols;

window.addEventListener('DOMContentLoaded', function(event) {
    cols = document.querySelectorAll('.col');
    setInitialItems();

    document.getElementById('start-button').addEventListener('click', function() {
        spin(this);
    });

    document.getElementById('buy-credits').addEventListener('click', function() {
        let credits = parseInt(prompt("Quantos créditos você quer comprar?"));
        if (!isNaN(credits) && credits > 0) {
            let currentCredits = parseInt(document.getElementById('credits').value);
            document.getElementById('credits').value = currentCredits + credits;
        }
    });
});

function setInitialItems() {
    let baseItemAmount = 40;

    for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let amountOfItems = baseItemAmount + (i * 3);
        let elms = '';
        let firstThreeElms = '';

        for (let x = 0; x < amountOfItems; x++) {
            let icon = getRandomIcon();
            let item = '<div class="icon" data-item="' + icon + '"><img src="items/' + icon + '.png"></div>';
            elms += item;

            if (x < 3) firstThreeElms += item;
        }
        col.innerHTML = elms + firstThreeElms;
    }
}

function getRandomIcon() {
    let totalWeight = Object.values(WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    for (let icon in WEIGHTS) {
        if (random < WEIGHTS[icon]) {
            return icon;
        }
        random -= WEIGHTS[icon];
    }
}

function spin(elem) {
    let bet = parseInt(document.getElementById('bet').value);
    let credits = parseInt(document.getElementById('credits').value);

    if (bet > credits) {
        alert("Créditos insuficientes!");
        return;
    }

    document.getElementById('credits').value = credits - bet;

    let duration = BASE_SPINNING_DURATION + randomDuration();

    for (let col of cols) {
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

    elem.setAttribute('disabled', true);
    document.getElementById('container').classList.add('spinning');

    setTimeout(() => {
        document.getElementById('container').classList.remove('spinning');
        elem.removeAttribute('disabled');
        calculateWinnings(bet);
    }, duration * 1000);
}

function randomDuration() {
    return Math.random() * 0.5;
}

function calculateWinnings(bet) {
    let winnings = 0;
    let icons = [];

    for (let col of cols) {
        let icon = col.querySelector('.icon').getAttribute('data-item');
        icons.push(icon);
    }

    if (icons[0] === icons[1] && icons[1] === icons[2]) {
        winnings = bet * PRIZES[icons[0]];
    }

    let currentWinnings = parseInt(document.getElementById('winnings').value);
    document.getElementById('winnings').value = currentWinnings + winnings;
}
