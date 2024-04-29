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

    public addContact(contact: Contact): void {
        this.contacts.push(contact);
    }

    public viewContacts(): void {
        this.contacts.forEach(contact => console.log(contact));
    }

    public searchContactsByCityOrState(cityOrState: string): Contact[] {
        return this.contacts.filter(contact => contact.city === cityOrState || contact.state === cityOrState);
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

    public searchContactsByCityOrState(cityOrState: string): Contact[] {
        const contacts: Contact[] = [];
        for (const addressBookName in this.addressBooks) {
            if (Object.prototype.hasOwnProperty.call(this.addressBooks, addressBookName)) {
                const addressBook = this.addressBooks[addressBookName];
                contacts.push(...addressBook.searchContactsByCityOrState(cityOrState));
            }
        }
        return contacts;
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

function promptForSearchContacts() {
    rl.question('Enter city or state to search contacts: ', (cityOrState) => {
        const contacts = addressBookSystem.searchContactsByCityOrState(cityOrState);
        if (contacts.length > 0) {
            console.log('Search results:');
            contacts.forEach(contact => console.log(contact));
        } else {
            console.log('No contacts found in the specified city or state.');
        }
        promptForAction();
    });
}

function promptForAction() {
    rl.question('Do you want to add a new address book, add a new contact, view contacts, search contacts, or exit? (addbook/add/view/search/exit): ', (answer) => {
        if (answer.toLowerCase() === 'addbook') {
            promptForNewAddressBook();
        } else if (answer.toLowerCase() === 'add') {
            promptForNewContact();
        } else if (answer.toLowerCase() === 'view') {
            promptForViewContacts();
        } else if (answer.toLowerCase() === 'search') {
            promptForSearchContacts();
        } else if (answer.toLowerCase() === 'exit') {
            rl.close();
        } else {
            console.log('Invalid option. Please try again.');
            promptForAction();
        }
    });
}

promptForAction();
