import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dtos/create-article-dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: createArticleDto,
    });
  }

  async findAll() {
    return this.prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        likeCount: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        likeCount: true,
      },
    });
  }

  async likeButton(articleId: number, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existingLike = await tx.like.findUnique({
        where: {
          articleId_userId: {
            articleId,
            userId,
          },
        },
      });

      if (existingLike) {
        return;
      } else {
        await tx.like.create({
          data: {
            articleId,
            userId,
          },
        });

        const updatedArticle = await tx.article.update({
          where: { id: articleId },
          data: { likeCount: { increment: 1 } },
          select: {
            likeCount: true,
          },
        });

        return {
          liked: true,
          likeCount: updatedArticle.likeCount,
        };
      }
    });
  }
}
