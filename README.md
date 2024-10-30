# Article Like Feature - NestJS & Prisma

A lightweight implementation of an article system with "Like" button functionality built with NestJS, Prisma, and PostgreSQL. This implementation provides article creation, retrieval, and like functionality.

## Features

- 📝 Article creation and retrieval
- 👍 One-click like functionality
- 🔢 Like count tracking
- ⚡ Optimized database queries
- 🎯 Simple REST API endpoints

## Tech Stack

- **Backend**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **API**: RESTful endpoints

## Database Schema

```prisma
model Article {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  likes     Like[]
  likeCount Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Like {
  id        Int      @id @default(autoincrement())
  articleId Int
  article   Article  @relation(fields: [articleId], references: [id])
  userId    String
  createdAt DateTime @default(now())

  @@unique([articleId, userId])
  @@index([articleId])
}
```

## API Endpoints

### Create Article

```
POST /articles
```

Request body:

```json
{
  "title": "Article Title",
  "content": "Article Content"
}
```

### Get All Articles

```
GET /articles
```

Returns all articles with their like counts.

### Get Single Article

```
GET /articles/:id
```

Returns a specific article with its like count.

### Toggle Like

```
PUT /articles/:id/like
```

Request body:

```json
{
  "userId": "user123"
}
```

Toggles like status for the specified user on an article.

## Project Structure

```
src/
├── articles/
│   ├── dtos/
│   │   └── create-article-dto.ts
│   ├── articles.controller.ts
│   ├── articles.service.ts
│   └── articles.module.ts
└── prisma/
    └── schema.prisma
```

## Controller Implementation

```typescript
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Put(':id/like')
  likeButton(@Param('id') id: string, @Body('userId') userId: string) {
    return this.articlesService.likeButton(+id, userId);
  }
}
```

## Setup & Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd article-like-feature
```

2. Install dependencies:

```bash
yarn install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

4. Configure your PostgreSQL connection in `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
```

5. Run Prisma migrations:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
yarn start:dev
```



## Performance Considerations

1. **Database Indexing**: The schema includes an index on `articleId` for faster like count queries.
2. **Composite Unique Constraint**: Prevents duplicate likes from the same user.
3. **Efficient Like Counting**: Uses Prisma's built-in count aggregation.

## Security Considerations

1. **Input Validation**: All inputs are validated through DTOs.
2. **Type Safety**: Consistent use of TypeScript types and interfaces.
3. **ID Parsing**: Automatic conversion of string IDs to numbers using the `+` operator.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this in your own projects!
