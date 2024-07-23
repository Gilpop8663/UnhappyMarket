import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CheckUsernameInput extends PickType(User, ['username']) {}

@ObjectType()
export class CheckUsernameOutput extends CoreOutput {}
