let counter = 0;
let maxValue = 10;
let result = 1;

for (counter = 0; counter < maxValue - 1; counter++) { // stop before 0
    console.log(result);
    result *= maxValue - counter - 1;
}
console.log("Final result: ", result);