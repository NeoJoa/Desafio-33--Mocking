export default class ClientUser {
  constructor(backendUser) {
    this.firstName = backendUser.firstName;
    this.lastName = backendUser.lastName;
    this.fullName = `${backendUser.firstName} ${backendUser.lastName}`;
    this.email = backendUser.email;
    this.age = backendUser.age;
  }
}
