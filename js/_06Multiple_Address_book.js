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
    return AddressBook;
}());
var AddressBookSystem = /** @class */ (function () {
    function AddressBookSystem() {
        this.addressBooks = new Map();
    }
    AddressBookSystem.prototype.addAddressBook = function (name) {
        if (!this.addressBooks.has(name)) {
            this.addressBooks.set(name, new AddressBook());
            console.log("Address book '".concat(name, "' added successfully."));
        }
        else {
            console.log("Address book with name '".concat(name, "' already exists."));
        }
    };
    AddressBookSystem.prototype.getAddressBook = function (name) {
        return this.addressBooks.get(name);
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
function promptForAction() {
    rl.question('Do you want to add a new address book? (yes/no): ', function (answer) {
        if (answer.toLowerCase() === 'yes') {
            promptForNewAddressBook();
        }
        else {
            rl.close();
        }
    });
}
promptForNewAddressBook();
