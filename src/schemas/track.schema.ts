import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './album.schema';

@Schema()
export class Track {
  @Prop({ ref: Album.name, required: true })
  album: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  number: number;

  @Prop()
  duration: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

TrackSchema.index({ album: 1, number: 1 }, { unique: true });

export type TrackDocument = Track & Document;
