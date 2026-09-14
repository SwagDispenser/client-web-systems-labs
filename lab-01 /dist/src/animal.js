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
    constructor(type, name, age, timesSiblingsCatched) {
        this.type = type;
        this.name = name;
        this.age = age;
        if (timesSiblingsCatched) {
            console.log("last of us");
        }
    }
    move() {
        console.log("fish running from fisherman");
    }
}
const cat = new Cat("Scottish", "Murka", 1, "aggressive");
const bird = new Bird("Parrot", "Arkadiy", 9, true);
const fish = new Fish("Karp", "Plavlyk", 99, true);
cat.move();
bird.move();
fish.move();
console.log(cat);
console.log(bird);
console.log(fish);
