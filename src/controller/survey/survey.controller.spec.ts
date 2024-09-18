import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from '../../service/survey.service';
import { mockQuestion, mockQuestionModel } from '../../schemas/question.schemas';
import { mockAnswer, mockAnswersModel } from '../../schemas/answers.shcemas';
import { HttpException } from '@nestjs/common';

describe('SurveyController', () => {
  let controller: SurveyController;
  // let QuestionModel: Model<Question>;
  // let AnswersModel: Model<Answers>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        SurveyService,
        {
          provide: 'QuestionModel',
          useValue: mockQuestionModel
        },
        {
          provide: 'AnswersModel',
          useValue: mockAnswersModel
        }
      ]
    })
    .compile();

    controller = module.get<SurveyController>(SurveyController);
    // QuestionModel = module.get<Model<Question>>('QuestionModel');
    // AnswersModel = module.get<Model<Answers>>('AnswersModel');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQuestion', () => {
    it('should return a question', async () => {
      const expectData = mockQuestion;
      const actuall = await controller.getQuestion({ studyId:1 });
      expect(actuall).toEqual({...expectData, save: expect.any(Function)});
    });

    // invalid studyId
    it ('should return error msg "studyId should be a number"', async () => {
      await expect(controller.getQuestion({ studyId:6 })).rejects.toThrow(HttpException);
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