import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById(id);

    if (!artist) {
      throw new NotFoundException('No such artist');
    }
    return artist;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.artistModel.deleteOne({ _id: id });

    if (!result) {
      throw new NotFoundException('No such artist found to delete');
    }
    return { message: 'Artist deleted successfully' };
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/artists' }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistData: CreateArtistDto,
  ) {
    const artist = new this.artistModel({
      title: artistData.title,
      information: artistData.information,
      image: file ? '/uploads/artists/' + file.filename : null,
    });
    return artist.save();
  }
}
