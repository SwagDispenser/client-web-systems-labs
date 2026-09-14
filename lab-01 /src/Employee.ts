abstract class Employee {
    constructor(
        public name: string,
        public age: number,
        protected salary: number
    ) {}

    abstract getAnnualBonus(): number;
}

interface Payable {
    pay(): void;
}

class Developer extends Employee implements Payable {
    constructor(
        name: string,
        age: number,
        salary: number,
        public language: string
    ) {
        super(name, age, salary);
    }

    getAnnualBonus(): number {
        return this.salary * 0.10;
    }

    pay(): void {
        console.log(`${this.name} received salary: ${this.salary} UAH`);
    }
}

class Manager extends Employee implements Payable {
    constructor(
        name: string,
        age: number,
        salary: number,
        public specialization: string
    ) {
        super(name, age, salary);
    }

    getAnnualBonus(): number {
        return this.salary * 0.20;
    }

    pay(): void {
        console.log(`${this.name} received salary: ${this.salary} UAH`);
    }
}

const developer1: Developer = new Developer(
    "IvanBossauto",
    25,
    20000,
    "Ukrainian"
);

const developer2: Developer = new Developer(
    "Lona",
    28,
    13000,
    "Fortran"
);

const manager1: Manager = new Manager(
    "Evgen",
    35,
    7000,
    "HR"
);

const manager2: Manager = new Manager(
    "Rostyk",
    40,
    90000,
    "Sales"
);

developer1.pay();
developer2.pay();
manager1.pay();
manager2.pay();

const employees: Employee[] = [
    developer1,
    developer2,
    manager1,
    manager2
];

let totalAnnualBonus: number = 0;

for (const employee of employees) {
    const bonus: number = employee.getAnnualBonus();

    console.log(
        `${employee.name} annual bonus: ${bonus} UAH`
    );

    totalAnnualBonus += bonus;
}

console.log(`Total annual bonuses: ${totalAnnualBonus} UAH`);