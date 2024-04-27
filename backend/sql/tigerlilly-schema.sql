CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  issue_title TEXT NOT NULL,
  volume INTEGER NOT NULL,
  issue INTEGER NOT NULL,
  pub_date DATE NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT UC_Issue UNIQUE (volume, issue)
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  author_first TEXT NOT NULL,
  author_last TEXT NOT NULL,
  author_handle TEXT NOT NULL UNIQUE,
  author_slogan TEXT NOT NULL,
  author_bio TEXT CONSTRAINT bio_length CHECK (char_length(author_bio) <= 5000)
    DEFAULT 'this author prefers to keep an air of mystery about them',
  icon TEXT DEFAULT 'defaultUserIcon.jpg'
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  article_title TEXT NOT NULL,
  author_id INTEGER 
    REFERENCES authors ON DELETE SET NULL,
  text TEXT NOT NULL,
  issue_id INTEGER
    REFERENCES issues ON DELETE SET NULL,
  CONSTRAINT UC_Article UNIQUE (article_title, text)
);

CREATE TABLE article_keywords (
  article_id INTEGER REFERENCES articles ON DELETE CASCADE,
  keyword VARCHAR(25) NOT NULL,
  PRIMARY KEY (article_id, keyword)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_first TEXT NOT NULL,
  user_last TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
    CHECK (position('@' IN email) > 1),
  username VARCHAR(25) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  icon TEXT DEFAULT 'defaultUserIcon.jpg'
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER
    REFERENCES users ON DELETE SET NULL,
  text TEXT CONSTRAINT comment_length CHECK (char_length(text) <= 1000),
  article_id INTEGER
    REFERENCES articles ON DELETE CASCADE,
  post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_favorites (
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  article_id INTEGER
    REFERENCES articles ON DELETE CASCADE,
  PRIMARY KEY (user_id, article_id)
);

CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  feedback TEXT NOT NULL CONSTRAINT feedback_length CHECK (char_length(feedback) <= 1000)
);
