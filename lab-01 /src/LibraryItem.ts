interface LibraryItem {
    name: string;
    author: string;
    isBorrowed: boolean;

    borrow(): void;
}

class Book implements LibraryItem {
    public isBorrowed: boolean = false;

    constructor(public name: string, public author: string, public year: number) {}

    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            console.log("Book", this.name, "borrowed");
        } else {
            console.log("Book", this.name, "already Borrowed");
        }
    }
}

class Magazine implements LibraryItem {
    public isBorrowed: boolean = false;

    constructor(public name: string, public author: string, public serialNumber: number) {}

    borrow() {
    if (!this.isBorrowed) {
        this.isBorrowed = true;
        console.log("Book", this.name, "borrowed");
    } else {
        console.log("Book", this.name, "already Borrowed");
    }
    }
}

class DVD implements LibraryItem {
    public isBorrowed: boolean = false;
    constructor(public name: string, public author: string, public quality: number) {}

    borrow(): void {
        if(!this.isBorrowed) {
            this.isBorrowed = true;
            console.log("DVD", this.name, "borrowed");
        } else {
            console.log("DVD", this.name, "already Borrowed");
        }
    }
}

class Library {
    private items: LibraryItem[] = [];

    addItem(item: LibraryItem) {
        this.items.push(item);
        console.log(item.name, "added")
    }

    findItem(itemName:string): LibraryItem | undefined {
        return this.items.find((item: LibraryItem) => item.name === itemName);
    }

    showAvailableItems(): void {
        console.log("Showing available items from Library");

        const availableItems: LibraryItem[] = this.items.filter((item: LibraryItem) => !item.isBorrowed);

        for (const item of availableItems) {
            console.log(item.name, "-", item.author);
        }
    }
}

const book: Book = new Book("Rich Dad Poor Dad", "Olexiy Paws", 2000);

const magazine: Magazine = new Magazine("Batman", "DC Studios", 415391);

const dvd: DVD = new DVD("South Park", "Comedy Central", 720);

const library: Library = new Library();

library.addItem(book);
library.addItem(magazine);
library.addItem(dvd);

library.showAvailableItems();

const foundItem: LibraryItem | undefined =
    library.findItem("The Witcher");

if (foundItem !== undefined) {
    console.log("Found Item", foundItem.name);
    foundItem.borrow();
}

library.showAvailableItems();