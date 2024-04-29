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
    return Addressbook;
}());
function promptForContactDetails(addressBook) {
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
                                            promptForContactDetails(addressBook);
                                        }
                                        else {
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
var addressBook = new Addressbook();
promptForContactDetails(addressBook);
