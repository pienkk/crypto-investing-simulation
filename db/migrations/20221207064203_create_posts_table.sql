-- migrate:up
CREATE TABLE posts(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT posts_user_fkey FOREIGN KEY (userId) REFERENCES users (id)
)
-- migrate:down
DROP TABLE posts;