-- migrate:up
CREATE TABLE wallets(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  coinID INT NOT NULL,
  userId INT NOT NULL
  purchasePrice DECIMAL(12,4),
  quantity DECIMAL(10,2),
  CONSTRAINT wallets_coin_fkey FOREIGN KEY (coinId) REFERENCES coins (id),
  CONSTRAINT wallets_user_fkey FOREIGN KEY (userId) REFERENCES users (id)
)

-- migrate:down
DROP TABLE wallets;
