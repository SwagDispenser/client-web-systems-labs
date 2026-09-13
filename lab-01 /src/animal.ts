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
    public timesSiblingsCatched?: number;

    constructor(public type: string, public name: string, public age: number, timesSiblingsCatched?: number = 10) {
        if (timesSiblingsCatched >= 10) {
            console.log("last of us");
        }
    }
    move(): void {
        console.log ("fish running from fisherman");
    }

}