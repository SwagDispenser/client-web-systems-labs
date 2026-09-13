"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
const smallCupPrice = 10;
const bigCupPrice = 25;
const chocolatePrice = 5;
const caramelPrice = 6;
const berriesPrice = 10;
const marshmallowTopping = 5;
let chosenCup = prompt("Choose a cup type (Small/Big):");
let chosenTopping = prompt("Choose minimum 1 or more topping type (Chocolate, Caramel, Berries, Marshmallow):");
if (chosenTopping) { }
