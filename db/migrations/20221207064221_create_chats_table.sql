-- migrate:up
CREATE TABLE chats(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  comment VARCHAR(300),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chats_user_fkey FOREIGN KEY (userId) REFERENCES users (id)
)
-- migrate:down
DROP TABLE chats