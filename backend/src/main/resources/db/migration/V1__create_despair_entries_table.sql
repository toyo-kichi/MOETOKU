CREATE TABLE despair_entries (
    id          UUID         NOT NULL DEFAULT gen_random_uuid(),
    member_name VARCHAR(100) NOT NULL,
    level       SMALLINT     NOT NULL CHECK (level >= 1 AND level <= 10),
    comment     TEXT,
    recorded_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_despair_entries PRIMARY KEY (id)
);
