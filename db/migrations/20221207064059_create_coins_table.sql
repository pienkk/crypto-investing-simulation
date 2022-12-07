-- migrate:up
CREATE TABLE coins(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  ticker VARCHAR(30),
  image VARCHAR(700)
)

-- migrate:down
DROP TABLE coins;
