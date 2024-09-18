import { Test, TestingModule } from "@nestjs/testing";
import { SurveyService } from "./survey.service";
import { mockQuestion, mockQuestionModel, Question } from "../schemas/question.schemas";
import { getModelToken } from "@nestjs/mongoose";
import { Answers, mockAnswer, mockAnswersModel } from "../schemas/answers.shcemas";

describe("SurveyService", () => {
  let service: SurveyService;
  // let AnsModel: Model<Answers>;
  // let QuestionModel: Model<Question>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getModelToken(Answers.name),
          useValue: mockAnswersModel,
        },
        {
          provide: getModelToken(Question.name),
          useValue: mockQuestionModel,
        },
      ],
    })
      .compile();

    service = module.get<SurveyService>(SurveyService);
    // AnsModel = module.get<Model<Answers>>(getModelToken(Answers.name));
    // QuestionModel = module.get<Model<Question>>(getModelToken(Question.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findQuestion", () => {
    it("should increment the count", async () => {
      const result = await service.findQuestion({ studyId: 1 });
      expect(result.count[1]).toBe(2);
    });

    it("should return a question", async () => {
      const result = await service.findQuestion({ studyId: 1 });
      expect({
        _id: result._id,
        title: result.title,
        selftext: result.selftext,
        very_certain_YA: result.very_certain_YA,
        very_certain_NA: result.very_certain_NA,
        YA_percentage: result.YA_percentage,
        NA_percentage: result.NA_percentage,
        original_post_YA_top_reasonings: result.original_post_YA_top_reasonings,
        original_post_NA_top_reasonings: result.original_post_NA_top_reasonings,
        count: result.count,
      }).toEqual(mockQuestion);
    });
  });

  describe("createAnswers", () => {
    it("should save the answers", async () => {
      const result = await service.createAnswers(mockAnswer);
      expect(result).toBe(mockAnswer.id.toString());
    });
  });

  describe("findAnswersById", () => {
    it("should return the answers", async () => {
      const result = await service.findAnswersById(mockAnswer.id);
      expect(result).toEqual(mockAnswer);
    });

    it("should return null if the answer is not found", async () => {
      const result = await service.findAnswersById({ id: "60f7c72b8f3f5e001f8c84b4" });
      expect(result).toBeNull();
    });

    it("should return null if id is not correct", async () => {
      const result = await service.findAnswersById({ id: "xxx" });
      expect(result).toBeNull();
    });
  });
});
