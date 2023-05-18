import fs from "fs";

interface Validator {
  operator_address: string;
  [key: string]: any;
}

// Load validators JSON file
const rawJson = fs.readFileSync("./data/validators.json", "utf-8");
const data = JSON.parse(rawJson);

// Create a new map object
const validatorsMap: Record<string, Validator> = {};

// Populate the map object
data.validators.forEach((validator: Validator) => {
  validatorsMap[validator.operator_address] = validator;
});

// Save the map to a new JSON file
fs.writeFileSync(
  "./data/validatorsMap.json",
  JSON.stringify(validatorsMap, null, 2)
);
