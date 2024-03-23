import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Artist {
  @Prop({ required: true, unique: true })
  title: string;
  @Prop()
  image: string;
  @Prop()
  information: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
export type ArtistDocument = Artist & Document;
