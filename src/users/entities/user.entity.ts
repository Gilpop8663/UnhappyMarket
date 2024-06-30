import * as bcrypt from 'bcrypt';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  Unique,
} from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { IsAlpha, IsEmail, IsNumber, Length } from 'class-validator';
import { Saga } from 'src/sagas/entities/saga.entity';
import { Like } from 'src/likes/entities/like.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
@Unique(['userId', 'email', 'nickname'])
export class User extends CoreEntity {
  @Column()
  @Field(() => String)
  @Length(2, 20)
  @IsAlpha()
  userId: string;

  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @Length(8, 64)
  password: string;

  @Column({ default: 3000 })
  @Field(() => Number)
  @IsNumber()
  point: number;

  @Column()
  @Field(() => String)
  @Length(2, 20)
  nickname: string;

  @Column({ default: false })
  @Field(() => Boolean)
  verified: boolean;

  @Field(() => [Saga])
  @OneToMany(() => Saga, (saga) => saga.author)
  sagas: Saga[];

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(password: string) {
    try {
      const ok = await bcrypt.compare(password, this.password);

      return ok;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}