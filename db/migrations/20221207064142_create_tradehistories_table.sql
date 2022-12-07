-- migrate:up
CREATE TABLE tradeHistories(
  userId INT NOT NULL,
  coinId INT NOT NULL,
  isPurchase BOOLEAN NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  fee DECIMAL(8,4) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT trade_coin_fkey FOREIGN KEY (coinId) REFERENCES coins (id),
  CONSTRAINT trade_user_fkey FOREIGN KEY (userId) REFERENCES users (id)
)
-- migrate:down
DROP TABLE tradeHistories;