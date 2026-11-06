import { Exception } from './Exception';

/** A value breaks a domain rule. Mapped to HTTP 400. */
export class InvalidArgument extends Exception {}
