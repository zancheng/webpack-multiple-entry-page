import '../css/style.css';
import { isNull, unique } from './math';
import 'babel-polyfill';

function component() {
    const element = document.createElement('div');

    element.innerHTML = 'Hello webpack';
    return element;
}

document.body.appendChild(component());

const icon = new Image();
icon.src = require('./../images/icon.png');

document.body.appendChild(icon);

const arr = [1, 1, 2, 3];

console.log(unique(arr));
console.log(isNull(arr));

const mapList = new Map();
mapList.set(1, '和键\'a string\'关联的值');
console.log(mapList);

const promiseFn = new Promise((resolve, reject) => {
    if (arr.length > 1) {
        resolve(true);
    } else {
        reject(new Error('timeout'));
    }
});

promiseFn.then(bool => {
    console.log(bool);
}).catch(err => {
    console.log(err);
});
