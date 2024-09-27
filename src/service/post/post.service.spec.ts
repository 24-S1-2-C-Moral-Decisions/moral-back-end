import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostConnectionName, PostSummaryCollectionName } from '../../utils/ConstantValue';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getDataSourceToken(PostConnectionName),
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              databaseConnection: {
                db: jest.fn().mockReturnValue({
                  listCollections: jest.fn().mockReturnValue({
                    toArray: jest.fn().mockResolvedValue([
                      { name: 'topic1' },
                      { name: 'topic2' },
                    ]),
                  }),
                  collection: jest.fn().mockImplementation((name) => {
                    return {
                      countDocuments: jest.fn().mockImplementation(() => {
                        if (name === PostSummaryCollectionName) throw new Error('Error');
                        return 1;
                      }),
                      find: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                          toArray: jest.fn().mockResolvedValue([
                            {
                              id: 'id',
                              title: 'title',
                              verdict: 'verdict',
                              topics: ['topics'],
                              num_comments: 'num_comments',
                              resolved_verdict: 'resolved_verdict',
                              selftext: 'selftext',
                              YTA: 0,
                              NTA: 0,
                            }
                          ]),
                        }),
                      }),
                    }
                  }),
                }),
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should return topic list", async () => {
    const topicList = await service.getTopicList();
    expect(topicList).toBeDefined();
    expect(topicList).toHaveLength(2);
    expect(topicList[0].name).toBe('topic1');
    expect(topicList[0].count).toBe(1);
    expect(topicList[1].name).toBe('topic2');
    expect(topicList[1].count).toBe(1);
  });

  it("should return posts by topic", async () => {
    const posts = await service.getPostsByTopic('topic1');
    expect(posts).toBeDefined();
    expect(posts).toHaveLength(1);
    expect(posts[0]).toEqual({
      id: 'id',
      title: 'title',
      verdict: 'verdict',
      topics: ['topics'],
      num_comments: 'num_comments',
      resolved_verdict: 'resolved_verdict',
      selftext: 'selftext',
      YTA: 0,
      NTA: 0,
    });
  });
});
