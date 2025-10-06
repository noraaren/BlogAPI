const { Client } = require("pg");

const SQL = `
BEGIN;

-- Enable UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop in FK-safe order
DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updatedAt trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_posts_updated_at ON posts;
CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NULL REFERENCES users(id)
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  UNIQUE (user_id, name)
);

-- Join table for Post <-> Tag
CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ NULL
);

-- Seed multiple users and posts
INSERT INTO users (username) VALUES 
  ('alice'), 
  ('bob'), 
  ('charlie') 
ON CONFLICT (username) DO NOTHING;

-- Add multiple posts
WITH u AS (
  SELECT id FROM users WHERE username = 'alice'
)
INSERT INTO posts (user_id, title, content, published)
SELECT u.id, 'Hello World', 'First post content', true FROM u;

WITH u AS (
  SELECT id FROM users WHERE username = 'bob'
)
INSERT INTO posts (user_id, title, content, published)
SELECT u.id, 'My First Blog Post', 'This is Bob''s first blog post about web development and coding tips.', true FROM u;

WITH u AS (
  SELECT id FROM users WHERE username = 'charlie'
)
INSERT INTO posts (user_id, title, content, published)
SELECT u.id, 'Learning Node.js', 'Node.js is amazing! Here are some things I learned this week about async programming and Express.js.', true FROM u;

WITH u AS (
  SELECT id FROM users WHERE username = 'alice'
)
INSERT INTO posts (user_id, title, content, published)
SELECT u.id, 'Database Design Tips', 'Some best practices for designing PostgreSQL schemas with proper relationships and constraints.', true FROM u;

WITH u AS (
  SELECT id FROM users WHERE username = 'bob'
)
INSERT INTO posts (user_id, title, content, published)
SELECT u.id, 'RESTful API Design', 'How to build clean and maintainable REST APIs with proper HTTP status codes and error handling.', false FROM u;

-- Add multiple tags
WITH u AS (
  SELECT id FROM users WHERE username = 'alice'
)
INSERT INTO tags (name, user_id)
SELECT 'general', u.id FROM u
ON CONFLICT DO NOTHING;

WITH u AS (
  SELECT id FROM users WHERE username = 'bob'
)
INSERT INTO tags (name, user_id)
SELECT 'web-development', u.id FROM u
ON CONFLICT DO NOTHING;

WITH u AS (
  SELECT id FROM users WHERE username = 'charlie'
)
INSERT INTO tags (name, user_id)
SELECT 'nodejs', u.id FROM u
ON CONFLICT DO NOTHING;

WITH u AS (
  SELECT id FROM users WHERE username = 'alice'
)
INSERT INTO tags (name, user_id)
SELECT 'database', u.id FROM u
ON CONFLICT DO NOTHING;

-- Link post to tag
WITH p AS (
  SELECT id FROM posts ORDER BY created_at ASC LIMIT 1
), t AS (
  SELECT id FROM tags WHERE name = 'general' LIMIT 1
)
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM p, t
ON CONFLICT DO NOTHING;

-- Add multiple comments
WITH p AS (
  SELECT id FROM posts ORDER BY created_at ASC LIMIT 1
)
INSERT INTO comments (post_id, username, content)
SELECT p.id, 'guest', 'Nice first post!' FROM p;

WITH p AS (
  SELECT id FROM posts ORDER BY created_at ASC OFFSET 1 LIMIT 1
)
INSERT INTO comments (post_id, username, content)
SELECT p.id, 'developer123', 'Great tips! Thanks for sharing.' FROM p;

WITH p AS (
  SELECT id FROM posts ORDER BY created_at ASC OFFSET 2 LIMIT 1
)
INSERT INTO comments (post_id, username, content)
SELECT p.id, 'nodejs_fan', 'Node.js is indeed amazing! Love the async/await pattern.' FROM p;

WITH p AS (
  SELECT id FROM posts ORDER BY created_at ASC OFFSET 3 LIMIT 1
)
INSERT INTO comments (post_id, username, content)
SELECT p.id, 'db_expert', 'Excellent database design principles. Foreign keys are crucial!' FROM p;

-- Add one refresh token skeleton
WITH u AS (
  SELECT id FROM users WHERE username = 'alice'
)
INSERT INTO refresh_tokens (token, user_id, expires_at)
SELECT 'sample-token', u.id, NOW() + INTERVAL '30 days' FROM u;

COMMIT;`

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: "postgresql://aaronren:732293@localhost:5432/blog",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();