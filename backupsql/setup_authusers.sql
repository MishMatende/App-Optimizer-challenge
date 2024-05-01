CREATE TABLE IF NOT EXISTS "cms_users" (
    "user_uuid" uuid not null references auth.users on delete cascade,
    "id" serial PRIMARY KEY NOT NULL
    
);