export class ResourceInterface {
  create: (...args) => any;
  update: (...args) => any;
  findAll: (...args) => any;
  findOne: (...args) => any;
  remove: (...args) => any;
}
