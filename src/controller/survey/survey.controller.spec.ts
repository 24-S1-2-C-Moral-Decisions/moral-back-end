import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from '../../service/survey.service';
import { Question } from '../../schemas/question.schemas';
import { StudyIdDto } from '../../module/survey/studyId.dto';

jest.mock('../../service/survey.service');
describe('SurveyController', () => {
  let controller: SurveyController;
  let service: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [SurveyService]
    }).compile();

    controller = module.get<SurveyController>(SurveyController);

    service = module.get<SurveyService>(SurveyService);
    jest.spyOn(service, 'findQuestions').mockImplementation((dto: StudyIdDto) => { return Question.mockQuestions(dto, 3);});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a question', () => {
    const expectData = Question.mockQuestions({ studyId:"1" }, 3);
    expect(controller.getQuestion({ studyId:"1" })).toEqual(expectData);
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
