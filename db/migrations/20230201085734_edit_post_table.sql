-- migrate:up
ALTER TABLE posts ADD deleted_at TIMESTAMP NULL

-- migrate:down

