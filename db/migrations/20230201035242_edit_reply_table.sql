-- migrate:up
ALTER TABLE replies ADD CONSTRAINT reply_post_fkey FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE

-- migrate:down

