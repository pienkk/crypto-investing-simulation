-- migrate:up
CREATE TABLE coins(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  ticker VARCHAR(30) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  image VARCHAR(700) NOT NULL
)

-- migrate:down
DROP TABLE coins;
