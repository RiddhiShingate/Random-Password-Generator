const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");//set strength circle color to grey

// set passwordLength
function handleSlider() {//// Function to handle changes in the password length slider
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color) { // Function to set the color of the strength indicator circle
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = "0px 0px 5px 1px " + color;
}

function getRndInteger(min, max) {    // Function to generate a random integer between min and max

    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {    // Function to generate a random single digit number

    return getRndInteger(0,9);
}

function generateLowerCase() {      // Function to generate a random lowercase letter

    return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {      // Function to generate a random uppercase letter

    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {    // Function to generate a random symbol

    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {    // Function to calculate and set the strength indicator color based on selected options and password length

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {    // Function to shuffle the characters of the generated password randomly rearranege
        for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {    // Function to handle changes in the checkboxes for including uppercase, lowercase, numbers, and symbols

    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {    // Loop to add event listeners to all checkbox elements to trigger handleCheckBoxChange() function on change

    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {    // Event listener for changes in the password length slider

    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {    // Event listener for the copy button to trigger copying the generated password

    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {    // Event listener for the generate password button to trigger generating and displaying the password

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Starting the Journey");
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});
