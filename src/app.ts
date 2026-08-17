import express, { type Express, type Request, type Response } from "express";

const cars = [
  { id: 1, marke: "Toyota", model: "Camry", year: 2020 },
  { id: 2, marke: "Honda", model: "Civic", year: 2019 },
  { id: 3, marke: "Ford", model: "Mustang", year: 2021 },
];

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/cars", (req: Request, res: Response) => {
  res.json(cars);
});

app.get("/cars/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const carId = parseInt(id, 10);
  const car = cars.find((c) => c.id === carId);

  if (car) {
    res.json(car);
  } else {
    res.status(404).send("Car not found");
  }
});

app.post("/cars", (req: Request, res: Response) => {
  const { marke, model, year } = req.body;
  const newCar = {
    id: cars.length + 1,
    marke,
    model,
    year,
  };
  cars.push(newCar);
  res.status(201).json(newCar);
});

app.put("/cars/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const carId = parseInt(id, 10);
  const carIndex = cars.findIndex((c) => c.id === carId);

  if (carIndex !== -1) {
    const { marke, model, year } = req.body;
    cars[carIndex] = { id: carId, marke, model, year };
    res.json(cars[carIndex]);
  } else {
    res.status(404).send("Car not found");
  }
});

app.delete("/cars/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const carId = parseInt(id, 10);
  const carIndex = cars.findIndex((c) => c.id === carId);

  if (carIndex !== -1) {
    cars.splice(carIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Car not found");
  }
});

app.listen(3000);
