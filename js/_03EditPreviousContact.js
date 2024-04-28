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
var Addressbook = /** @class */ (function () {
    function Addressbook() {
        this.contacts = [];
    }
    Addressbook.prototype.addContact = function (contact) {
        this.contacts.push(contact);
    };
    Addressbook.prototype.viewContacts = function () {
        this.contacts.forEach(function (contact) { return console.log(contact); });
    };
    Addressbook.prototype.findContactByName = function (firstName, lastName) {
        return this.contacts.find(function (contact) { return contact.firstName === firstName && contact.lastName === lastName; });
    };
    Addressbook.prototype.editContact = function (firstName, lastName) {
        var contact = this.findContactByName(firstName, lastName);
        if (contact) {
            rl.question('Enter new address: ', function (address) {
                rl.question('Enter new city: ', function (city) {
                    rl.question('Enter new state: ', function (state) {
                        rl.question('Enter new zip: ', function (zip) {
                            rl.question('Enter new phone: ', function (phone) {
                                rl.question('Enter new email: ', function (email) {
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
        }
        else {
            console.log('Contact not found.');
            promptForEdit();
        }
    };
    return Addressbook;
}());
var addressBook = new Addressbook();
function promptForContactDetails() {
    rl.question('Enter first name: ', function (firstName) {
        rl.question('Enter last name: ', function (lastName) {
            rl.question('Enter address: ', function (address) {
                rl.question('Enter city: ', function (city) {
                    rl.question('Enter state: ', function (state) {
                        rl.question('Enter zip: ', function (zip) {
                            rl.question('Enter phone: ', function (phone) {
                                rl.question('Enter email: ', function (email) {
                                    var contact = new Contact(firstName, lastName, address, city, state, zip, phone, email);
                                    addressBook.addContact(contact);
                                    rl.question('Do you want to add another contact? (yes/no): ', function (answer) {
                                        if (answer.toLowerCase() === 'yes') {
                                            promptForContactDetails();
                                        }
                                        else {
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
    rl.question('Enter first name of the contact you want to edit: ', function (firstName) {
        rl.question('Enter last name of the contact you want to edit: ', function (lastName) {
            addressBook.editContact(firstName, lastName);
        });
    });
}
promptForContactDetails();
