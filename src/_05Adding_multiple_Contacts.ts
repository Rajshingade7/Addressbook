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
    private contacts: Contact[] = [];

    public addContact(contact: Contact) {
        this.contacts.push(contact);
    }

    public viewContacts(): void {
        this.contacts.forEach(contact => console.log(contact));
    }
}

function promptForContactDetails(addressBook: Addressbook) {
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
                                            promptForContactDetails(addressBook);
                                        } else {
                                            rl.close();
                                            addressBook.viewContacts();
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

const addressBook = new Addressbook();

promptForContactDetails(addressBook);
