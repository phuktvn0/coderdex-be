import Joi from "joi";

export const getPokemonQuerySchema = Joi.object({
  page: Joi.number().default(1),
  limit: Joi.number().default(20),
  search: [Joi.string(), Joi.number()],
  types: Joi.string(),
});

export const postPokemonDataSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  types: Joi.array<string>().min(1).max(2).required(),
  url: Joi.string(),
});

export const putPokemonDataSchema = Joi.object({
  name: Joi.string(),
  types: Joi.array<string>().min(1).max(2),
  url: Joi.string(),
});
