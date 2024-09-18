import { Test, TestingModule } from "@nestjs/testing";
import { SurveyService } from "./survey.service";
import { Question } from "../schemas/question.schemas";
import { getModelToken } from "@nestjs/mongoose";
import { Answers } from "../schemas/answers.shcemas";
import { cloneDeep } from 'lodash';

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
  answer: {
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
  decisionMaking: [
    1,2,3,4,5,
    1,2,3,4,5,
    1,2,3,4,5,
    1,2,3,4,5,
    1,2,3,4,5
  ],
  personalityChoice: [
    1,2,3,4,5,
    1,2,3,4,5,
    1,2,3,4,5
  ],
  comments: 'This is a comment',
  time: 123456000123
};

describe("SurveyService", () => {
  let service: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyService],
    })
      .useMocker((token) => {
        if (token === getModelToken(Question.name)) {
          return {
            findOne: () => {
              return {
                sort: () => {
                  return {
                    exec: jest.fn().mockResolvedValue({ ...question, save: jest.fn()}),
                  };
                },
              };
            },
          };
        } else if (token === getModelToken(Answers.name)) {
          return {
            create: jest.fn(),
            save: jest.fn(),
          };
        }
      })
      .compile();

    service = module.get<SurveyService>(SurveyService);
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
      }).toEqual(question);
    });
  });

  describe("createAnswers", () => {
    it("should save the answers", async () => {
      const result = await service.createAnswers(answer);
      expect(result).toBe("success");
    });

    it("should throw an error if decisionMaking is undefined", async () => {
      const data = cloneDeep(answer);
      await expect(service.createAnswers({ ...data, decisionMaking: undefined })).rejects.toThrow("Decision making results are required");
    });

    it("should throw an error if decisionMaking length is not 25", async () => {
      const data = cloneDeep(answer);
      await expect(service.createAnswers({ ...data, decisionMaking: [1] })).rejects.toThrow("Decision making array must have 25 items");
    });

    it("should throw an error if decisionMaking value is not between 1 and 5", async () => {
      const data = cloneDeep(answer);
      data.decisionMaking[0] = 0;
      await expect(service.createAnswers(data)).rejects.toThrow("The value of Decision making question must between [1,5]");
    });

    it("should throw an error if personalityChoice is undefined", async () => {
      await expect(service.createAnswers({ ...answer, personalityChoice: undefined })).rejects.toThrow("Personality choice results are required");
    });

    it("should throw an error if personalityChoice length is not 15", async () => {
      const data = cloneDeep(answer);
      await expect(service.createAnswers({ ...data, personalityChoice: [1] })).rejects.toThrow("Personality choice array must have 15 items");
    });

    it("should throw an error if personalityChoice value is not between 1 and 5", async () => {
      const data = cloneDeep(answer);
      data.personalityChoice[0] = 0;
      await expect(service.createAnswers(data)).rejects.toThrow("The value of Personality choice question must between [1,5]");
    });
  });
});
