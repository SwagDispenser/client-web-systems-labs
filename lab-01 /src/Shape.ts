interface Shape {
    getArea(): number;
    getPerimeter(): number;
    scale(times: number): void;
}

class Circle implements Shape {
    constructor(public radius: number) {}

    getArea(){
        return Math.PI * (this.radius)^2;
    }

    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    scale(times: number) {
        this.radius *= times;
    }
}

class Rectangle implements Shape {
    constructor(public width: number, public height: number) {}

    getArea(): number {
        return this.width * this.height;
    }

    getPerimeter(): number {
        return 2 * (this.width + this.height);
    }

    scale (times: number) {
        this.width *= times;
        this.height *= times;
    }
}

class Triangle implements Shape {
    constructor(public firstSide: number, public secondSide: number, public thirdSide: number) {}

    getArea(): number {
        const p: number = this.getPerimeter() / 2;

        return Math.sqrt(p *
            (p - this.firstSide) *
            (p - this.secondSide) *
            (p - this.thirdSide));
    }

    getPerimeter(): number {
        return this.firstSide + this.secondSide + this.thirdSide;
    }

    scale(times: number) {
        this.firstSide *= times;
        this.secondSide *= times;
        this.thirdSide *= times;
    }
}

const circle: Circle = new Circle(2);
const rectangle: Rectangle = new Rectangle(2, 2);
const triangle: Triangle = new Triangle(2,3,2);

const shapes: Shape[] = [
    circle,
    rectangle,
    triangle
];

let totalArea: number = 0;
let totalPerimeter: number = 0;

for (const shape of shapes) {
    totalArea += shape.getArea();
    totalPerimeter += shape.getPerimeter();
}

console.log("Total Area: ", totalArea, "Total Perimeter: ", totalPerimeter);

console.log("Rectangle pre-scaling:", rectangle.getArea());

rectangle.scale(3);

console.log("Scaling result: ", rectangle.getArea());