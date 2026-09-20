abstract class Car {
    constructor(
        public model: string,
        protected spec: string,
        private innerNumber: number,
    ){}

    abstract showInfo(): void;

    public showInnerNumber() {
        return this.innerNumber;
    }
}

class BMW extends Car {
    constructor(model: string, spec: string, innerNumber:number, public maximumSpeed: number) {
        super(model, spec, innerNumber);
    }
    showInfo(): void {
        console.log("BMW", this.model, this.spec, this.showInnerNumber(), this.maximumSpeed);
    }

}

class Mercedes extends Car {
    constructor(model: string, spec: string, innerNumber:number, public isExpensive: boolean) {
        super(model, spec, innerNumber);
    }
    showInfo(): void {
        console.log("Mercedes-Benz", this.model, this.spec, this.showInnerNumber(), this.isExpensive);
    }
}

class Xiaomi extends Car {
    constructor(model: string, spec: string, innerNumber:number, public isScam: boolean) {
        super(model, spec, innerNumber);
    }
    showInfo(): void {
        console.log("Xiaomi", this.model, this.spec, this.showInnerNumber(), this.isScam);
    }
}

let bmw: BMW = new BMW("M5", "Lux", 1234, 560)
let mercedes: Mercedes = new Mercedes("S63 AMG", "Very mega lux", 51439, true)
let xiaomi: Xiaomi = new Xiaomi("SU7 ULTRA", "Poor", 3912391, true)

bmw.showInfo();
mercedes.showInfo();
xiaomi.showInfo();
