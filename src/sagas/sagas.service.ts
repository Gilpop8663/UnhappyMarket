import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Saga } from './entities/saga.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSagaInput, CreateSagaOutput } from './dtos/create-saga.dto';
import { User } from 'src/users/entities/user.entity';
import { DeleteSagaInput } from './dtos/delete-saga.dto';
import { EditSagaInput, EditSagaOutput } from './dtos/edit-saga.dto';

@Injectable()
export class SagasService {
  constructor(
    @InjectRepository(Saga)
    private sagaRepository: Repository<Saga>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createSaga(sagaData: CreateSagaInput): Promise<CreateSagaOutput> {
    try {
      const author = await this.userRepository.findOne({
        where: { id: sagaData.userId },
      });

      if (!author) {
        return { ok: false, error: '유저를 찾지 못했습니다', sagaId: null };
      }

      const saga = this.sagaRepository.create({ ...sagaData, author });

      await this.sagaRepository.save(saga);

      return { ok: true, sagaId: saga.id };
    } catch (error) {
      return { ok: false, error: '시리즈 생성에 실패했습니다.', sagaId: null };
    }
  }

  async deleteSaga({ sagaId }: DeleteSagaInput) {
    try {
      this.sagaRepository.delete({ id: sagaId });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '시리즈 삭제에 실패했습니다.' };
    }
  }

  async editSaga({
    sagaId,
    description,
    thumbnailUrl,
    title,
  }: EditSagaInput): Promise<EditSagaOutput> {
    try {
      this.sagaRepository.update(sagaId, { title, thumbnailUrl, description });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '시리즈 수정에 실패했습니다.' };
    }
  }

  async getSagaList() {
    return this.sagaRepository.find({
      relations: ['author', 'likes', 'interests'],
    });
  }
}
