import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  getAll(@Query('artist') artistId?: string) {
    if (artistId) {
      return this.albumModel
        .find({ artist: artistId })
        .populate('artist', 'title');
    }

    return this.albumModel.find().populate('artist', 'title');
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById(id).populate('artist');

    if (!album) {
      throw new NotFoundException('No such album');
    }

    return album;
  }

  @UseGuards(TokenAuthGuard, AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.albumModel.deleteOne({ _id: id });

    if (!result) {
      throw new NotFoundException('No such album found to delete');
    }

    return { message: 'Album deleted successfully' };
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/albums' }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      artist: albumData.artist,
      title: albumData.title,
      releaseYear: albumData.releaseYear,
      image: file ? '/uploads/albums' + file.filename : null,
    });

    return album.save();
  }
}
