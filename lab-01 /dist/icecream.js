"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
let price = 0;
let chosenCup = prompt("Choose a cup type (Small/Big): ".toLowerCase());
if (chosenCup === "small") {
    price += 10;
}
else if (chosenCup === "big") {
    price += 25;
}
let chosenTopping = prompt("Choose 1+ topping (Chocolate, Caramel, Berries, Marshmallow): ".toLowerCase());
let toppings = chosenTopping
    .split(",")
    .map(topping => topping.trim());
let toppingsCount = toppings.length;
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
