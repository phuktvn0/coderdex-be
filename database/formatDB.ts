import csv from "csvtojson";
import * as fs from "fs";
import * as path from "path";

const pokemonData = async () => {
  interface inforPokemon {
    id: number;
    name: string;
    description?: string;
    height?: string;
    weight?: string;
    category?: string;
    abilities?: Array<string>;
    types: Array<string>;
    url: string;
  }
  let dataOne: any = fs.readFileSync(path.join(__dirname, "../moreinfo.json"));
  dataOne = JSON.parse(dataOne);
  //   console.log(newData);
  dataOne = dataOne.slice(0, 721);
  dataOne = dataOne.map((e, i) => {
    let types = e.type.map((x) => x.toLowerCase().trim());
    i += 1;
    return {
      id: i,
      name: e.name,
      description: e.description,
      height: e.height,
      weight: e.weight,
      category: e.category,
      abilities: e.abilities,
      types: types,
      url: `http://localhost:8000/images/${i}.png`,
    };
  });
  let newData: Array<inforPokemon> = dataOne;

  let data: any = fs.readFileSync(path.join(__dirname, "../db.json"));
  data = JSON.parse(data);
  data.pokemon = [];
  data.pokemon = newData;
  data.totalPokemon = newData.length;
  fs.writeFileSync(path.join(__dirname, "../db.json"), JSON.stringify(data));
};

pokemonData();
