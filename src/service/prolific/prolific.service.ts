import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prolific } from '../../schemas/prolific.shcemas';
import { Model } from 'mongoose';
import { ProlificDto } from '../../module/survey/prolific.dto';

@Injectable()
export class ProlificService {
    constructor(
        @InjectModel(Prolific.name) private prolificModel: Model<Prolific>
    ) { }

    async createOrUpdate(prolific: ProlificDto): Promise<ProlificDto> {
        return await Promise.resolve(this.prolificModel.findOneAndUpdate({ id: prolific.id }, prolific, { upsert: true, new: true }));
    }

    async findProlificById(id: string): Promise<ProlificDto> {
        return await this.prolificModel.findOne({ id: id }).then((res) => {
            return res;
        });
    }
}
