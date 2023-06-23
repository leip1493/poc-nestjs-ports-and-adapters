import { UserCreatorRequest } from 'src/user/application/user-creator/UserCreatorRequest';

export class CreateUserDto implements Omit<UserCreatorRequest, 'id'> {
  name: string;
  
  email: string;
}
