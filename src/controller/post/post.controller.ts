import { Controller, Get, Query, Param, HttpException, HttpStatus } from "@nestjs/common";
import { PostService } from "../../service/post/post.service";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { CacheService } from "../../service/cache/cache.service";
import { Type } from "class-transformer";
import { ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { PostSummary } from "../../entity/PostSummary";

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

  @Get(":id")
  @ApiTags("post")
  @ApiOkResponse({
    description: "成功获取帖子详情",
    type: PostSummary,
    schema: {
      example: {
        id: "123",
        title: "帖子标题",
        selftext: "帖子内容",
        verdict: "YTA",
        YTA: 150,
        NTA: 50,
        commentCount: 200,
        topics: ["道德", "生活"]
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: "无效的帖子ID",
    schema: {
      example: {
        status: 400,
        error: "无效的帖子ID",
        message: "帖子ID格式不正确"
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: "帖子不存在",
    schema: {
      example: {
        status: 404,
        error: "帖子不存在",
        message: "未找到ID为 123 的帖子"
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: "服务器内部错误",
    schema: {
      example: {
        status: 500,
        error: "服务器内部错误",
        message: "数据库查询失败"
      }
    }
  })
  async getPostById(@Param("id") id: string) {
    try {
      const post = await this.postService.getPostById(id);
      if (!post) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: "帖子不存在",
            message: `未找到ID为 ${id} 的帖子`
          },
          HttpStatus.NOT_FOUND
        );
      }
      return post;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "服务器内部错误",
          message: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
