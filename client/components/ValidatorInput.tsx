import { VStack, Input, Text, HStack } from "@chakra-ui/react";
import { useCallback } from "react";
import styles from "@styles/Home.module.css";

function ValidatorInput({
  numValidators,
  setNumValidators,
  maxValidators,
  setError,
}) {
  const handleNumValidatorsChange = useCallback(
    (event) => {
      const newValue = parseInt(event.target.value, 10);
      if (newValue > 0 && newValue <= maxValidators) {
        setError("");
      } else {
        setError(
          `Input must be greater than 0 and less than or equal to ${maxValidators}.`
        );
      }
      setNumValidators(newValue);
    },
    [maxValidators, setNumValidators, setError]
  );

  return (
    <VStack pt="3rem">
      <Text className={styles.title}>
        Choose the number of validators to stake your tEVMOS with
      </Text>
      <VStack p="2rem">
        <HStack className={styles.inputContainer}>
          <Input
            value={numValidators}
            onChange={handleNumValidatorsChange}
            placeholder="0"
            type="number"
            _placeholder={{ color: "rgba(255, 255, 255, 0.25)" }}
            className={styles.validatorInput}
          />
        </HStack>
        <Text className={styles.amountInputUnit}>validators</Text>
        <Text className={styles.subtitle}>
          Note: There are currently 100 active validators on tEVMOS. Selecting
          more validators can help promote decentralization.
        </Text>
      </VStack>
    </VStack>
  );
}

export default ValidatorInput;
