-- migrate:up
CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  socialId BIGINT NOT NULL,
  socialType INT(4),
  email VARCHAR(50),
  nickname VARCHAR(40),
  money DECIMAL(12,2),
  description VARCHAR(300),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
-- migrate:down
DROP TABLE users;
