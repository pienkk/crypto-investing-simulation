-- migrate:up
CREATE TABLE tradeHistories(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  coinId INT NOT NULL,
  isPurchase BOOLEAN NOT NULL,
  status TINYINT(3) NOT NULL,
  buyPrice DECIMAL(15,7) NULL,
  sellPrice DECIMAL(15,7) NULL,
  quantity DECIMAL(15,7) NOT NULL,
  fee DECIMAL(13,4) NOT NULL,
  gainMoney DECIMAL(15,7) NULL,
  gainPercent DECIMAL(7,2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT trade_coin_fkey FOREIGN KEY (coinId) REFERENCES coins (id),
  CONSTRAINT trade_user_fkey FOREIGN KEY (userId) REFERENCES users (id)
)
-- migrate:down
DROP TABLE tradeHistories;