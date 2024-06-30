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
import { SolapiMessageService } from 'solapi';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    userId,
    email,
    password,
    nickname,
  }: CreateAccountInput): Promise<{
    ok: boolean;
    error?: string;
  }> {
    try {
      const existEmail = await this.users.findOne({ where: { email } });
      const existUserId = await this.users.findOne({ where: { userId } });
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

      const newUser = this.users.create({ userId, email, password, nickname });

      const user = await this.users.save(newUser);

      const newVerification = this.verifications.create({ user });
      const verification = await this.verifications.save(newVerification);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '아이디 생성에 실패했습니다.' };
    }
  }

  async login({ userId, password }: LoginInput) {
    try {
      const user = await this.users.findOne({
        where: {
          userId,
        },
        select: ['password'],
      });

      if (!user) {
        return {
          ok: false,
          error: '입력한 이메일이 존재하지 않습니다.',
        };
      }

      const isPasswordCorrect = await user.checkPassword(password);

      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 맞지 않습니다.',
        };
      }

      const token = this.jwtService.sign(user.id);

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return { ok: false, error: '로그인에 실패했습니다.' };
    }
  }

  async findById(id: number) {
    try {
      const user = await this.users.findOne({
        where: {
          id,
        },
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
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({
        where: {
          id: userId,
        },
      });

      if (email) {
        user.email = email;
        user.verified = false;

        const newVerification = this.verifications.create({ user });
        const verification = await this.verifications.save(newVerification);
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

  async verifyPhone(code: string): Promise<VerifyEmailOutput> {
    try {
      const messageService = new SolapiMessageService(
        process.env.SOLAPI_API_KEY,
        process.env.SOLAPI_API_SECRET_KEY,
      );

      //번호도용문자 차단 서비스 해지 (내 번호가 아니면 인증이 어려움)
      messageService.send({
        to: '01092355209',
        from: '01057111519',
        text: '[당신의불행을삽니다] 인증번호는 [$$$]를 입력해주세요.',
      });

      return { ok: false, error: '휴대폰 검증에 실패했습니다.' };
    } catch (error) {
      return { ok: false, error };
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
        this.users.save(verification.user);

        return { ok: true };
      }

      return { ok: false, error: '이메일 검증에 실패했습니다.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
