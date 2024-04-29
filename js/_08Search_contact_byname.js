"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
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
        this.contacts.forEach(function (contact) { return console.log(contact); });
    };
    AddressBook.prototype.searchContactsByCityOrState = function (cityOrState) {
        return this.contacts.filter(function (contact) { return contact.city === cityOrState || contact.state === cityOrState; });
    };
    return AddressBook;
}());
var AddressBookSystem = /** @class */ (function () {
    function AddressBookSystem() {
        this.addressBooks = {};
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
    AddressBookSystem.prototype.searchContactsByCityOrState = function (cityOrState) {
        var contacts = [];
        for (var addressBookName in this.addressBooks) {
            if (Object.prototype.hasOwnProperty.call(this.addressBooks, addressBookName)) {
                var addressBook = this.addressBooks[addressBookName];
                contacts.push.apply(contacts, addressBook.searchContactsByCityOrState(cityOrState));
            }
        }
        return contacts;
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
        var contacts = addressBookSystem.searchContactsByCityOrState(cityOrState);
        if (contacts.length > 0) {
            console.log('Search results:');
            contacts.forEach(function (contact) { return console.log(contact); });
        }
        else {
            console.log('No contacts found in the specified city or state.');
        }
        promptForAction();
    });
}
function promptForAction() {
    rl.question('Do you want to add a new address book, add a new contact, view contacts, search contacts, or exit? (addbook/add/view/search/exit): ', function (answer) {
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
