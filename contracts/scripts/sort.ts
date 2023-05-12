import fs from "fs";

async function sortValidatorsByTokens() {
  try {
    // Read JSON file
    const data = fs.readFileSync("./data/validators.json", "utf8");

    // Parse JSON data
    const jsonData = JSON.parse(data);

    // Check if the `validators` property exists in the object and it is an array
    if (Array.isArray(jsonData.validators)) {
      // Sort the validators array by 'tokens' value in descending order
      jsonData.validators.sort((a: any, b: any) => {
        const tokensA = BigInt(a.tokens);
        const tokensB = BigInt(b.tokens);

        if (tokensA > tokensB) {
          return -1;
        } else if (tokensA < tokensB) {
          return 1;
        } else {
          return 0;
        }
      });

      // Write the sorted JSON data to a new file
      fs.writeFileSync(
        "./data/sorted_validators.json",
        JSON.stringify(jsonData, null, 2)
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
sortValidatorsByTokens();
