USE backendDb;

INSERT INTO
    users (username, password)
VALUES ('username123', 'pw124');

INSERT INTO
    cars (marke, model, year)
VALUES ('Toyota', 'Camry', 2020),
    ('Honda', 'Civic', 2019),
    ('Ford', 'Mustang', 2021),
    ('Volkswagen', 'Golf', 2018),
    ('BMW', '3 Series', 2022);

INSERT INTO
    drivers (name, license_number)
VALUES ('Anna Keller', 'CH-10001'),
    ('Lukas Meier', 'CH-10002'),
    ('Sofia Rossi', 'CH-10003');

INSERT INTO
    trips (
        driver_id,
        car_id,
        distance_km,
        started_at,
        latitude,
        longitude,
        weather_data,
        status
    )
VALUES (
        1,
        1,
        124.50,
        '2026-08-20 08:30:00',
        47.3769,
        8.5417,
        '{"type":"historical","date":"2026-08-20","data":{"weather_code":[1]}}',
        'completed'
    ),
    (
        2,
        3,
        86.20,
        '2026-08-19 13:15:00',
        46.9480,
        7.4474,
        '{"type":"historical","date":"2026-08-19","data":{"weather_code":[2]}}',
        'completed'
    ),
    (
        3,
        2,
        245.00,
        '2026-08-18 09:00:00',
        47.0502,
        8.3093,
        '{"type":"historical","date":"2026-08-18","data":{"weather_code":[3]}}',
        'completed'
    );