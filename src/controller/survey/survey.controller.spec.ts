import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { QuestionDto } from '../../module/survey/question.dto';

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
    expect(controller.getQuestion({ studyId:"1" })).toEqual([
      new QuestionDto({
        id: "xxxxx",
        title: "Survey Title 1",
        selftext: "Survey Question 1"
      }),
      new QuestionDto({
        id: "xxxxe",
        title: "Survey Title 2",
        selftext: "Survey Question 2"
      }),
      new QuestionDto({
        id: "xxxxr",
        title: "Survey Title 3",
        selftext: "Survey Question 3"
      })]);
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
