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

  it('should return a question', () => {
    expect(typeof controller.getQuestion({ studyId:"1" })).toBe({
      id: "1",
      title: "Survey Title 1",
      text: "Survey Question 1"
    });
  });

  // no studyId
  it('should return error msg "studyId should not be empty"', () => {
    try {
      controller.getQuestion({ studyId:null });
    }
    catch (e) {
      expect(e.response.status).toBe(400);
      expect(e.response.msg).toBe('studyId should not be empty');
    }

    try {
      controller.getQuestion({ studyId:undefined });
    }
    catch (e) {
      expect(e.response.status).toBe(400);
      expect(e.response.msg).toBe('studyId should not be empty');
    }
  });
});
