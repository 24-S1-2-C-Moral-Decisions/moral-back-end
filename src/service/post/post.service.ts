import { Injectable } from "@nestjs/common";
import { PostConnectionName } from "../../utils/ConstantValue";
import { PostSummary } from "../../entity/PostSummary";
import { SearchService } from "../search/search.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PostService {
  private readonly MIN_COMMENTS = 1000;
  constructor(
    @InjectRepository(PostSummary, PostConnectionName)
    private postSummaryRepository: Repository<PostSummary>,
    private searchService: SearchService
  ) {}

  async getTopicList() {
    return Promise.all(
      Array.from(this.searchService.tfidfMap).map(async ([topic, tfidf]) => {
        return {
          topic,
          count: tfidf.documents.length,
        };
      })
    ).then((data) => {
      return data.sort((a, b) => b.count - a.count);
    });
  }

  async getPostsOrderedByComments(
    pageSize: number = 10,
    page: number = 0
  ): Promise<PostSummary[]> {
    console.log(
      `🔍 PostService: 查询参数 - pageSize: ${pageSize}, page: ${page}, MIN_COMMENTS: ${this.MIN_COMMENTS}`
    );

    try {
      // 使用与getPostsByTopic完全相同的方法，但获取更多帖子
      console.log("🔍 使用与ALL posts相同的查询模式...");

      const ids: string[] = [];
      const documents = this.searchService.getTfidf("all").documents;

      // 获取所有帖子的ID
      for (let index = 0; index < documents.length; index++) {
        ids.push(documents[index].__key as unknown as string);
      }

      console.log(`📊 获取到 ${ids.length} 个帖子ID`);

      // 获取所有帖子的详细信息
      const allPosts = await Promise.all(
        ids.map(async (id) => {
          return this.postSummaryRepository.findOne({
            where: { id: id },
          });
        })
      );

      // 过滤掉null结果
      const validPosts = allPosts.filter((post) => post !== null);
      console.log(`📊 有效帖子数量: ${validPosts.length}`);

      // 过滤出评论数超过阈值的帖子
      const hotPosts = validPosts.filter(
        (post) => post.commentCount > this.MIN_COMMENTS
      );

      console.log(`📊 过滤后热门帖子数量: ${hotPosts.length}`);

      // 按评论数排序
      hotPosts.sort((a, b) => b.commentCount - a.commentCount);

      // 分页
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const pagePosts = hotPosts.slice(startIndex, endIndex);

      console.log(`📊 当前页返回数量: ${pagePosts.length}`);
      if (pagePosts.length > 0) {
        console.log(
          `📝 第一个结果 - ID: ${pagePosts[0].id}, commentCount: ${pagePosts[0].commentCount}`
        );
      }

      return pagePosts;
    } catch (error) {
      console.error("❌ PostService: 查询出错:", error);
      throw error;
    }
  }

  async getPostsByTopic(
    topic: string,
    pageSize: number = 10,
    page: number = 0
  ): Promise<PostSummary[]> {
    const ids: string[] = [];
    const documents = this.searchService.getTfidf(topic).documents;
    for (
      let index = pageSize * page;
      index < pageSize * page + pageSize && index < documents.length;
      index++
    ) {
      ids.push(documents[index].__key as unknown as string);
    }

    const res = Promise.all(
      ids.map(async (id) => {
        return this.postSummaryRepository.findOne({
          where: {
            id: id,
          },
        });
      })
    );

    return res;
  }

  async getPostById(id: string): Promise<PostSummary | null> {
    try {
      console.log(`🔍 PostService: 查询帖子ID: ${id}`);
      const post = await this.postSummaryRepository.findOne({
        where: { id: id },
      });

      if (post) {
        console.log(
          `📊 PostService: 找到帖子 - ID: ${post.id}, 标题: ${post.title}`
        );
      } else {
        console.log(`❌ PostService: 未找到帖子ID: ${id}`);
      }

      return post;
    } catch (error) {
      console.error(`❌ PostService: 查询帖子ID ${id} 时出错:`, error);
      throw error;
    }
  }
}
