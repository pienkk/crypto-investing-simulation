-- migrate:up
ALTER TABLE replies ADD replyId INT NOT NULL DEFAULT 0

-- migrate:down

