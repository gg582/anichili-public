CREATE TABLE ott_providers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

INSERT INTO ott_providers (name) VALUES
('Netflix'),
('TVING'),
('WATCHA'),
('Laftel'),
('Wavve'),
('Disney+'),
('Apple TV+'),
('Amazon Prime Video'),
('Coupang Play'),
('기타');
