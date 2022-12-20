-- migrate:up
CREATE TABLE coins(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  ticker VARCHAR(30) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  image VARCHAR(700) NULL,
  price DECIMAL(15,7) NOT NULL,
  oneHourPrice DECIMAL(15,7) NULL,
  fourHourPrice DECIMAL(15,7) NULL,
  oneDayPrice DECIMAL(15,7) NULL,
  oneDayVolume DECIMAL(20,7) NULL,
  quantity DECIMAL(20,6) NOT NULL DEFAULT 10000
)

-- migrate:down
DROP TABLE coins;
