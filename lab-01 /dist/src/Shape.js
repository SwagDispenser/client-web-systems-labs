"use strict";
class Circle {
    constructor(radius) {
        this.radius = radius;
    }
    getArea() {
        return Math.PI * (this.radius) ^ 2;
    }
    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
    scale(times) {
        this.radius *= times;
    }
}
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
    scale(times) {
        this.width *= times;
        this.height *= times;
    }
}
class Triangle {
    constructor(firstSide, secondSide, thirdSide) {
        this.firstSide = firstSide;
        this.secondSide = secondSide;
        this.thirdSide = thirdSide;
    }
    getArea() {
        const p = this.getPerimeter() / 2;
        return Math.sqrt(p *
            (p - this.firstSide) *
            (p - this.secondSide) *
            (p - this.thirdSide));
    }
    getPerimeter() {
        return this.firstSide + this.secondSide + this.thirdSide;
    }
    scale(times) {
        this.firstSide *= times;
        this.secondSide *= times;
        this.thirdSide *= times;
    }
}
const circle = new Circle(2);
const rectangle = new Rectangle(2, 2);
const triangle = new Triangle(2, 3, 2);
const shapes = [
    circle,
    rectangle,
    triangle
];
let totalArea = 0;
let totalPerimeter = 0;
for (const shape of shapes) {
    totalArea += shape.getArea();
    totalPerimeter += shape.getPerimeter();
}
console.log("Total Area: ", totalArea, "Total Perimeter: ", totalPerimeter);
console.log("Rectangle pre-scaling:", rectangle.getArea());
rectangle.scale(3);
console.log("Scaling result: ", rectangle.getArea());
