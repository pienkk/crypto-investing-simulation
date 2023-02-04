-- migrate:up
ALTER TABLE posts DROP label;
ALTER TABLE posts ADD categoryId INT NOT NULL;
ALTER TABLE posts ADD FOREIGN KEY (categoryId) REFERENCES categories (id);
-- migrate:down

