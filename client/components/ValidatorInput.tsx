import {
  VStack,
  InputGroup,
  Input,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useCallback } from "react";

function ValidatorInput({ numValidators, setNumValidators }) {
  const handleNumValidatorsChange = useCallback(
    (event) => {
      setNumValidators(event.target.value);
    },
    [setNumValidators]
  );

  return (
    <VStack>
      <Text>Number of Validators</Text>
      <InputGroup>
        <Input
          value={numValidators}
          onChange={handleNumValidatorsChange}
          placeholder="0"
          width="300px"
          type="number"
        />
        <InputRightElement width="150px">
          <Text pl=".5rem">Validators</Text>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
}

export default ValidatorInput;
