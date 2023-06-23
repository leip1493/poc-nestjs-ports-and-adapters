import { Exception } from './Exception';

export class InvalidArgument extends Exception {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
