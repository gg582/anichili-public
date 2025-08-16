INSERT INTO animations (
    title,
    image,
    year,
    season,
    pv_url,
    opening_url,
    ending_url,
    contributor,
    version_history
)
VALUES (
    '봇치 더 록!',
    'https://c.wallhere.com/photos/43/45/BOCCHI_THE_ROCK_animation_colorful_anime_girls-2241218.jpg',
    2022,
    '4분기',
    'https://www.youtube.com/watch?v=mIr_Sm2AgZM',
    'https://www.youtube.com/watch?v=xEYrwBngYfk&list=RDxEYrwBngYfk&start_radio=1',
    'https://youtube.com/playlist?list=PLQOpFOT5kdFkUDI6evIx75f8a2aWLyIdb&si=ex51fEOMX1enCzc7',
    '상콤젤리',
    '[{"contributor": "상콤젤리", "timestamp": "2025-08-03T12:00:00Z", "action": "생성"}]'
);

CREATE TABLE pending_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    request_type TEXT NOT NULL, -- 'EDIT' or 'DELETE'
    request_data TEXT, -- JSON string containing updated data for EDIT requests
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
