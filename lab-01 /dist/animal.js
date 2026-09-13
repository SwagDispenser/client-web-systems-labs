"use strict";
class Cat {
    constructor(type, name, age, meowTone) {
        this.type = type;
        this.name = name;
        this.age = age;
        if (meowTone === "aggressive") {
            this.meowTone = meowTone;
            console.log("Cat is bad");
        }
    }
    move() {
        console.log("cat moving");
    }
}
class Bird {
    constructor(type, name, age, movingToSouth) {
        this.type = type;
        this.name = name;
        this.age = age;
        if (movingToSouth) {
            console.log("bird is preparing to move");
        }
    }
    move() {
        console.log("bird moving");
    }
}
class Fish {
    constructor(type, name, age, timesSiblingsCatched = 10) {
        this.type = type;
        this.name = name;
        this.age = age;
        if (timesSiblingsCatched >= 10) {
            console.log("last of us");
        }
    }
    move() {
        console.log("fish running from fisherman");
    }
}
