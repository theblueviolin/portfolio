# Good Morning Generator - Backend

Express.js backend with PostgreSQL database for the Good Morning Message Generator.

## Deployment to Railway

1. **Upload these files** to your GitHub repository
2. **Connect Railway** to your GitHub repo
3. **Add PostgreSQL database** service
4. **Set environment variables:**
   - `DATABASE_URL` (Railway provides this automatically)
   - `SESSION_SECRET` (generate a random string)
   - `PORT` (Railway sets this automatically)

## Local Development

```bash
npm install
npm run dev
```

## Files included:
- Express.js server with TypeScript
- PostgreSQL database with Drizzle ORM
- Session-based contact storage
- RESTful API endpoints