function max(array) {
    let maxValue = array[0];  // start with the first element
    for (let i = 1; i < array.length; i++) {
        if (array[i] > maxValue) {
            maxValue = array[i];
        }
    }
    return maxValue;
}

console.log(max([1, 4, 6, 2]));   // -> 6
console.log(max([10, 4, 6, 2]));  // -> 10