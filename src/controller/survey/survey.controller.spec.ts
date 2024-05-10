import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from '../../service/survey.service';
import { QuestionDto } from '../../module/survey/question.dto';
import { Question } from '../../schemas/question.schemas';
import { StudyIdDto } from '../../module/survey/studyId.dto';
import { HttpException } from '@nestjs/common';

const question: Question = {
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

const answer = {
  prolificId: "prolific-id-1",
  studyId: 1,
  answers: {
    questionId: 'atcfwx',
    individualAnswer: {
      isAsshole: true,
      rating: 5
    },
    groupAnswer: {
      isAsshole: true,
      rating: 5
    },
    comments: 'This is a comment',
  },
  comments: 'This is a comment',
  time: 123456000123
};

describe('SurveyController', () => {
  let controller: SurveyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController]
    })
    .useMocker((token) => {
      if (token === SurveyService) {
        return {
          findQuestion: jest.fn<Promise<Question>, [StudyIdDto]>().mockImplementation(async (studyId) => {
            if (studyId.studyId < 0 || studyId.studyId > 5) 
              throw new Error('studyId should be a number');
            return Promise.resolve(question);
          }),
          createAnswers: jest
            .fn<Promise<string>, [QuestionDto]>()
            .mockImplementation(() => {
              return Promise.resolve('success');
            })
        }
      }
    })
    .compile();

    controller = module.get<SurveyController>(SurveyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQuestion', () => {
    it('should return a question', async () => {
      const expectData = question;
      const actuall = await controller.getQuestion({ studyId:1 });
      expect(actuall).toEqual(expectData);
    });

    // invalid studyId
    it ('should return error msg "studyId should be a number"', async () => {
      await expect(controller.getQuestion({ studyId:6 })).rejects.toThrow(HttpException);
    });
  });

  describe('postAnswers', () => {
    it('should return success', async () => {
      const expectData = 'success';
      const actuall = await controller.postAnswers(answer);
      expect(actuall).toEqual(expectData);
    });
  });
});