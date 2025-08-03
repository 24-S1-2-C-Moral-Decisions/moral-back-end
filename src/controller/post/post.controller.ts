import { Controller, Get, Query } from "@nestjs/common";
import { PostService } from "../../service/post/post.service";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { CacheService } from "../../service/cache/cache.service";
import { Type } from "class-transformer";

const HotPostsCacheKey = "hotPosts";

class Pageing {
  @ApiProperty({
    name: "pageSize",
    required: false,
    description: "The number of posts per page",
    example: 10,
  })
  @Type(() => Number)
  pageSize: number;

  @ApiProperty({
    name: "page",
    required: false,
    description: "The page number",
    example: 0,
  })
  @Type(() => Number)
  page: number;
}

@Controller("post")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly cacheService: CacheService
  ) {}

  @Get("topics")
  @ApiTags("post")
  async getTopicList() {
    const cacheKey = "topicList";
    const cachedData = await this.cacheService.getCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const newData = this.postService.getTopicList();
    newData.then((data) => {
      this.cacheService.setCache(cacheKey, data);
    });
    return newData;
  }

  @Get("hotPosts")
  @ApiTags("post")
  async getOrderedPosts(@Query() body: Pageing = { pageSize: 10, page: 0 }) {
    console.log(
      `🔍 Controller: 收到hotPosts请求 - pageSize: ${body.pageSize}, page: ${body.page}`
    );

    const cachedData = await this.cacheService.getCache(
      HotPostsCacheKey + "_" + body.pageSize + "_" + body.page
    );

    if (cachedData) {
      console.log("📊 Controller: 返回缓存数据");
      return cachedData;
    }

    console.log("🔍 Controller: 调用PostService查询数据");
    const data = await this.postService.getPostsOrderedByComments(
      body.pageSize,
      body.page
    );
    console.log(`📊 Controller: PostService返回数据数量: ${data.length}`);

    this.cacheService.setCache(
      HotPostsCacheKey + "_" + body.pageSize + "_" + body.page,
      data
    );
    return data;
  }

  @ApiTags("cache")
  @Get("clearCache")
  async clearCache() {
    await this.cacheService.clearCache();
    return "Cache cleared";
  }

  @Get("test")
  @ApiTags("post")
  async testConnection() {
    console.log("🔍 测试数据库连接...");
    try {
      const result = await this.postService.getPostsOrderedByComments(1, 0);
      console.log(`📊 测试查询结果: ${result.length}`);
      return {
        success: true,
        count: result.length,
        data: result,
      };
    } catch (error) {
      console.error("❌ 测试查询失败:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
