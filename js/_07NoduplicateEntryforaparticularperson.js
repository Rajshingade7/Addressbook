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
    Contact.prototype.equals = function (other) {
        return this.firstName === other.firstName && this.lastName === other.lastName;
    };
    return Contact;
}());
var AddressBook = /** @class */ (function () {
    function AddressBook() {
        this.contacts = [];
    }
    AddressBook.prototype.addContact = function (contact) {
        var existingContact = this.contacts.find(function (c) { return c.equals(contact); });
        if (!existingContact) {
            this.contacts.push(contact);
            console.log('Contact added successfully.');
        }
        else {
            console.log('Duplicate contact. Contact not added.');
        }
    };
    AddressBook.prototype.viewContacts = function () {
        this.contacts.forEach(function (contact) { return console.log(contact); });
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
function promptForAction() {
    rl.question('Do you want to add a new address book, add a new contact, view contacts, or exit? (addbook/add/view/exit): ', function (answer) {
        if (answer.toLowerCase() === 'addbook') {
            promptForNewAddressBook();
        }
        else if (answer.toLowerCase() === 'add') {
            promptForNewContact();
        }
        else if (answer.toLowerCase() === 'view') {
            promptForViewContacts();
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
promptForAction();
