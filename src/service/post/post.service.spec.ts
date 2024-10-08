import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostConnectionName } from '../../utils/ConstantValue';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostSummary } from '../../entity/PostSummary';
import { SearchService } from '../search/search.service';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: SearchService,
          useValue: {
            tfidfMap: new Map([
              ['topic1', { documents: [{__key: "xx"}] }],
              ['topic2', { documents: [{__key: "xx"}] }],
            ]),
            getTfidf: jest.fn().mockReturnValue({ documents: [{__key:"id"}] }),
          },
        },
        {
          provide: getRepositoryToken(PostSummary, PostConnectionName),
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 'id',
              title: 'title',
              verdict: 'verdict',
              topics: ['topics'],
              commentCount: 10,
              resolved_verdict: 'resolved_verdict',
              selftext: 'selftext',
              YTA: 0,
              NTA: 0,
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
    expect(topicList[0].topic).toBe('topic1');
    expect(topicList[0].count).toBe(1);
    expect(topicList[1].topic).toBe('topic2');
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
      commentCount: 10,
      resolved_verdict: 'resolved_verdict',
      selftext: 'selftext',
      YTA: 0,
      NTA: 0,
    });
  });
});
