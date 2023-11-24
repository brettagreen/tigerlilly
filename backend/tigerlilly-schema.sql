CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  issue_title TEXT NOT NULL,
  pub_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  author_first TEXT NOT NULL,
  author_last TEXT NOT NULL,
  author_handle TEXT NOT NULL UNIQUE,
  author_bio TEXT DEFAULT 'this author prefers to keep an air of mystery about them',
  icon TEXT 
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  article_title TEXT NOT NULL UNIQUE,
  author_id INTEGER 
    REFERENCES authors ON DELETE SET NULL,
  text TEXT NOT NULL,
  issue_id INTEGER
    REFERENCES issues ON DELETE SET NULL
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
  icon TEXT 
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL
    REFERENCES users ON DELETE SET NULL,
  text TEXT NOT NULL,
  article_id INTEGER
    REFERENCES articles ON DELETE CASCADE,    
  post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE private_messages (
  id SERIAL PRIMARY KEY,
  sender INTEGER NOT NULL
    REFERENCES users ON DELETE CASCADE,
  recipient INTEGER NOT NULL
    REFERENCES users ON DELETE CASCADE,
  message_text TEXT NOT NULL
);

CREATE TABLE user_favorites (
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  article_id INTEGER
    REFERENCES articles ON DELETE CASCADE,
  PRIMARY KEY (user_id, article_id)
);