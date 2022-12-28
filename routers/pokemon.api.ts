import express from "express";
import fs from "fs";
import createError from "http-errors";
import httpStatus from "http-status";
import path from "path";
import {
  getPokemonQuerySchema,
  postPokemonDataSchema,
  putPokemonDataSchema,
} from "./validators/pokemon.validators";

function checkNumbers(K: string) {
  return /^\d+$/.test(K);
}

const pokemonRouter: express.Router = express.Router();
const pokemonFilePath = path.join(__dirname, "../../db.json");
const pokemonTypes: Array<string> = [
  "bug",
  "dragon",
  "fairy",
  "fire",
  "ghost",
  "ground",
  "normal",
  "psychic",
  "steel",
  "dark",
  "electric",
  "fighting",
  "flyingText",
  "grass",
  "ice",
  "poison",
  "rock",
  "water",
];
// default data
interface inforPokemon {
  id: number;
  name: string;
  types: Array<string>;
  url: string;
}

// get one pokemon
pokemonRouter.get(
  "/:id",
  (
    req: express.Request<{ id: number }>,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      let { id } = req.params;
      id = Math.floor(id);
      //Read data from db.json then parse to JSobject
      const pokemonJS = fs.readFileSync(pokemonFilePath, "utf-8");
      let pokemonDB: object = JSON.parse(pokemonJS);
      const pokemonList: Array<inforPokemon> = pokemonDB["pokemon"];
      const totalPokemon: number = parseInt(pokemonDB["totalPokemon"]) - 1;

      if (!pokemonList.find((x) => x.id === id)) {
        throw createError("Pokemon not found.");
      }

      let pokemon: inforPokemon;
      let nextPokemon: inforPokemon;
      let previousPokemon: inforPokemon;
      const pokemonIndex = pokemonList.findIndex((x) => x.id === id);
      // console.log(pokemonIndex, totalPokemon);
      if (pokemonIndex === 0) {
        nextPokemon = pokemonList[pokemonIndex + 1];
        pokemon = pokemonList[pokemonIndex];
        previousPokemon = pokemonList[totalPokemon];
      } else if (pokemonIndex === totalPokemon) {
        nextPokemon = pokemonList[0];
        pokemon = pokemonList[pokemonIndex];
        previousPokemon = pokemonList[pokemonIndex - 1];
      } else {
        nextPokemon = pokemonList[pokemonIndex + 1];
        pokemon = pokemonList[pokemonIndex];
        previousPokemon = pokemonList[pokemonIndex - 1];
      }

      const responseData = { data: { pokemon, nextPokemon, previousPokemon } };
      // switch (pokemonIndex) {
      //   case 0:
      //     responseData = [
      //       pokemonList[totalPokemon],
      //       pokemonList[pokemonIndex],
      //       pokemonList[pokemonIndex + 1],
      //     ];
      //     break;
      //   case totalPokemon:
      //     responseData = [
      //       pokemonList[pokemonIndex - 1],
      //       pokemonList[pokemonIndex],
      //       pokemonList[0],
      //     ];
      //   default:
      //     responseData = [
      //       pokemonList[pokemonIndex - 1],
      //       pokemonList[pokemonIndex],
      //       pokemonList[pokemonIndex + 1],
      //     ];
      //     break;
      // }

      res.status(200).send(responseData);
    } catch (error) {
      next(error);
    }
  }
);

// put data pokemon
pokemonRouter.put(
  "/:id",
  (
    req: express.Request<
      { id: number },
      never,
      {
        name: string;
        types: Array<string>;
        urlImg: string;
      }
    >,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { error, value } = putPokemonDataSchema.validate(req.body);
      if (error) {
        throw createError(httpStatus.BAD_REQUEST, error.message);
      }
      let { id } = req.params;
      const { name, types, urlImg } = value;

      if (!name && !types && !urlImg) {
        throw createError("Missing data");
      }
      id = Math.floor(id);

      let newPokemonTypes: Array<string> = [types[0] || "", types[1] || ""];
      newPokemonTypes = newPokemonTypes.filter((x) =>
        pokemonTypes.includes(x.toLowerCase().trim())
      );
      if (!newPokemonTypes.length) {
        throw createError(`Pokemon types invalid`);
      }
      //Read data from db.json then parse to JSobject
      const pokemonJS = fs.readFileSync(pokemonFilePath, "utf-8");
      let pokemonDB: object = JSON.parse(pokemonJS);
      let pokemonList: Array<inforPokemon> = pokemonDB["pokemon"];

      // Pokemon not found
      if (!pokemonList.find((x) => x.id === id)) {
        throw createError("Pokemon not found");
      }

      // new pokemon data
      pokemonList.forEach((x) => {
        if (x.id === id) {
          name ? (x.name = name) : (x.name = x.name);
          types ? (x.types = newPokemonTypes) : (x.types = x.types);
          urlImg ? (x.url = urlImg) : (x.url = x.url);
        }
      });

      const pokemonUpdate = pokemonList.find((x) => x.id === id);

      pokemonDB["pokemon"] = pokemonList;
      pokemonDB["totalPokemon"] = pokemonList.length;
      fs.writeFileSync(
        path.join(__dirname, "../../db.json"),
        JSON.stringify(pokemonDB)
      );

      res.status(200).send(pokemonUpdate);
    } catch (error) {
      next(error);
    }
  }
);

