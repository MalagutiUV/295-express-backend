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
        started_at
    )
VALUES (
        1,
        1,
        124.50,
        '2026-08-20 08:30:00'
    ),
    (
        2,
        3,
        86.20,
        '2026-08-21 13:15:00'
    ),
    (
        3,
        2,
        245.00,
        '2026-08-22 09:00:00'
    ),
    (
        1,
        5,
        52.75,
        '2026-08-23 17:45:00'
    );