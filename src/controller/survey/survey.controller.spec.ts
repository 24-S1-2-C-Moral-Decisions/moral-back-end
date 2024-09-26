import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from '../../service/survey.service';
import { Answers, mockAnswer, mockAnswersModel } from '../../schemas/answers.shcemas';
import {ValidationPipe} from '@nestjs/common';
import { StudyIdDto } from '../../module/survey/studyId.dto';
import { getModelToken } from '@nestjs/mongoose';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '../../entity/Question';

const mockQuestion: Question = {
  _id: "atcfwx",
  title: "AITA for asking my sister to dye her hair a “normal” color?",
  selftext:
    "I’m getting married, beautiful white dress and venue. Expensive photos. Everything I wish for, but...My sister (who is in my bridal party) has BRIGHT blue hair. I don’t want that to be where people’s eyes go when they are at my ceremony nor in all of my photos. I’m spending so much time and money on a beautiful neutral colored ceremony, she would stick out like a rose in a desert. Thanks for your thoughts.",
  very_certain_YA: 0.853658536585366,
  very_certain_NA: 0.264705882352941,
  YA_percentage: 0.55952380952381,
  NA_percentage: 0.440476190476191,
  original_post_YA_top_reasonings: [
    "YAC'mon OP, don't be *that* bride.",
    "YA. Your sisters hair is part of who she is and asking her to change part of who she is for one day is a dick move. ",
    "YA. Your sister isn't taking anything away from you by having colorful hair. People aren't going to be so obsessed with the color that they don't see you. ",
  ],
  original_post_NA_top_reasonings: [
    "NA.  Can you have the photos photoshopped instead?  May be easier than this drama.  ",
    "NA you are not the asshole for asking, as long as you can graciously accept a “no, I don’t want to” as an answer. ",
    "NA - If you've asked and she said yes, don't feel bad. If you still feel guilty though, maybe offer to pay for her to get her hair done a different color?",
  ],
  count: [0, 1, 0, 0, 0]
};

describe('SurveyController', () => {
  let controller: SurveyController;
  // let QuestionModel: Model<Question>;
  // let AnswersModel: Model<Answers>;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        SurveyService,
        {
          provide: getModelToken(Answers.name, "survey"),
          useValue: mockAnswersModel,
        },
        {
          provide: getRepositoryToken(Question, "survey"),
          useValue: {
            aggregate: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue([mockQuestion])
            }),
            updateOne: jest.fn().mockResolvedValue(mockQuestion),
          },
        },
      ]
    })
    .compile();

    controller = module.get<SurveyController>(SurveyController);
    // QuestionModel = module.get<Model<Question>>('QuestionModel');
    // AnswersModel = module.get<Model<Answers>>('AnswersModel');
    validationPipe = new ValidationPipe({ transform: true, validateCustomDecorators: true });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQuestion', () => {
    it('should return a question', async () => {
      const expectData = mockQuestion;
      const actuall = await controller.getQuestion({ studyId:1 });
      expect(actuall).toEqual(expectData);
    });

    it('should throw BadRequestException for studyId 6', async () => {
      await expect(validationPipe.transform({ studyId: 6 }, { type: 'query', metatype: StudyIdDto }))
          .rejects.toThrow('Bad Request Exception');
    });

    it('should throw BadRequestException for studyId 0', async () => {
      await expect(validationPipe.transform({ studyId: 0 }, { type: 'query', metatype: StudyIdDto }))
          .rejects.toThrow('Bad Request Exception');
    });
  });

  describe('postAnswers', () => {
    it('should return question id', async () => {
      const actuall = await controller.postAnswers(mockAnswer);
      expect(actuall).toEqual(mockAnswer.id.toString());
    });
  });

  describe('getAnswersById', () => {
    it('should return answers', async () => {
      const actuall = await controller.getAnswersById(mockAnswer.id);
      expect(actuall).toEqual(mockAnswer);
    });

    // invalid answerId
    it ('should return null', async () => {
      expect(await controller.getAnswersById({ id: 'xxx' })).toBeNull();
    });
  });
});