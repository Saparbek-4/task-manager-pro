CREATE TABLE board (
   id UUID PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   project_id UUID REFERENCES project(id),
   created_at TIMESTAMP,
   updated_at TIMESTAMP
);
