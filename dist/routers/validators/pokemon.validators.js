"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putPokemonDataSchema = exports.postPokemonDataSchema = exports.getPokemonQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.getPokemonQuerySchema = joi_1.default.object({
    page: joi_1.default.number().default(1),
    limit: joi_1.default.number().default(20),
    search: [joi_1.default.string(), joi_1.default.number()],
    types: joi_1.default.string(),
});
exports.postPokemonDataSchema = joi_1.default.object({
    id: joi_1.default.number().required(),
    name: joi_1.default.string().required(),
    types: joi_1.default.array().min(1).max(2).required(),
    url: joi_1.default.string(),
});
exports.putPokemonDataSchema = joi_1.default.object({
    name: joi_1.default.string(),
    types: joi_1.default.array().min(1).max(2),
    url: joi_1.default.string(),
});
