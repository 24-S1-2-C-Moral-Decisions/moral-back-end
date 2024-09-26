import { Test, TestingModule } from "@nestjs/testing";
import { SurveyService } from "./survey.service";
import { getModelToken } from "@nestjs/mongoose";
import { cloneDeep } from 'lodash';
import { Answers, mockAnswer, mockAnswersModel } from "../schemas/answers.shcemas";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mockQuestion, Question } from "../entity/Question";

describe("SurveyService", () => {
  let service: SurveyService;
  // let AnsModel: Model<Answers>;
  // let QuestionModel: Model<Question>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    it("should throw an error if decisionMaking is undefined", async () => {
      const data = cloneDeep(mockAnswer);
      await expect(service.createAnswers({ ...data, decisionMaking: undefined })).rejects.toThrow("Decision making results are required");
    });

    it("should throw an error if decisionMaking length is not 25", async () => {
      const data = cloneDeep(mockAnswer);
      await expect(service.createAnswers({ ...data, decisionMaking: [1] })).rejects.toThrow("Decision making array must have 25 items");
    });

    it("should throw an error if decisionMaking value is not between 1 and 5", async () => {
      const data = cloneDeep(mockAnswer);
      data.decisionMaking[0] = 0;
      await expect(service.createAnswers(data)).rejects.toThrow("The value of Decision making question must between [1,5]");
    });

    it("should throw an error if personalityChoice is undefined", async () => {
      await expect(service.createAnswers({ ...mockAnswer, personalityChoice: undefined })).rejects.toThrow("Personality choice results are required");
    });

    it("should throw an error if personalityChoice length is not 15", async () => {
      const data = cloneDeep(mockAnswer);
      await expect(service.createAnswers({ ...data, personalityChoice: [1] })).rejects.toThrow("Personality choice array must have 15 items");
    });

    it("should throw an error if personalityChoice value is not between 1 and 5", async () => {
      const data = cloneDeep(mockAnswer);
      data.personalityChoice[0] = 0;
      await expect(service.createAnswers(data)).rejects.toThrow("The value of Personality choice question must between [1,5]");
    });
  });
});
