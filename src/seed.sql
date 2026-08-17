USE backendDb;

INSERT INTO cars (marke, model, year) VALUES
  ('Toyota', 'Camry', 2020),
  ('Honda', 'Civic', 2019),
  ('Ford', 'Mustang', 2021),
  ('Volkswagen', 'Golf', 2018),
  ('BMW', '3 Series', 2022);


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dein_passwort';
FLUSH PRIVILEGES;