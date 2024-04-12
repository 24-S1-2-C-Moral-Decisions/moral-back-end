import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';

describe('SurveyController', () => {
  let controller: SurveyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a Survey Id', () => {
    expect(typeof controller.getSurveyId({ surveyType:1 })).toBe('number');
  });

  // out of range
  it('should return error msg "surveyType must not be greater than 3"', () => {
    try {
      controller.getSurveyId({ surveyType:4 });
    }
    catch (e) {
      expect(e.response.status).toBe(400);
      expect(e.response.msg).toBe('surveyType must not be greater than 3');
    }
  });

  // empty
  it('should return error msg "surveyType should not be empty"', () => {
    try {
      controller.getSurveyId({ surveyType:null });
    }
    catch (e) {
      expect(e.response.status).toBe(400);
      expect(e.response.msg).toBe('surveyType should not be empty');
    }
  });
});
