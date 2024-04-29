import * as readline from 'readline';
import * as fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import * as csvParser from 'csv-parser';

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

    public toString(): string {
        return `${this.firstName} ${this.lastName}, ${this.address}, ${this.city}, ${this.state}, ${this.zip}, ${this.phone}, ${this.email}`;
    }
}

class AddressBook {
    private contacts: Contact[] = [];

    public addContact(contact: Contact): void {
        this.contacts.push(contact);
    }

    public viewContacts(): void {
        this.contacts.forEach(contact => console.log(contact.toString()));
    }

    public searchContactsByCityOrState(cityOrState: string): { contacts: Contact[], cityCount: number, stateCount: number } {
        const filteredContacts = this.contacts.filter(contact => contact.city === cityOrState || contact.state === cityOrState);
        const cityCount = this.contacts.reduce((count, contact) => contact.city === cityOrState ? count + 1 : count, 0);
        const stateCount = this.contacts.reduce((count, contact) => contact.state === cityOrState ? count + 1 : count, 0);
        return { contacts: filteredContacts, cityCount, stateCount };
    }

    public sortContactsByName(): void {
        this.contacts.sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    }
    public sortContactsbycity(): void {
        this.contacts.sort((a, b) => {
            const nameA = `${a.city}`.toLowerCase();
            const nameB = `${b.city}`.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    }
    public writeToFile(filePath: string): void {
        const data = this.contacts.map(contact => contact.toString()).join('\n');
        fs.writeFile(filePath, data, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Address book written to file successfully.');
        });
    }
    public readFromFile(filePath: string): void {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            const lines = data.split('\n');
            lines.forEach(line => {
                const [firstName, lastName, address, city, state, zip, phone, email] = line.split(',');
                const contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
                this.addContact(contact);
            });
            console.log('Address book loaded from file successfully.');
        });
    }
    public writeToCsv(filePath: string): void {
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone', 'email']
        });
        
        csvWriter.writeRecords(this.contacts)
            .then(() => console.log('Address book written to CSV file successfully.'))
            .catch((error:Error) => console.error('Error writing to CSV file:', error));
    }

    public readFromCsv(filePath: string): void {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data: any) => {
                const { firstName, lastName, address, city, state, zip, phone, email } = data;
                const contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
                this.addContact(contact);
            })
            .on('end', () => {
                console.log('Address book loaded from CSV file successfully.');
            })
            .on('error', (error: any) => {
                console.error('Error reading CSV file:', error);
            });
    }
    public readFromJson(filePath: string): void {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                return;
            }
            try {
                const jsonData: { firstName: string; lastName: string; address: string; city: string; state: string; zip: string; phone: string; email: string; }[] = JSON.parse(data);
                jsonData.forEach((contactData) => {
                    const { firstName, lastName, address, city, state, zip, phone, email } = contactData;
                    const contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
                    this.addContact(contact);
                });
                console.log('Address book loaded from JSON file successfully.');
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        });
    }
    
    public writeToJson(filePath: string): void {
        const jsonData: any[] = [];
        for (const addressBookName in addressBookSystem.addressBooks) {
            if (Object.prototype.hasOwnProperty.call(addressBookSystem.addressBooks, addressBookName)) {
                const addressBook = addressBookSystem.addressBooks[addressBookName];
                addressBook.contacts.forEach((contact: Contact) => { // Explicit type annotation for 'contact'
                    jsonData.push({
                        firstName: contact.firstName,
                        lastName: contact.lastName,
                        address: contact.address,
                        city: contact.city,
                        state: contact.state,
                        zip: contact.zip,
                        phone: contact.phone,
                        email: contact.email
                    });
                });
            }
        }
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
                return;
            }
            console.log('Address book saved as JSON file successfully.');
        });
    }
    
    
        
    
}

class AddressBookSystem {
    public addressBooks: { [name: string]: AddressBook } = {};
    private cityToPersons: { [city: string]: Contact[] } = {};
    private stateToPersons: { [state: string]: Contact[] } = {};

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
    public getAddressBookbycity(city: string): AddressBook | undefined {
        return this.addressBooks[city];
    }

    public searchContactsByCityOrState(cityOrState: string): { contacts: Contact[], cityCount: number, stateCount: number } {
        const contacts: Contact[] = [];
        for (const addressBookName in this.addressBooks) {
            if (Object.prototype.hasOwnProperty.call(this.addressBooks, addressBookName)) {
                const addressBook = this.addressBooks[addressBookName];
                contacts.push(...addressBook.searchContactsByCityOrState(cityOrState).contacts);
            }
        }
        const cityCount = this.cityToPersons[cityOrState]?.length || 0;
        const stateCount = this.stateToPersons[cityOrState]?.length || 0;
        return { contacts, cityCount, stateCount };
    }

    public addToCityDictionary(contact: Contact): void {
        if (!this.cityToPersons[contact.city]) {
            this.cityToPersons[contact.city] = [contact];
        } else {
            this.cityToPersons[contact.city].push(contact);
        }
    }

    public addToStateDictionary(contact: Contact): void {
        if (!this.stateToPersons[contact.state]) {
            this.stateToPersons[contact.state] = [contact];
        } else {
            this.stateToPersons[contact.state].push(contact);
        }
    }

