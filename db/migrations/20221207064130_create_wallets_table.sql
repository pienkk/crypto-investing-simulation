-- migrate:up
CREATE TABLE wallets(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  coinId INT NOT NULL,
  userId INT NOT NULL,
  purchasePrice DECIMAL(15,7) NOT NULL,
  quantity DECIMAL(15,7) NOT NULL,
  CONSTRAINT wallets_coin_fkey FOREIGN KEY (coinId) REFERENCES coins (id),
  CONSTRAINT wallets_user_fkey FOREIGN KEY (userId) REFERENCES users (id)
  CONSTRAINT wallets_coin_user_fkey UNIQUE (coinId,userId)
)

-- migrate:down
DROP TABLE wallets;
