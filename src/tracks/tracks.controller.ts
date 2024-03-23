import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';
import { Track, TrackDocument } from '../schemas/track.schema';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  getAll(@Query('album') albumId?: string) {
    if (albumId) {
      return this.trackModel
        .find({ album: albumId })
        .populate('album', 'title');
    }

    return this.trackModel.find().populate('album', 'title');
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const track = await this.trackModel.findById(id).populate('album');

    if (!track) {
      throw new NotFoundException('No such track');
    }

    return track;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.trackModel.deleteOne({ _id: id });

    if (!result) {
      throw new NotFoundException('No such track found to delete');
    }

    return { message: 'Track deleted successfully' };
  }

  @Post()
  async create(@Body() trackDto: CreateTrackDto) {
    return await this.trackModel.create({
      album: trackDto.album,
      title: trackDto.title,
      duration: trackDto.duration,
      number: trackDto.number,
    });
  }
}