    public viewPersonsByCity(city: string): void {
        const persons = this.cityToPersons[city];
        if (persons) {
            console.log(`Persons in ${city}:`);
            persons.forEach(person => console.log(person.toString()));
        } else {
            console.log(`No persons found in ${city}.`);
        }
    }

    public viewPersonsByState(state: string): void {
        const persons = this.stateToPersons[state];
        if (persons) {
            console.log(`Persons in ${state}:`);
            persons.forEach(person => console.log(person.toString()));
        } else {
            console.log(`No persons found in ${state}.`);
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
                                    addressBookSystem.addToCityDictionary(contact);
                                    addressBookSystem.addToStateDictionary(contact);
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
        const { contacts, cityCount, stateCount } = addressBookSystem.searchContactsByCityOrState(cityOrState);
        if (contacts.length > 0) {
            console.log('Search results:');
            contacts.forEach(contact => console.log(contact));
            console.log(`Count by City: ${cityCount}`);
            console.log(`Count by State: ${stateCount}`);
        } else {
            console.log('No contacts found in the specified city or state.');
        }
        promptForAction();
    });
}

function promptForViewPersonsByCity() {
    rl.question('Enter city to view persons: ', (city) => {
        addressBookSystem.viewPersonsByCity(city);
        promptForAction();
    });
}

function promptForViewPersonsByState() {
    rl.question('Enter state to view persons: ', (state) => {
        addressBookSystem.viewPersonsByState(state);
        promptForAction();
    });
}

function promptForSortContactsByName() {
    rl.question('Enter the name of the address book to sort contacts by name: ', (name) => {
        const addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            addressBook.sortContactsByName();
            console.log(`Contacts in address book '${name}' sorted successfully.`);
        } else {
            console.log(`Address book with name '${name}' does not exist.`);
        }
        promptForAction();
    });
}
function promptForsortcontactbycity(){
    rl.question('Enter the name of address book to sort contact by city',(city)=>{
        const addressBook=addressBookSystem.getAddressBookbycity(city);
        if(addressBook){
            addressBook.sortContactsbycity();
            console.log(`Contacts in address book '${city}'sorted successfully.`);
        }
        else{
            console.log(`Address book with name '${city}' does not exist.`);
        }
        promptForAction();
    })
}
function promptForWriteToFile() {
    rl.question('Enter the name of the address book to write to file: ', (name) => {
        const addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            rl.question('Enter file path to write: ', (filePath) => {
                addressBook.writeToFile(filePath);
                promptForAction();
            });
        } else {
            console.log(`Address book with name '${name}' does not exist.`);
            promptForAction();
        }
    });
}
function promptForReadFromFile() {
    rl.question('Enter the name of the address book to read from file: ', (name) => {
        const addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            rl.question('Enter file path to read: ', (filePath) => {
                addressBook.readFromFile(filePath);
                promptForAction();
            });
        } else {
            console.log(`Address book with name '${name}' does not exist.`);
            promptForAction();
        }
    });
}
function promptForWriteToCsv() {
    rl.question('Enter the name of the address book to write to CSV file: ', (name) => {
        const addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            rl.question('Enter CSV file path to write: ', (filePath) => {
                addressBook.writeToCsv(filePath);
                promptForAction();
            });
        } else {
            console.log(`Address book with name '${name}' does not exist.`);
            promptForAction();
        }
    });
}
function promptForReadFromCsv() {
    rl.question('Enter the name of the address book to read from CSV file: ', (name) => {
        const addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            rl.question('Enter CSV file path to read: ', (filePath) => {
                addressBook.readFromCsv(filePath);
                promptForAction();
            });
        } else {
            console.log(`Address book with name '${name}' does not exist.`);
            promptForAction();
        }
    });
}

function promptForAction() {
    rl.question('Do you want to add a new address book, add a new contact, view contacts, search contacts, view persons by city, view persons by state, sort contacts by name,sort by city, write to file, read from file, or exit? (addbook/add/view/search/viewcity/viewstate/sort/exit/sortbycity/write/read/writetocsv/readfromcsv): ', (answer) => {
        if (answer.toLowerCase() === 'addbook') {
            promptForNewAddressBook();
        } else if (answer.toLowerCase() === 'add') {
            promptForNewContact();
        } else if (answer.toLowerCase() === 'view') {
            promptForViewContacts();
        } else if (answer.toLowerCase() === 'search') {
            promptForSearchContacts();
        } else if (answer.toLowerCase() === 'viewcity') {
            promptForViewPersonsByCity();
        } else if (answer.toLowerCase() === 'viewstate') {
            promptForViewPersonsByState();
        } else if (answer.toLowerCase() === 'sort') {
            promptForSortContactsByName();
        } else if(answer.toLowerCase()==='sortbycity'){
            promptForsortcontactbycity();
        }else if (answer.toLowerCase() === 'write') {
            promptForWriteToFile();
        } else if (answer.toLowerCase() === 'read') {
            promptForReadFromFile();
        } else if (answer.toLowerCase() === 'writetocsv') {
            promptForWriteToCsv();
        } else if (answer.toLowerCase() === 'readfromcsv') {
            promptForReadFromCsv();
        }
         else if (answer.toLowerCase() === 'exit') {
            rl.close();
        } else {
            console.log('Invalid option. Please try again.');
            promptForAction();
        }
    });
}

promptForAction();
