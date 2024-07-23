import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { UserProfileInput } from './dtos/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    username,
    email,
    password,
    nickname,
  }: CreateAccountInput): Promise<{
    ok: boolean;
    error?: string;
  }> {
    try {
      const existEmail = await this.users.findOne({ where: { email } });
      const existUserId = await this.users.findOne({
        where: { username },
      });
      const existNickname = await this.users.findOne({ where: { nickname } });

      if (existEmail) {
        return { ok: false, error: '이미 존재하는 이메일입니다.' };
      }

      if (existUserId) {
        return { ok: false, error: '이미 존재하는 아이디입니다.' };
      }

      if (existNickname) {
        return { ok: false, error: '이미 존재하는 닉네임입니다.' };
      }

      const newUser = this.users.create({
        username,
        email,
        password,
        nickname,
      });

      await this.users.save(newUser);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '아이디 생성에 실패했습니다.' };
    }
  }

  async login({ username, password }: LoginInput) {
    try {
      const user = await this.users.findOne({
        where: {
          username,
        },
        select: ['password'],
      });

      if (!user) {
        return {
          ok: false,
          error: '입력한 아이디가 존재하지 않습니다.',
        };
      }

      const isPasswordCorrect = await user.checkPassword(password);

      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 맞지 않습니다.',
        };
      }

      const token = this.jwtService.sign({ id: user.id });

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return { ok: false, error: '로그인에 실패했습니다.' };
    }
  }

  async getUserProfile({ userId }: UserProfileInput) {
    try {
      const user = await this.users.findOne({
        where: {
          id: userId,
        },
        relations: ['sagas', 'interests', 'likes', 'comments'],
      });

      if (!user) {
        throw new Error();
      }

      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: '유저를 찾지 못했습니다.',
      };
    }
  }

  async editProfile(
    userId: number,
    { nickname, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({
        where: {
          id: userId,
        },
      });

      if (nickname) {
        user.nickname = nickname;
      }

      if (password) {
        user.password = password;
      }

      await this.users.save(user);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '프로필 변경에 실패했습니다.' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });

      if (verification) {
        verification.user.verified = true;

        await this.users.update(verification.user.id, { verified: true });
        await this.verifications.delete(verification.id);
        return { ok: true };
      }

      return { ok: false, error: '이메일 검증에 실패했습니다.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
