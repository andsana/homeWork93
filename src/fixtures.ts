import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Artist } from './schemas/artist.schema';
import { User } from './schemas/user.schema';
import * as crypto from 'crypto';
import { Album } from './schemas/album.schema';
import { Track } from './schemas/track.schema';

@Injectable()
export class FixturesService {
  constructor(
    @InjectConnection() private readonly db: Connection,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Artist.name) private readonly artistModel: Model<Artist>,
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
    @InjectModel(Track.name) private readonly trackModel: Model<Album>,
  ) {}

  async dropCollection(collectionName: string) {
    try {
      await this.db.dropCollection(collectionName);
    } catch (e) {
      console.log(`Collection ${collectionName} was missing, skipping drop...`);
    }
  }

  async run() {
    const collections = ['artists', 'albums', 'tracks', 'users'];

    for (const collectionName of collections) {
      await this.dropCollection(collectionName);
    }

    const [nirvana, linkinPark] = await this.artistModel.create(
      {
        title: 'Nirvana',
        image: 'fixtures/nirvana.jpg',
        information: 'Rock',
      },
      {
        title: 'Linkin Park',
        image: 'fixtures/linkin-park.jpg',
        information: 'Rock',
      },
    );

    const [nevermind, inUtero, meteora] = await this.albumModel.create(
      {
        artist: nirvana,
        title: 'Nevermind',
        releaseYear: 1991,
        image: 'fixtures/nevermind.jpg',
      },
      {
        artist: nirvana,
        title: 'In Utero',
        releaseYear: 1993,
        image: 'fixtures/in-utero.jpg',
      },
      {
        artist: linkinPark,
        title: 'Meteora',
        releaseYear: 2007,
        image: 'fixtures/meteora.jpg',
      },
    );

    await this.trackModel.create([
      {
        album: nevermind,
        number: 1,
        title: 'Smells Like Teen Spirit',
        duration: '5:01',
        link: 'https://www.youtube.com/watch?v=hTWKbfoikeg',
      },
      {
        album: nevermind,
        number: 2,
        title: 'In Bloom',
        duration: '4:14',
      },
      {
        album: nevermind,
        number: 3,
        title: 'Come as You Are',
        duration: '3:38',
      },
      {
        album: nevermind,
        number: 4,
        title: 'Breed',
        duration: '3:03',
      },
      {
        album: nevermind,
        number: 5,
        title: 'Lithium',
        duration: '4:16',
      },
      {
        album: inUtero,
        number: 1,
        title: 'Serve the Servants',
        duration: '3:36',
      },
      {
        album: inUtero,
        number: 2,
        title: 'Scentless Apprentice',
        duration: '3:48',
      },
      {
        album: inUtero,
        number: 3,
        title: 'Heart-Shaped Box',
        duration: '4:41',
      },
      {
        album: inUtero,
        number: 4,
        title: 'Rape Me',
        duration: '2:50',
      },
      {
        album: inUtero,
        number: 5,
        title: 'Frances Farmer Will Have Her Revenge on Seattle',
        duration: '4:09',
      },
      {
        album: meteora,
        number: 1,
        title: "Don't Stay",
        duration: '3:16',
      },
      {
        album: meteora,
        number: 2,
        title: 'Somewhere I Belong',
        duration: '4:09',
      },
      {
        album: meteora,
        number: 3,
        title: 'Lying from You',
        duration: '2:57',
      },
      {
        album: meteora,
        number: 4,
        title: 'Faint',
        duration: '3:41',
      },
      {
        album: meteora,
        number: 5,
        title: 'Breaking the Habit',
        duration: '4:15',
      },
    ]);

    await this.userModel.create(
      {
        email: 'test@test.com',
        password: '123',
        token: crypto.randomUUID(),
        displayName: 'user',
        role: 'user',
      },
      {
        email: 'admin@admin.com',
        password: '1',
        token: crypto.randomUUID(),
        displayName: 'admin',
        role: 'admin',
      },
    );
  }
}
