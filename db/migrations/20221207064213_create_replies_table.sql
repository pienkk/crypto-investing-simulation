-- migrate:up
CREATE TABLE replies(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  postId INT NOT NULL,
  comment VARCHAR(400),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT repliy_user_fkey FOREIGN KEY (userId) REFERENCES users (id),
  CONSTRAINT repliy_post_fkey FOREIGN KEY (postId) REFERENCES posts (id)
)
-- migrate:down
DROP TABLE replies