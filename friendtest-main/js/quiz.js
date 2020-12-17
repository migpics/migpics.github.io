/* 
  1. Store correct answers
   - When quiz begins, no answers are correct
*/

let correctAnswers = 0;



// 2. Store the rank of a player
let playerRank;


// 3. Select the <main> HTML element

const main = document.querySelector('main');


/*
  4. Ask at least 5 questions
   - Store each answer in a variable
   - Keep track of the number of correct answers
*/
const question01 = prompt("What is the name of that cool guy in Norway?");
const question02 = prompt("What is the name of the awesome guy that invented the PancakeBot?");
const question03 = prompt("What is the name of the guy that you had coffee once in a while?");
const question04 = prompt("What is the name of the smartest ag engineer in the world?");
const question05 = prompt("What is the name of the guy who sucks at programming but invented a pancake robot?");

if (question01 === "Miguel") {
  correctAnswers += 1;
}

if (question02 === "Miguel") {
  correctAnswers +=1;
}

if (question03 === "Miguel") {
  correctAnswers +=1;
}

if (question04 === "Miguel") {
  correctAnswers +=1;
}

if (question05 === "Miguel") {
  correctAnswers +=1;
}


/*
  5. Rank player based on number of correct answers
   - 5 correct = Gold
   - 3-4 correct = Silver
   - 1-2 correct = Bronze
   - 0 correct = No crown
*/

if (correctAnswers === 5) {
  playerRank = "Gold";
} else if (correctAnswers >=3 ) {
  playerRank = "Silver";
} else if (correctAnswers >=2) {
  playerRank = "Bronze";
} else {
  playerRank = "lousy";
}
  


// 6. Output results to the <main> element

main.innerHTML = `<h2>You got ${correctAnswers} out of 5 questions correct.</h2>
<p>You are a <strong>${playerRank} friend!</strong></p>`;
