let apples: number = 5;

let speed: string = 'fast';

let hasName: boolean = false;
let nothingMuch: null = null;
let nothing: undefined = undefined;

// built in objects
let now: Date = new Date();

//Array
let colors: string[] = ['black', 'blue', 'green'];
let myNumbers: number[] = [1, 2, 3];
let truths: boolean[] = [true, false, true];

//Classes
class Car {}

let car: Car = new Car();

//Object literals
let point: { x: number; y: number } = {
  x: 10,
  y: 20,
};

//Function
const logNumbe: (i: number) => void = (i: number) => {
  console.log(i);
};

//when to use annotations
// 1) function that returns the 'any' type
const json = '{"x" : 10 , "y":20}';
const corrdinates: { x: number; y: number } = JSON.parse(json);
console.log(corrdinates); // {x: 10, y:20}

// 2) when we declare a variable on one line
// and initalize it later
let words = ['red', 'green', 'blue'];
let foundWord: boolean;
for (let i = 0; i < words.length; i++) {
  if (words[i] === 'green') {
    foundWord = true;
  }
}

// 3) Variable whose type cannot be inferred correctly
let numbers = [-10, -1, 12];
let numberAboveZero: boolean | number = false;

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 0) {
    numberAboveZero = numbers[i];
  }
}
