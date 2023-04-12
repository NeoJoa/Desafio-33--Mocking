export default class Users {
  constructor(dao) {
    this.dao = dao;
  }

  async post(user) {
    return await this.dao.post(user);
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getBy(param) {
    return await this.dao.getBy(param);
  }

  async putBy(param, object) {
    return await this.dao.putBy(param, object);
  }

  async deleteBy(param) {
    return await this.dao.deleteBy(param);
  }
}
