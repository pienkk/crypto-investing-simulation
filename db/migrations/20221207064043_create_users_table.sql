-- migrate:up
CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  socialId BIGINT NOT NULL,
  socialType INT(4) NOT NULL,
  email VARCHAR(50) NOT NULL,
  nickname VARCHAR(40) NOT NULL,
  money DECIMAL(18,6) NOT NULL DEFAULT 1000000,
  description VARCHAR(300) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
-- migrate:down
DROP TABLE users;
