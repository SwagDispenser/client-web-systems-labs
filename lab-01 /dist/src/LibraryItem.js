"use strict";
class Book {
    constructor(name, author, year) {
        this.name = name;
        this.author = author;
        this.year = year;
        this.isBorrowed = false;
    }
    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log("Book", this.name, "borrowed");
        }
        else {
            console.log("Book", this.name, "already Borrowed");
        }
    }
}
class Magazine {
    constructor(name, author, serialNumber) {
        this.name = name;
        this.author = author;
        this.serialNumber = serialNumber;
        this.isBorrowed = false;
    }
    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log("Book", this.name, "borrowed");
        }
        else {
            console.log("Book", this.name, "already Borrowed");
        }
    }
}
class DVD {
    constructor(name, author, quality) {
        this.name = name;
        this.author = author;
        this.quality = quality;
        this.isBorrowed = false;
    }
    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log("DVD", this.name, "borrowed");
        }
        else {
            console.log("DVD", this.name, "already Borrowed");
        }
    }
}
class Library {
    constructor() {
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
        console.log(item.name, "added");
    }
    findItem(itemName) {
        return this.items.find((item) => item.name === itemName);
    }
    showAvailableItems() {
        console.log("Showing available items from Library");
        const availableItems = this.items.filter((item) => !item.isBorrowed);
        for (const item of availableItems) {
            console.log(item.name, "-", item.author);
        }
    }
}
const book = new Book("Rich Dad Poor Dad", "Olexiy Paws", 2000);
const magazine = new Magazine("Batman", "DC Studios", 415391);
const dvd = new DVD("South Park", "Comedy Central", 720);
const library = new Library();
library.addItem(book);
library.addItem(magazine);
library.addItem(dvd);
library.showAvailableItems();
const foundItem = library.findItem("The Witcher");
if (foundItem !== undefined) {
    console.log("Found Item", foundItem.name);
    foundItem.borrow();
}
library.showAvailableItems();
