import * as bcrypt from 'bcrypt';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength, IsInt } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@ObjectType()
@Entity()
export class CommentCore extends CoreEntity {
  @Column()
  @Field(() => String)
  @MaxLength(20, { message: '닉네임은 20자 이내로 입력해주세요.' })
  @MinLength(1, { message: '닉네임은 2글자 이상으로 입력해주세요' })
  @IsString()
  nickname: string;

  @Column({ select: false })
  @Field(() => String)
  @MaxLength(20, { message: '비밀번호는 20자 이내로 입력해주세요.' })
  @MinLength(1, { message: '비밀번호는 2글자 이상으로 입력해주세요' })
  @IsString()
  password: string;

  @Column()
  @Field(() => String)
  @MaxLength(5000, { message: '댓글 내용은 5000자 이내로 입력해주세요.' })
  @MinLength(1, { message: '댓글 내용은 2글자 이상으로 입력해주세요' })
  @IsString()
  content: string;

  @Column({ default: 0 })
  @Field(() => Number)
  @IsInt()
  likes: number;

  @Column({ default: 0 })
  @Field(() => Number)
  @IsInt()
  dislikes: number;

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
