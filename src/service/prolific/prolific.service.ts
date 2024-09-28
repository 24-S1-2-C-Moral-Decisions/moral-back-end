import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prolific } from '../../entity/Prolific';
import { Repository } from 'typeorm';
import { SurveyConnectionName } from '../../utils/ConstantValue';

@Injectable()
export class ProlificService {
    constructor(
        @InjectRepository(Prolific, SurveyConnectionName) private prolificRepository: Repository<Prolific>,
    ) { }

    async createOrUpdate(prolificId: string, prolificData: Partial<Prolific>): Promise<Prolific> {
        return this.findProlificById(prolificId).then((res) => {
            if (!res) {
                res = this.createProlific(prolificData);
                return this.prolificRepository.save(res);
            }
            else {
                res = this.prolificRepository.merge(res, prolificData);
                this.prolificRepository.update(res._id, res);
                return res;
            }
        });
    }

    async findProlificById(id: string): Promise<Prolific> {
        return this.prolificRepository.findOneBy({ prolificId: id });
    }

    createProlific(prolific: Partial<Prolific>): Prolific {
        return this.prolificRepository.create(prolific);
    }
}
