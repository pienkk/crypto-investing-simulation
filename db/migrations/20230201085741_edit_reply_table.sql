-- migrate:up
ALTER TABLE replies ADD deleted_at TIMESTAMP NULL

-- migrate:down

