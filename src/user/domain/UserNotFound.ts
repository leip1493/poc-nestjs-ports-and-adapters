import { NotFound } from '@/shared/domain/exceptions/NotFound';
import { UserId } from './UserId';

export class UserNotFound extends NotFound {
  constructor(id: UserId) {
    super(`User <${id.value}> not found`);
  }
}
