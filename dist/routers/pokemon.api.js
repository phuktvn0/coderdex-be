"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const pokemon_validators_1 = require("./validators/pokemon.validators");
function checkNumbers(K) {
    return /^\d+$/.test(K);
}
const pokemonRouter = express_1.default.Router();
const pokemonFilePath = path_1.default.join(__dirname, "../../db.json");
const pokemonTypes = [
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
// get one pokemon
pokemonRouter.get("/:id", (req, res, next) => {
    try {
        let { id } = req.params;
        id = Math.floor(id);
        //Read data from db.json then parse to JSobject
        const pokemonJS = fs_1.default.readFileSync(pokemonFilePath, "utf-8");
        let pokemonDB = JSON.parse(pokemonJS);
        const pokemonList = pokemonDB["pokemon"];
        const totalPokemon = parseInt(pokemonDB["totalPokemon"]) - 1;
        if (!pokemonList.find((x) => x.id === id)) {
            throw (0, http_errors_1.default)("Pokemon not found.");
        }
        let pokemon;
        let nextPokemon;
        let previousPokemon;
        const pokemonIndex = pokemonList.findIndex((x) => x.id === id);
        // console.log(pokemonIndex, totalPokemon);
        if (pokemonIndex === 0) {
            nextPokemon = pokemonList[pokemonIndex + 1];
            pokemon = pokemonList[pokemonIndex];
            previousPokemon = pokemonList[totalPokemon];
        }
        else if (pokemonIndex === totalPokemon) {
            nextPokemon = pokemonList[0];
            pokemon = pokemonList[pokemonIndex];
            previousPokemon = pokemonList[pokemonIndex - 1];
        }
        else {
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
    }
    catch (error) {
        next(error);
    }
});
// put data pokemon
pokemonRouter.put("/:id", (req, res, next) => {
    try {
        const { error, value } = pokemon_validators_1.putPokemonDataSchema.validate(req.body);
        if (error) {
            throw (0, http_errors_1.default)(http_status_1.default.BAD_REQUEST, error.message);
        }
        let { id } = req.params;
        const { name, types, urlImg } = value;
        if (!name && !types && !urlImg) {
            throw (0, http_errors_1.default)("Missing data");
        }
        id = Math.floor(id);
        let newPokemonTypes = [types[0] || "", types[1] || ""];
        newPokemonTypes = newPokemonTypes.filter((x) => pokemonTypes.includes(x.toLowerCase().trim()));
        if (!newPokemonTypes.length) {
            throw (0, http_errors_1.default)(`Pokemon types invalid`);
        }
        //Read data from db.json then parse to JSobject
        const pokemonJS = fs_1.default.readFileSync(pokemonFilePath, "utf-8");
        let pokemonDB = JSON.parse(pokemonJS);
        let pokemonList = pokemonDB["pokemon"];
        // Pokemon not found
        if (!pokemonList.find((x) => x.id === id)) {
            throw (0, http_errors_1.default)("Pokemon not found");
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
        fs_1.default.writeFileSync(path_1.default.join(__dirname, "../../db.json"), JSON.stringify(pokemonDB));
        res.status(200).send(pokemonUpdate);
    }
    catch (error) {
        next(error);
    }
});
// delete pokemon
pokemonRouter.delete("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        // console.log(id);
        //Read data from db.json then parse to JSobject
        const pokemonJS = fs_1.default.readFileSync(pokemonFilePath, "utf-8");
        let pokemonDB = JSON.parse(pokemonJS);
        const pokemonList = pokemonDB["pokemon"];
        // Pokemon not found
        if (!pokemonList.find((x) => x.id === parseInt(id))) {
            throw (0, http_errors_1.default)("Pokemon not found");
        }
        const pokemonDelete = pokemonList.find((x) => x.id === parseInt(id));
        const newPokemonList = pokemonList.filter((x) => x.id !== parseInt(id));
        // console.log(newPokemonList);
        pokemonDB["pokemon"] = newPokemonList;
        pokemonDB["totalPokemon"] = newPokemonList.length;
        fs_1.default.writeFileSync(path_1.default.join(__dirname, "../../db.json"), JSON.stringify(pokemonDB));
        res.status(200).send(pokemonDelete);
    }
    catch (error) {
        next(error);
    }
});
// post new pokemon
pokemonRouter.post("/", (req, res, next) => {
    var _a, _b;
    try {
        const { error, value } = pokemon_validators_1.postPokemonDataSchema.validate(req.body);
        if (error) {
            throw (0, http_errors_1.default)(http_status_1.default.BAD_REQUEST, error.message);
        }
        const { id, name, types, url } = value;
        const newId = parseInt(id);
        let newPokemonType = [
            ((_a = types[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || "",
            ((_b = types[1]) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) || "",
        ];
        newPokemonType = newPokemonType.filter((x) => pokemonTypes.includes(x));
        if (!newPokemonType.length) {
            throw (0, http_errors_1.default)("Pokemon type is invalid.");
        }
        //Read data from db.json then parse to JSobject
        const pokemonJS = fs_1.default.readFileSync(pokemonFilePath, "utf-8");
        let pokemonDB = JSON.parse(pokemonJS);
        const pokemonList = pokemonDB["pokemon"];
        // check pokemon exists by id or by name
        if (pokemonList.find((x) => x.id === newId || x.name === name)) {
            throw (0, http_errors_1.default)("Pokemon exists");
        }
        // new Pokemon
        const newPokemon = {
            id: newId,
            name,
            types: newPokemonType,
            url,
        };
        pokemonList.push(newPokemon);
        pokemonDB["pokemon"] = pokemonList;
        pokemonDB["totalPokemon"] = pokemonList.length;
        fs_1.default.writeFileSync(path_1.default.join(__dirname, "../../db.json"), JSON.stringify(pokemonDB));
        res.status(200).send(newPokemon);
    }
    catch (error) {
        next(error);
    }
});
// get all data & fiter
pokemonRouter.get("/", (req, res, next) => {
    const allowedFilters = ["types", "search", "page", "limit"];
    try {
        // default value
        const { error, value } = pokemon_validators_1.getPokemonQuerySchema.validate(req.query);
        if (error) {
            throw (0, http_errors_1.default)(http_status_1.default.BAD_REQUEST, error.message);
        }
        let { page, limit } = value, filterQuery = __rest(value, ["page", "limit"]);
        // check filter query
        const filterKeys = Object.keys(filterQuery);
        filterKeys.forEach((key) => {
            if (!allowedFilters.includes(key)) {
                throw (0, http_errors_1.default)(`Query ${key} is not allowed`);
            }
        });
        //Number of items skip for selection
        let offset = limit * (page - 1);
        //Read data from db.json then parse to JSobject
        const pokemonJS = fs_1.default.readFileSync(pokemonFilePath, "utf-8");
        let pokemonDB = JSON.parse(pokemonJS);
        const pokemonList = pokemonDB["pokemon"];
        //Filter data by name, type, id
        let result = [];
        if (filterKeys.length) {
            filterKeys.forEach((condition) => {
                let filterValue = filterQuery[condition];
                filterValue = filterValue.toLowerCase().trim();
                // console.log(filterValue);
                switch (condition) {
                    case "search":
                        if (checkNumbers(filterValue)) {
                            result = result.length
                                ? result.filter((x) => x.id === parseInt(filterValue))
                                : pokemonList.filter((x) => x.id === parseInt(filterValue));
                        }
                        else {
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
        }
        else {
            result = pokemonList;
        }
        if (result.length === 0) {
            throw (0, http_errors_1.default)("Pokemon Not Found");
        }
        // select number of result by offset
        result = result.slice(offset, offset + limit);
        //send response
        const responseData = {
            data: result,
            totalPokemons: result.length,
        };
        res.status(200).send(responseData);
    }
    catch (error) {
        next(error);
    }
});
exports.default = pokemonRouter;
