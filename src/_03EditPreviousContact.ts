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

class Addressbook {
    public contacts: Contact[] = [];

    public addContact(contact: Contact) {
        this.contacts.push(contact);
    }

    public viewContacts(): void {
        this.contacts.forEach(contact => console.log(contact));
    }

    public findContactByName(firstName: string, lastName: string): Contact | undefined {
        return this.contacts.find(contact => contact.firstName === firstName && contact.lastName === lastName);
    }

    public editContact(firstName: string, lastName: string) {
        const contact = this.findContactByName(firstName, lastName);
        if (contact) {
            rl.question('Enter new address: ', (address) => {
                rl.question('Enter new city: ', (city) => {
                    rl.question('Enter new state: ', (state) => {
                        rl.question('Enter new zip: ', (zip) => {
                            rl.question('Enter new phone: ', (phone) => {
                                rl.question('Enter new email: ', (email) => {
                                    contact.address = address;
                                    contact.city = city;
                                    contact.state = state;
                                    contact.zip = zip;
                                    contact.phone = phone;
                                    contact.email = email;
                                    console.log('Contact details updated successfully.');
                                    promptForEdit(); // After updating, prompt again for further actions
                                });
                            });
                        });
                    });
                });
            });
        } else {
            console.log('Contact not found.');
            promptForEdit(); 
        }
    }
}

let addressBook = new Addressbook();

function promptForContactDetails() {
    rl.question('Enter first name: ', (firstName) => {
        rl.question('Enter last name: ', (lastName) => {
            rl.question('Enter address: ', (address) => {
                rl.question('Enter city: ', (city) => {
                    rl.question('Enter state: ', (state) => {
                        rl.question('Enter zip: ', (zip) => {
                            rl.question('Enter phone: ', (phone) => {
                                rl.question('Enter email: ', (email) => {
                                    const contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
                                    addressBook.addContact(contact);
                                    rl.question('Do you want to add another contact? (yes/no): ', (answer) => {
                                        if (answer.toLowerCase() === 'yes') {
                                            promptForContactDetails();
                                        } else {
                                            rl.close();
                                            addressBook.viewContacts();
                                            promptForEdit(); // After adding contacts, prompt for editing
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

function promptForEdit() {
    rl.question('Enter first name of the contact you want to edit: ', (firstName) => {
        rl.question('Enter last name of the contact you want to edit: ', (lastName) => {
            addressBook.editContact(firstName, lastName);
        });
    });
}

promptForContactDetails();
