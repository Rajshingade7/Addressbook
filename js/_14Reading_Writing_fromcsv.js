"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var fs = require("fs");
var csv_writer_1 = require("csv-writer");
var csvParser = require("csv-parser");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var Contact = /** @class */ (function () {
    function Contact(firstName, lastName, address, city, state, zip, phone, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phone = phone;
        this.email = email;
    }
    Contact.prototype.toString = function () {
        return "".concat(this.firstName, " ").concat(this.lastName, ", ").concat(this.address, ", ").concat(this.city, ", ").concat(this.state, ", ").concat(this.zip, ", ").concat(this.phone, ", ").concat(this.email);
    };
    return Contact;
}());
var AddressBook = /** @class */ (function () {
    function AddressBook() {
        this.contacts = [];
    }
    AddressBook.prototype.addContact = function (contact) {
        this.contacts.push(contact);
    };
    AddressBook.prototype.viewContacts = function () {
        this.contacts.forEach(function (contact) { return console.log(contact.toString()); });
    };
    AddressBook.prototype.searchContactsByCityOrState = function (cityOrState) {
        var filteredContacts = this.contacts.filter(function (contact) { return contact.city === cityOrState || contact.state === cityOrState; });
        var cityCount = this.contacts.reduce(function (count, contact) { return contact.city === cityOrState ? count + 1 : count; }, 0);
        var stateCount = this.contacts.reduce(function (count, contact) { return contact.state === cityOrState ? count + 1 : count; }, 0);
        return { contacts: filteredContacts, cityCount: cityCount, stateCount: stateCount };
    };
    AddressBook.prototype.sortContactsByName = function () {
        this.contacts.sort(function (a, b) {
            var nameA = "".concat(a.firstName, " ").concat(a.lastName).toLowerCase();
            var nameB = "".concat(b.firstName, " ").concat(b.lastName).toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    };
    AddressBook.prototype.sortContactsbycity = function () {
        this.contacts.sort(function (a, b) {
            var nameA = "".concat(a.city).toLowerCase();
            var nameB = "".concat(b.city).toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    };
    AddressBook.prototype.writeToFile = function (filePath) {
        var data = this.contacts.map(function (contact) { return contact.toString(); }).join('\n');
        fs.writeFile(filePath, data, 'utf8', function (err) {
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Address book written to file successfully.');
        });
    };
    AddressBook.prototype.readFromFile = function (filePath) {
        var _this = this;
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            var lines = data.split('\n');
            lines.forEach(function (line) {
                var _a = line.split(','), firstName = _a[0], lastName = _a[1], address = _a[2], city = _a[3], state = _a[4], zip = _a[5], phone = _a[6], email = _a[7];
                var contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
                _this.addContact(contact);
            });
            console.log('Address book loaded from file successfully.');
        });
    };
    AddressBook.prototype.writeToCsv = function (filePath) {
        var csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: filePath,
            header: ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone', 'email']
        });
        csvWriter.writeRecords(this.contacts)
            .then(function () { return console.log('Address book written to CSV file successfully.'); })
            .catch(function (error) { return console.error('Error writing to CSV file:', error); });
    };
    AddressBook.prototype.readFromCsv = function (filePath) {
        var _this = this;
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', function (data) {
            var firstName = data.firstName, lastName = data.lastName, address = data.address, city = data.city, state = data.state, zip = data.zip, phone = data.phone, email = data.email;
            var contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
            _this.addContact(contact);
        })
            .on('end', function () {
            console.log('Address book loaded from CSV file successfully.');
        })
            .on('error', function (error) {
            console.error('Error reading CSV file:', error);
        });
    };
    return AddressBook;
}());
var AddressBookSystem = /** @class */ (function () {
    function AddressBookSystem() {
        this.addressBooks = {};
        this.cityToPersons = {};
        this.stateToPersons = {};
    }
    AddressBookSystem.prototype.addAddressBook = function (name) {
        if (!this.addressBooks[name]) {
            this.addressBooks[name] = new AddressBook();
            console.log("Address book '".concat(name, "' added successfully."));
        }
        else {
            console.log("Address book with name '".concat(name, "' already exists."));
        }
    };
    AddressBookSystem.prototype.getAddressBook = function (name) {
        return this.addressBooks[name];
    };
    AddressBookSystem.prototype.getAddressBookbycity = function (city) {
        return this.addressBooks[city];
    };
    AddressBookSystem.prototype.searchContactsByCityOrState = function (cityOrState) {
        var _a, _b;
        var contacts = [];
        for (var addressBookName in this.addressBooks) {
            if (Object.prototype.hasOwnProperty.call(this.addressBooks, addressBookName)) {
                var addressBook = this.addressBooks[addressBookName];
                contacts.push.apply(contacts, addressBook.searchContactsByCityOrState(cityOrState).contacts);
            }
        }
        var cityCount = ((_a = this.cityToPersons[cityOrState]) === null || _a === void 0 ? void 0 : _a.length) || 0;
        var stateCount = ((_b = this.stateToPersons[cityOrState]) === null || _b === void 0 ? void 0 : _b.length) || 0;
        return { contacts: contacts, cityCount: cityCount, stateCount: stateCount };
    };
    AddressBookSystem.prototype.addToCityDictionary = function (contact) {
        if (!this.cityToPersons[contact.city]) {
            this.cityToPersons[contact.city] = [contact];
        }
        else {
            this.cityToPersons[contact.city].push(contact);
        }
    };
    AddressBookSystem.prototype.addToStateDictionary = function (contact) {
        if (!this.stateToPersons[contact.state]) {
            this.stateToPersons[contact.state] = [contact];
        }
        else {
            this.stateToPersons[contact.state].push(contact);
        }
    };
    AddressBookSystem.prototype.viewPersonsByCity = function (city) {
        var persons = this.cityToPersons[city];
        if (persons) {
            console.log("Persons in ".concat(city, ":"));
            persons.forEach(function (person) { return console.log(person.toString()); });
        }
        else {
            console.log("No persons found in ".concat(city, "."));
        }
    };
    AddressBookSystem.prototype.viewPersonsByState = function (state) {
        var persons = this.stateToPersons[state];
        if (persons) {
            console.log("Persons in ".concat(state, ":"));
            persons.forEach(function (person) { return console.log(person.toString()); });
        }
        else {
            console.log("No persons found in ".concat(state, "."));
        }
    };
    return AddressBookSystem;
}());
var addressBookSystem = new AddressBookSystem();
function promptForNewAddressBook() {
    rl.question('Enter name for the new address book: ', function (name) {
        addressBookSystem.addAddressBook(name);
        promptForAction();
    });
}
function promptForNewContact() {
    rl.question('Enter name of the address book to add the contact: ', function (name) {
        var addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            promptForContactDetails(addressBook);
        }
        else {
            console.log("Address book with name '".concat(name, "' does not exist."));
            promptForAction();
        }
    });
}
function promptForContactDetails(addressBook) {
    rl.question('Enter First Name: ', function (firstName) {
        rl.question('Enter Last Name: ', function (lastName) {
            rl.question('Enter Address: ', function (address) {
                rl.question('Enter City: ', function (city) {
                    rl.question('Enter State: ', function (state) {
                        rl.question('Enter Zip: ', function (zip) {
                            rl.question('Enter Phone: ', function (phone) {
                                rl.question('Enter Email: ', function (email) {
                                    var contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
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
    rl.question('Enter the name of the address book to view contacts: ', function (name) {
        var addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            addressBook.viewContacts();
        }
        else {
            console.log("Address book with name '".concat(name, "' does not exist."));
        }
        promptForAction();
    });
}
function promptForSearchContacts() {
    rl.question('Enter city or state to search contacts: ', function (cityOrState) {
        var _a = addressBookSystem.searchContactsByCityOrState(cityOrState), contacts = _a.contacts, cityCount = _a.cityCount, stateCount = _a.stateCount;
        if (contacts.length > 0) {
            console.log('Search results:');
            contacts.forEach(function (contact) { return console.log(contact); });
            console.log("Count by City: ".concat(cityCount));
            console.log("Count by State: ".concat(stateCount));
        }
        else {
            console.log('No contacts found in the specified city or state.');
        }
        promptForAction();
    });
}
function promptForViewPersonsByCity() {
    rl.question('Enter city to view persons: ', function (city) {
        addressBookSystem.viewPersonsByCity(city);
        promptForAction();
    });
}
function promptForViewPersonsByState() {
    rl.question('Enter state to view persons: ', function (state) {
        addressBookSystem.viewPersonsByState(state);
        promptForAction();
    });
}
function promptForSortContactsByName() {
    rl.question('Enter the name of the address book to sort contacts by name: ', function (name) {
        var addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            addressBook.sortContactsByName();
            console.log("Contacts in address book '".concat(name, "' sorted successfully."));
        }
        else {
            console.log("Address book with name '".concat(name, "' does not exist."));
        }
        promptForAction();
    });
}
function promptForsortcontactbycity() {
    rl.question('Enter the name of address book to sort contact by city', function (city) {
        var addressBook = addressBookSystem.getAddressBookbycity(city);
        if (addressBook) {
            addressBook.sortContactsbycity();
            console.log("Contacts in address book '".concat(city, "'sorted successfully."));
        }
        else {
            console.log("Address book with name '".concat(city, "' does not exist."));
        }
        promptForAction();
    });
}
function promptForWriteToFile() {
    rl.question('Enter the name of the address book to write to file: ', function (name) {
        var addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            rl.question('Enter file path to write: ', function (filePath) {
                addressBook.writeToFile(filePath);
                promptForAction();
            });
        }
        else {
            console.log("Address book with name '".concat(name, "' does not exist."));
            promptForAction();
        }
    });
}
function promptForReadFromFile() {
    rl.question('Enter the name of the address book to read from file: ', function (name) {
        var addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            rl.question('Enter file path to read: ', function (filePath) {
                addressBook.readFromFile(filePath);
                promptForAction();
            });
        }
        else {
            console.log("Address book with name '".concat(name, "' does not exist."));
            promptForAction();
        }
    });
}
function promptForWriteToCsv() {
    rl.question('Enter the name of the address book to write to CSV file: ', function (name) {
        var addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            rl.question('Enter CSV file path to write: ', function (filePath) {
                addressBook.writeToCsv(filePath);
                promptForAction();
            });
        }
        else {
            console.log("Address book with name '".concat(name, "' does not exist."));
            promptForAction();
        }
    });
}
function promptForReadFromCsv() {
    rl.question('Enter the name of the address book to read from CSV file: ', function (name) {
        var addressBook = addressBookSystem.getAddressBook(name);
        if (addressBook) {
            rl.question('Enter CSV file path to read: ', function (filePath) {
                addressBook.readFromCsv(filePath);
                promptForAction();
            });
        }
        else {
            console.log("Address book with name '".concat(name, "' does not exist."));
            promptForAction();
        }
    });
}
function promptForAction() {
    rl.question('Do you want to add a new address book, add a new contact, view contacts, search contacts, view persons by city, view persons by state, sort contacts by name,sort by city, write to file, read from file, or exit? (addbook/add/view/search/viewcity/viewstate/sort/exit/sortbycity/write/read/writetocsv/readfromcsv): ', function (answer) {
        if (answer.toLowerCase() === 'addbook') {
            promptForNewAddressBook();
        }
        else if (answer.toLowerCase() === 'add') {
            promptForNewContact();
        }
        else if (answer.toLowerCase() === 'view') {
            promptForViewContacts();
        }
        else if (answer.toLowerCase() === 'search') {
            promptForSearchContacts();
        }
        else if (answer.toLowerCase() === 'viewcity') {
            promptForViewPersonsByCity();
        }
        else if (answer.toLowerCase() === 'viewstate') {
            promptForViewPersonsByState();
        }
        else if (answer.toLowerCase() === 'sort') {
            promptForSortContactsByName();
        }
        else if (answer.toLowerCase() === 'sortbycity') {
            promptForsortcontactbycity();
        }
        else if (answer.toLowerCase() === 'write') {
            promptForWriteToFile();
        }
        else if (answer.toLowerCase() === 'read') {
            promptForReadFromFile();
        }
        else if (answer.toLowerCase() === 'writetocsv') {
            promptForWriteToCsv();
        }
        else if (answer.toLowerCase() === 'readfromcsv') {
            promptForReadFromCsv();
        }
        else if (answer.toLowerCase() === 'exit') {
            rl.close();
        }
        else {
            console.log('Invalid option. Please try again.');
            promptForAction();
        }
    });
}
promptForAction();
