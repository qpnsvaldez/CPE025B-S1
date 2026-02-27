let width = Number(prompt("Enter the width of the box:", 0));
let height = Number(prompt("Enter the height of the box:", 0));
let length = Number(prompt("Enter the length of the box:", 0));

if (!isNaN(width) && !isNaN(height) && !isNaN(length)) {
    let volume = width * height * length;
    alert(`Calculated box volume is ${volume}`);
} else {
    alert("Please enter valid numeric values for width, height, and length.");
}