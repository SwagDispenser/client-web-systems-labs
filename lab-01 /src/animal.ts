interface Animal {
    type: string,
    name: string,
    age: number

    move(): void;
}

class Cat implements Animal {
    public meowTone?: string;

    constructor(public type: string, public name: string, public age: number, meowTone?: string) {

        if (meowTone === "aggressive") {
            this.meowTone = meowTone;
            console.log("Cat is bad")
        }
    }
    move(): void {
        console.log ("cat moving");
    }
}

class Bird implements Animal {
    public movingToSouth?: boolean;

    constructor(public type: string, public name: string, public age: number, movingToSouth?: boolean) {

        if (movingToSouth) {
            console.log("bird is preparing to move");
        }
    }

    move(): void {
        console.log ("bird moving");
    }

}

class Fish implements Animal {
    public SiblingsCatched?: boolean;

    constructor(public type: string, public name: string, public age: number, timesSiblingsCatched?: boolean) {
        if (timesSiblingsCatched) {
            console.log("last of us");
        }
    }
    move(): void {
        console.log ("fish running from fisherman");
    }
}

const cat: Cat = new Cat("Scottish", "Murka", 1, "aggressive");
const bird: Bird = new Bird("Parrot", "Arkadiy", 9, true);
const fish: Fish = new Fish("Karp", "Plavlyk", 99, true);

cat.move();
bird.move();
fish.move();

console.log(cat);
console.log(bird);
console.log(fish);