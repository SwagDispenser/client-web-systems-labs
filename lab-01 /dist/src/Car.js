"use strict";
class Car {
    constructor(model, spec, innerNumber) {
        this.model = model;
        this.spec = spec;
        this.innerNumber = innerNumber;
    }
    showInnerNumber() {
        return this.innerNumber;
    }
}
class BMW extends Car {
    constructor(model, spec, innerNumber, maximumSpeed) {
        super(model, spec, innerNumber);
        this.maximumSpeed = maximumSpeed;
    }
    showInfo() {
        console.log("BMW", this.model, this.spec, this.showInnerNumber(), this.maximumSpeed);
    }
}
class Mercedes extends Car {
    constructor(model, spec, innerNumber, isExpensive) {
        super(model, spec, innerNumber);
        this.isExpensive = isExpensive;
    }
    showInfo() {
        console.log("Mercedes-Benz", this.model, this.spec, this.showInnerNumber(), this.isExpensive);
    }
}
class Xiaomi extends Car {
    constructor(model, spec, innerNumber, isScam) {
        super(model, spec, innerNumber);
        this.isScam = isScam;
    }
    showInfo() {
        console.log("Xiaomi", this.model, this.spec, this.showInnerNumber(), this.isScam);
    }
}
let bmw = new BMW("M5", "Lux", 1234, 560);
let mercedes = new Mercedes("S63 AMG", "Very mega lux", 51439, true);
let xiaomi = new Xiaomi("SU7 ULTRA", "Poor", 3912391, true);
bmw.showInfo();
mercedes.showInfo();
xiaomi.showInfo();
