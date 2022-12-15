-- migrate:up
CREATE TABLE coinPriceHistories(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  coinId INT NOT NULL,
  price DECIMAL(12,4) NOT NULL,
  oneHourPrice DECIMAL(12,4) NOT NULL,
  fourHourPrice DECIMAL(12,4) NOT NULL,
  oneDayPrice DECIMAL(12,4) NOT NULL,
  oneDayVolum DECIMAL(12,4) NOT NULL,
  quantity DECIMAL(12,4) NOT NULL,
  CONSTRAINT coinHis_coin_fkey FOREIGN KEY (coinId) REFERENCES coins (id)
)
-- migrate:down
DROP TABLE coinPriceHistories