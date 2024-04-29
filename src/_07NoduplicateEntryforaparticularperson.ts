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

    public equals(other: Contact): boolean {
        return this.firstName === other.firstName && this.lastName === other.lastName;
    }
}

class AddressBook {
    private contacts: Contact[] = [];

    public addContact(contact: Contact): void {
        const existingContact = this.contacts.find(c => c.equals(contact));
        if (!existingContact) {
            this.contacts.push(contact);
            console.log('Contact added successfully.');
        } else {
            console.log('Duplicate contact. Contact not added.');
        }
    }

    public viewContacts(): void {
        this.contacts.forEach(contact => console.log(contact));
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
}

const addressBookSystem = new AddressBookSystem();

function promptForNewAddressBook() {
    rl.question('Enter name for the new address book: ', (name) => {
        addressBookSystem.addAddressBook(name);
        promptForAction();
    });
}

function promptForNewContact() {
    rl.question('Enter name of the address book to add the contact: ', (name) => {
        const addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            promptForContactDetails(addressBook);
        } else {
            console.log(`Address book with name '${name}' does not exist.`);
            promptForAction();
        }
    });
}

function promptForContactDetails(addressBook: AddressBook) {
    rl.question('Enter First Name: ', (firstName) => {
        rl.question('Enter Last Name: ', (lastName) => {
            rl.question('Enter Address: ', (address) => {
                rl.question('Enter City: ', (city) => {
                    rl.question('Enter State: ', (state) => {
                        rl.question('Enter Zip: ', (zip) => {
                            rl.question('Enter Phone: ', (phone) => {
                                rl.question('Enter Email: ', (email) => {
                                    const contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
                                    addressBook.addContact(contact);
                                    promptForAction();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function promptForAction() {
    rl.question('Do you want to add a new address book, add a new contact, view contacts, or exit? (addbook/add/view/exit): ', (answer) => {
        if (answer.toLowerCase() === 'addbook') {
            promptForNewAddressBook();
        } else if (answer.toLowerCase() === 'add') {
            promptForNewContact();
        } else if (answer.toLowerCase() === 'view') {
            promptForViewContacts();
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

promptForAction();
