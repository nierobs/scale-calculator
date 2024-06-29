'use strict'

const round = (number) => Math.round(number * 1000000) / 1000000;
const phi = round((1 + Math.sqrt(5)) / 2);

const inputs = {
    f: document.getElementById('fundamental-size'),
    r: document.getElementById('ratio'),
    n: document.getElementById('number-of-notes'),
    h: document.getElementById('higher-notes'),
    l: document.getElementById('lower-notes')
};

const result = document.getElementById('result');

const getNote = (i, f, r, s) => Math.pow(r, 1 / s * i) * f;

const getNotes = () => {
    const values = {
        f: parseFloat(inputs.f.value),
        r: parseFloat(inputs.r.value),
        n: parseInt(inputs.n.value),
        h: parseInt(inputs.h.value),
        l: parseInt(inputs.l.value)
    };

    let note = 0;
    let notesArray = [];

    for (let i = 0; i <= values.h * values.n; i++) {
        note = getNote(i, values.f, values.r, values.n);
        notesArray.push(note);

        if (!Number.isFinite(note)) break;
    }

    notesArray = notesArray.reverse();

    for (let i = -1; i >= values.l * (values.n * -1); i--) {
        note = getNote(i, values.f, values.r, values.n);
        notesArray.push(note);

        if (note === 0) break;
    }

    return notesArray;
};

const updateDOM = () => {
    const notesArray = getNotes();
    const n = parseInt(inputs.n.value);

    result.innerHTML = '';

    for (let i = 0; i < notesArray.length; i++) {
        const div = document.createElement('div');

        div.classList.add((i % n !== 0) ? 'secondary' : 'primary');
        div.textContent = round(notesArray[i]);
        result.appendChild(div);
    }
}

for (const i in inputs) {
    const { id } = inputs[i];
    const savedValue = localStorage.getItem(id);

    if (savedValue !== null) inputs[i].value = savedValue;

    inputs[i].addEventListener('input', () => {
        const value = parseFloat(inputs[i].value);

        if (!isNaN(value)) {
            updateDOM();
            localStorage.setItem(id, value);
        } else {
            result.innerHTML = '';
        }
    });
}

document.getElementById('phi').addEventListener('click', () => {
    inputs.r.value = phi;
    updateDOM();
    localStorage.setItem('ratio', phi);
});

window.addEventListener('load', () => updateDOM());
