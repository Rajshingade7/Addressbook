import * as  readline from 'readline';
const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});
rl.question('Enter something',(answer)=>{
    console.log('your anse',answer);
    rl.close();
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
    ) {
        console.log("Hello Guys!! Welcome to addressbook")

    }
}

class Addressbook{
    public contacts:Contact[]= [];

    public addContact(contact:Contact){
    this.contacts.push(contact); 
}
public viewContacts():void
{
    this.contacts.forEach(contact=>console.log(contact));
}}
let contact=new Contact("raj","shingade","Jai Bhavani nagar","Aurangabad","Maharashtra","232323","9878789064","raj@shignade.com");
let addressBook=new Addressbook();
addressBook.addContact(contact);
addressBook.viewContacts();












