-- migrate:up
CREATE TABLE likes(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  postId INT NOT NULL,
  likeType BOOLEAN,
  CONSTRAINT like_user_fkey FOREIGN KEY (userId) REFERENCES users (id),
  CONSTRAINT like_post_fkey FOREIGN KEY (postId) REFERENCES posts (id),
  CONSTRAINT like_user_post_ukey UNIQUE(userId,postId)
)
-- migrate:down
DROP TABLE likes