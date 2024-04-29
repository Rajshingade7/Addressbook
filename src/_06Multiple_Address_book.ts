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

    public findContactByName(firstName: string, lastName: string): Contact | undefined {
        return this.contacts.find(contact => contact.firstName === firstName && contact.lastName === lastName);
    }

    public deleteContact(firstName: string, lastName: string): void {
        const index = this.contacts.findIndex(contact => contact.firstName === firstName && contact.lastName === lastName);
        if (index !== -1) {
            this.contacts.splice(index, 1);
            console.log('Contact deleted successfully.');
        } else {
            console.log('Contact not found.');
        }
    }

    public editContact(firstName: string, lastName: string, updatedContact: Contact): void {
        const index = this.contacts.findIndex(contact => contact.firstName === firstName && contact.lastName === lastName);
        if (index !== -1) {
            this.contacts[index] = updatedContact;
            console.log('Contact details updated successfully.');
        } else {
            console.log('Contact not found.');
        }
    }
}

class AddressBookSystem {
    private addressBooks: { [name: string]: AddressBook } = {};

    public addAddressBook(name: string): void {
        if (!this.addressBooks[name]) {
            this.addressBooks[name] = new AddressBook();
            console.log(`Address book '${name}' added successfully.`);
        } else {
            console.log(`Address book with name '${name}' already exists.`);
        }
    }

    public getAddressBook(name: string): AddressBook | undefined {
        return this.addressBooks[name];
    }

    public deleteAddressBook(name: string): void {
        if (this.addressBooks[name]) {
            delete this.addressBooks[name];
            console.log(`Address book '${name}' deleted successfully.`);
        } else {
            console.log(`Address book with name '${name}' does not exist.`);
        }
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
    rl.question('Do you want to add a new address book, view contacts, delete an address book, or exit? (add/view/delete/exit): ', (answer) => {
        if (answer.toLowerCase() === 'add') {
            promptForNewAddressBook();
        } else if (answer.toLowerCase() === 'view') {
            promptForViewContacts();
        } else if (answer.toLowerCase() === 'delete') {
            promptForDeleteAddressBook();
        } else if (answer.toLowerCase() === 'exit') {
            rl.close();
        } else {
            console.log('Invalid option. Please try again.');
            promptForAction();
        }
    });
}

function promptForViewContacts() {
    rl.question('Enter the name of the address book to view contacts: ', (name) => {
        const addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            addressBook.viewContacts();
        } else {
            console.log(`Address book with name '${name}' does not exist.`);
        }
        promptForAction();
    });
}

function promptForDeleteAddressBook() {
    rl.question('Enter the name of the address book to delete: ', (name) => {
        addressBookSystem.deleteAddressBook(name);
        promptForAction();
    });
}

promptForAction();
