// Importing module
import express from "express";
import pokemonRouter from "./routers/pokemon.api";
import cors from "cors";
import createError from "http-errors";

const app: express.Application = express();
const PORT: Number = 8000;

// Handling GET / Request
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("Welcome to typescript backend!");
});

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// pokemon router
app.use("/pokemons", pokemonRouter);

//customize express error handling middleware
app.use(
  (
    err: createError.HttpError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(err.statusCode).json({ message: err.message });
  }
);

// Server setup
app.listen(PORT, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + PORT
  );
});