// delete pokemon
pokemonRouter.delete(
  "/:id",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { id } = req.params;
      // console.log(id);
      //Read data from db.json then parse to JSobject
      const pokemonJS = fs.readFileSync(pokemonFilePath, "utf-8");
      let pokemonDB: object = JSON.parse(pokemonJS);
      const pokemonList: Array<inforPokemon> = pokemonDB["pokemon"];

      // Pokemon not found
      if (!pokemonList.find((x) => x.id === parseInt(id))) {
        throw createError("Pokemon not found");
      }

      const pokemonDelete = pokemonList.find((x) => x.id === parseInt(id));
      const newPokemonList = pokemonList.filter((x) => x.id !== parseInt(id));
      // console.log(newPokemonList);

      pokemonDB["pokemon"] = newPokemonList;
      pokemonDB["totalPokemon"] = newPokemonList.length;
      fs.writeFileSync(
        path.join(__dirname, "../../db.json"),
        JSON.stringify(pokemonDB)
      );

      res.status(200).send(pokemonDelete);
    } catch (error) {
      next(error);
    }
  }
);

// post new pokemon
pokemonRouter.post(
  "/",
  (
    req: express.Request<
      never,
      never,
      {
        id: number;
        name: string;
        types: Array<string>;
        url: string;
      }
    >,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { error, value } = postPokemonDataSchema.validate(req.body);
      if (error) {
        throw createError(httpStatus.BAD_REQUEST, error.message);
      }
      const { id, name, types, url } = value;
      const newId: number = parseInt(id);

      let newPokemonType: Array<string> = [
        types[0].toLowerCase().trim() || "",
        types[1].toLowerCase().trim() || "",
      ];

      newPokemonType = newPokemonType.filter((x: string) =>
        pokemonTypes.includes(x)
      );
      if (!newPokemonType.length) {
        throw createError("Pokemon type is invalid.");
      }

      //Read data from db.json then parse to JSobject
      const pokemonJS = fs.readFileSync(pokemonFilePath, "utf-8");
      let pokemonDB: object = JSON.parse(pokemonJS);
      const pokemonList: Array<inforPokemon> = pokemonDB["pokemon"];
      // console.log(pokemon);

      // check pokemon exists by id or by name
      if (pokemonList.find((x) => x.id === newId || x.name === name)) {
        throw createError("Pokemon exists");
      }

      // new Pokemon
      const newPokemon: inforPokemon = {
        id: newId,
        name,
        types: newPokemonType,
        url,
      };
      pokemonList.push(newPokemon);
      // console.log(pokemon);
      pokemonDB["pokemon"] = pokemonList;
      pokemonDB["totalPokemon"] = pokemonList.length;
      fs.writeFileSync(
        path.join(__dirname, "../../db.json"),
        JSON.stringify(pokemonDB)
      );
      res.status(200).send(newPokemon);
    } catch (error) {
      next(error);
    }
  }
);

// get all data & fiter
pokemonRouter.get(
  "/",
  (
    req: express.Request<
      never,
      never,
      never,
      {
        page: number;
        limit: number;
        types: string;
        search: string;
      }
    >,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const allowedFilters = ["types", "search", "page", "limit"];
    try {
      // default value
      const { error, value } = getPokemonQuerySchema.validate(req.query);
      if (error) {
        throw createError(httpStatus.BAD_REQUEST, error.message);
      }

      let { page, limit, ...filterQuery } = value;
      // check filter query
      const filterKeys = Object.keys(filterQuery);

      filterKeys.forEach((key: string) => {
        if (!allowedFilters.includes(key)) {
          throw createError(`Query ${key} is not allowed`);
        }
      });

      //Number of items skip for selection
      let offset: number = limit * (page - 1);

      //Read data from db.json then parse to JSobject
      const pokemonJS = fs.readFileSync(pokemonFilePath, "utf-8");
      let pokemonDB: object = JSON.parse(pokemonJS);
      const pokemonList: Array<inforPokemon> = pokemonDB["pokemon"];

      //Filter data by name, type, id
      let result: Array<inforPokemon> = [];

      if (filterKeys.length) {
        filterKeys.forEach((condition: string) => {
          let filterValue = filterQuery[condition as keyof typeof filterQuery];

          filterValue = filterValue.toLowerCase().trim();
          // console.log(filterValue);

          switch (condition) {
            case "search":
              if (checkNumbers(filterValue)) {
                result = result.length
                  ? result.filter((x) => x.id === parseInt(filterValue))
                  : pokemonList.filter((x) => x.id === parseInt(filterValue));
              } else {
                result = result.length
                  ? result.filter((x) => x.name.includes(filterValue))
                  : pokemonList.filter((x) => x.name.includes(filterValue));
              }
              break;
            case "types":
              result = result.length
                ? result.filter((x) => x.types.includes(filterValue))
                : pokemonList.filter((x) => x.types.includes(filterValue));
              break;
            default:
              result = result.length
                ? result.filter((x) => x[condition] === filterValue)
                : pokemonList.filter((x) => x[condition] === filterValue);
          }
        });
      } else {
        result = pokemonList;
      }
      if (result.length === 0) {
        throw createError("Pokemon Not Found");
      }
      // select number of result by offset
      result = result.slice(offset, offset + limit);

      //send response
      const responseData = {
        data: result,
        totalPokemons: result.length,
      };
      res.status(200).send(responseData);
    } catch (error) {
      next(error);
    }
  }
);

export default pokemonRouter;
