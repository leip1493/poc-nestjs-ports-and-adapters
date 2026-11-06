import { UserCreatorRequest } from '../../application/user-creator/UserCreatorRequest';

export class CreateUserDto implements Omit<UserCreatorRequest, 'id'> {
  name: string;

  email: string;
}
