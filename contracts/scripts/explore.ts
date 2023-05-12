import fs from "fs";

async function countValidators() {
  try {
    const data = fs.readFileSync("./data/validators.json", "utf8");
    const jsonData = JSON.parse(data);

    if (Array.isArray(jsonData.validators)) {
      console.log(
        `The number of objects in the 'validators' array is ${jsonData.validators.length}`
      );
    } else {
      console.log(
        "The `validators` property does not exist or is not an array"
      );
    }
  } catch (error) {
    console.error(`Error reading or parsing file: ${error}`);
  }
}

async function countStatusTypes() {
  try {
    // Read JSON file
    const data = fs.readFileSync("./data/validators.json", "utf8");

    // Parse JSON data
    const jsonData = JSON.parse(data);

    // Check if the `validators` property exists in the object and it is an array
    if (Array.isArray(jsonData.validators)) {
      // Initialize an empty object to hold counts of each status type
      let statusCounts: { [key: string]: number } = {};

      // Iterate through each validator
      jsonData.validators.forEach((validator: any) => {
        // If the validator object has a 'status' property
        if (validator.status) {
          // If this status has been encountered before, increment the count, otherwise initialize to 1
          statusCounts[validator.status] =
            (statusCounts[validator.status] || 0) + 1;
        }
      });

      // Print the counts of each status type
      console.log(statusCounts);
    } else {
      console.log(
        "The `validators` property does not exist or is not an array"
      );
    }
  } catch (error) {
    console.error(`Error reading or parsing file: ${error}`);
  }
}

async function countJailedValidators() {
  try {
    // Read JSON file
    const data = fs.readFileSync("./data/validators.json", "utf8");

    // Parse JSON data
    const jsonData = JSON.parse(data);

    // Check if the `validators` property exists in the object and it is an array
    if (Array.isArray(jsonData.validators)) {
      // Initialize count of jailed validators
      let jailedCount = 0;

      // Iterate through each validator
      jsonData.validators.forEach((validator: any) => {
        // If the validator is jailed, increment the count
        if (validator.jailed === true) {
          jailedCount++;
        }
      });

      // Print the count of jailed validators
      console.log(`The number of jailed validators is ${jailedCount}`);
    } else {
      console.log(
        "The `validators` property does not exist or is not an array"
      );
    }
  } catch (error) {
    console.error(`Error reading or parsing file: ${error}`);
  }
}

async function countValidatorsWithMoreDelegatorShares() {
  try {
    // Read JSON file
    const data = fs.readFileSync("./data/validators.json", "utf8");

    // Parse JSON data
    const jsonData = JSON.parse(data);

    // Check if the `validators` property exists in the object and it is an array
    if (Array.isArray(jsonData.validators)) {
      // Initialize count
      let count = 0;

      // Iterate through each validator
      jsonData.validators.forEach((validator: any) => {
        // Convert delegator_shares and tokens to BigInt for comparison
        const delegatorShares = BigInt(
          validator.delegator_shares.split(".")[0]
        );
        const tokens = BigInt(validator.tokens);

        // If delegatorShares is greater than tokens, increment the count
        if (delegatorShares > tokens) {
          count++;
        }
      });

      // Print the count
      console.log(
        `The number of validators with 'delegator_shares' larger than 'tokens' is ${count}`
      );
    } else {
      console.log(
        "The `validators` property does not exist or is not an array"
      );
    }
  } catch (error) {
    console.error(`Error reading or parsing file: ${error}`);
  }
}

// Call the function
// countValidatorsWithMoreDelegatorShares();

// Call the function
// countJailedValidators();

// Call the function
// countValidators();

// Call the function
// countStatusTypes();
