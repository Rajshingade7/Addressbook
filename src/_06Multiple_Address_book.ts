import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Contact {
    constructor(
        public firstName: string,
        public lastName: string,
        public address: string,
        public city: string,
        public state: string,
        public zip: string,
        public phone: string,
        public email: string
    ) {}
}

class AddressBook {
    private contacts: Contact[] = [];

    public addContact(contact: Contact) {
        this.contacts.push(contact);
    }

    public viewContacts(): void {
        this.contacts.forEach(contact => console.log(contact));
    }
}

class AddressBookSystem {
    private addressBooks: Map<string, AddressBook> = new Map();

    public addAddressBook(name: string): void {
        if (!this.addressBooks.has(name)) {
            this.addressBooks.set(name, new AddressBook());
            console.log(`Address book '${name}' added successfully.`);
        } else {
            console.log(`Address book with name '${name}' already exists.`);
        }
    }

    public getAddressBook(name: string): AddressBook | undefined {
        return this.addressBooks.get(name);
    }
}

const addressBookSystem = new AddressBookSystem();

function promptForNewAddressBook() {
    rl.question('Enter name for the new address book: ', (name) => {
        addressBookSystem.addAddressBook(name);
        promptForAction();
    });
}

function promptForAction() {
    rl.question('Do you want to add a new address book? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes') {
            promptForNewAddressBook();
        } else {
            rl.close();
        }
    });
}

promptForNewAddressBook();
