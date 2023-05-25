import {
  VStack,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Text,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import styles from "@styles/Home.module.css";

function AmountInput() {
  const address = useAccount();
  const { data: balance } = useBalance(address);
  const [amount, setAmount] = useState("0");

  const maxValue = useMemo(() => balance?.formatted, [balance]);

  const handleMaxClick = useCallback(() => {
    setAmount(maxValue);
  }, [maxValue]);

  const handleAmountChange = useCallback((event) => {
    setAmount(event.target.value);
  }, []);

  return (
    <VStack>
      <Text>Amount to delegate</Text>
      <InputGroup>
        <Input
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
          width="300px"
        />
        <InputRightElement width="150px">
          <Button
            onClick={handleMaxClick}
            className={styles.inputBtn}
            bgColor="gray"
          >
            MAX
          </Button>
          <Text pl=".5rem">tEVMOS</Text>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
}

export default AmountInput;
