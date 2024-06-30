import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { Like, LikeableType } from './entities/like.entity';
import { Repository } from 'typeorm';

describe('LikesService', () => {
  let service: LikesService;
  let repository: Repository<Like>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikesService],
    }).compile();

    service = module.get<LikesService>(LikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('toggleLike', () => {
    it('should like if not already liked', async () => {
      const userId = 1;
      const likeableId = 2;
      const likeableType = LikeableType.SAGA;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue({ id: 1 } as any);
      jest.spyOn(repository, 'save').mockResolvedValue({ id: 1 } as any);

      const result = await service['toggleLike']({
        userId,
        likeableId,
        likeableType,
      });

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId }, likeableId, likeableType },
      });
      expect(repository.create).toHaveBeenCalledWith({
        user: { id: userId },
        likeableId,
        likeableType,
      });
      expect(repository.save).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ ok: true });
    });

    it('should unlike if already liked', async () => {
      const userId = 1;
      const likeableId = 2;
      const likeableType = LikeableType.SAGA;
      const existingLike = { id: 1 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingLike as any);
      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      const result = await service['toggleLike']({
        userId,
        likeableId,
        likeableType,
      });

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId }, likeableId, likeableType },
      });
      expect(repository.delete).toHaveBeenCalledWith(existingLike.id);
      expect(result).toEqual({ ok: true });
    });
  });
});
