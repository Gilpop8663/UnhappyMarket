import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';

@InputType()
export class CreateVideoInput {
  @Column()
  @Field(() => String)
  @IsString()
  videoUrl: string;
}

@ObjectType()
export class CreateVideoOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  videoId: number;
}
