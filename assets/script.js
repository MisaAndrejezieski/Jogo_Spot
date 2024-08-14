const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry', 'grapes', 'lemon', 'lucky_seven', 'orange', 'pear', 'strawberry', 'watermelon',
];

const BASE_SPINNING_DURATION = 2.7;
const COLUMN_SPINNING_DURATION = 0.3;

var cols;
var credits = 100;
var winnings = 0;

window.addEventListener('DOMContentLoaded', function(event) {
    cols = document.querySelectorAll('.col');
    setInitialItems();

    document.getElementById('buy-credits').addEventListener('click', buyCredits);
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

function spin(elem) {
    let bet = parseInt(document.getElementById('bet').value);
    if (bet > credits) {
        alert('Créditos insuficientes!');
        return;
    }

    credits -= bet;
    updateCredits();

    let duration = BASE_SPINNING_DURATION + randomDuration();

    for (let col of cols) {
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

    elem.setAttribute('disabled', true);
    document.getElementById('container').classList.add('spinning');

    window.setTimeout(setResult, BASE_SPINNING_DURATION * 1000 / 2);

    window.setTimeout(function () {
        document.getElementById('container').classList.remove('spinning');
        elem.removeAttribute('disabled');
    }.bind(elem), duration * 1000);
}

function setResult() {
    let totalWinnings = 0;

    for (let col of cols) {
        let results = [
            getRandomIcon(),
            getRandomIcon(),
            getRandomIcon()
        ];

        let icons = col.querySelectorAll('.icon img');
        for (let x = 0; x < 3; x++) {
            icons[x].setAttribute('src', 'items/' + results[x] + '.png');
            icons[(icons.length - 3) + x].setAttribute('src', 'items/' + results[x] + '.png');
        }

        if (results[0] === results[1] && results[1] === results[2]) {
            totalWinnings += calculateWinnings(results[0]);
        }
    }

    winnings += totalWinnings;
    updateWinnings();

    if (totalWinnings > 0) {
        alert('Você ganhou ' + totalWinnings + ' créditos!');
    }
}

function calculateWinnings(icon) {
    const payouts = {
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

    return payouts[icon] || 0;
}

function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}

function buyCredits() {
    let amount = parseInt(prompt('Quantos créditos você deseja comprar?'));
    if (amount > 0) {
        credits += amount;
        updateCredits();
    }
}

function updateCredits() {
    document.getElementById('credits').value = credits;
}

function updateWinnings() {
    document.getElementById('winnings').value = winnings;
}
