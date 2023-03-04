CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE project_status AS ENUM ('created', 'uploaded', 'building', 'success', 'failed');

CREATE TABLE IF NOT EXISTS projects (
  project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  status project_status NOT NULL DEFAULT 'created', 
  created timestamptz NOT NULL DEFAULT NOW(),
  build_nonce VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS entrys (
  entry_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  name TEXT NOT NULL,
  created timestamptz NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT fk_project
    FOREIGN KEY(project_id) 
	    REFERENCES projects(project_id)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS executables (
  executable_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  name TEXT NOT NULL,
  created timestamptz NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT fk_project
    FOREIGN KEY(project_id) 
	    REFERENCES projects(project_id)
      ON DELETE CASCADE
);