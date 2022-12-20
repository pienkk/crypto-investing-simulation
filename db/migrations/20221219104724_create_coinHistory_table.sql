-- migrate:up
CREATE TABLE coinHistories(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  price DECIMAL(15,7) NOT NULL,
  eventTime INT UNSIGNED NOT NULL
)
-- migrate:down
DROP TABLE coinHistories