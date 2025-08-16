CREATE TABLE ott_urls (
    id INTEGER PRIMARY KEY,
    animation_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (animation_id) REFERENCES animations(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES ott_providers(id)
);

