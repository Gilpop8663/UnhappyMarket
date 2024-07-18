import { Global, Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmallTalk } from 'src/small-talks/entities/small-talk.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';
import { User } from 'src/users/entities/user.entity';
import { Purchase } from './entities/purchase.entity';
import { PurchaseResolver } from './purchase.resolver';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SmallTalk, Episode, User, Purchase])],
  providers: [PurchaseService, PurchaseResolver],
  exports: [PurchaseService],
})
export class PurchaseModule {}
