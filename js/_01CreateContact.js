"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Addressbook = void 0;
var Addressbook = /** @class */ (function () {
    function Addressbook(firstname, lastname, address, city, state, zip, phonenumber, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phonenumber = phonenumber;
        this.email = email;
        console.log("Hello Guys!! Welcome to addressbook");
    }
    return Addressbook;
}());
exports.Addressbook = Addressbook;
var firstrecord = new Addressbook('Raj', "Shingade", "cidco,Aurangabad", "Aurangabad", "Maharashtra", 1234, 9834567890, "raj@gmail.com");
