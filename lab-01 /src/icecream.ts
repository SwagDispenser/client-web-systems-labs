import promptSync from "prompt-sync";
const prompt = promptSync();

let price: number = 0;

let chosenCup: string = prompt("Choose a cup type (Small/Big): ".toLowerCase());

if (chosenCup === "small") {
    price += 10;
} else if (chosenCup === "big") {
    price += 25
}

let chosenTopping: string = prompt("Choose 1+ topping (Chocolate, Caramel, Berries, Marshmallow): ".toLowerCase());
let toppings: string[] = chosenTopping
    .split(",")
    .map(topping => topping.trim());

let toppingsCount: number = toppings.length;

if (toppings.includes("chocolate")) {
    price += 5;
}

if (toppings.includes("caramel")) {
    price += 6;
}

if (toppings.includes("berries")) {
    price += 10;
}

if (toppings.includes("marshmallow")) {
    price += 5;
}

console.log("Chosen cup:", chosenCup, "Chosen toppings:", toppings, "Total price:", price);

