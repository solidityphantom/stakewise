import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import { useAccount, useBalance } from "wagmi";
import { useState } from "react";

function Home() {
  const address = useAccount();
  const { data: balance } = useBalance(address);
  const [amount, setAmount] = useState("");

  const maxValue = balance.formatted;

  const handleMaxClick = () => {
    setAmount(maxValue);
  };

  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <main className={styles.main}>
      <VStack>
        <Text>Amount to delegate</Text>
        <HStack>
          <InputGroup>
            <Input
              value={amount}
              onChange={handleInputChange}
              placeholder="0"
              width="300px"
            />
            <InputRightElement width="150px">
              <Button onClick={handleMaxClick} className={styles.inputBtn}>
                MAX
              </Button>
              <Text pl=".5rem">tEVMOS</Text>
            </InputRightElement>
          </InputGroup>
        </HStack>
      </VStack>
      <Text className={styles.bold}>
        Built with ❤️ at EVMOS Extensions Hackathon
      </Text>
    </main>
  );
}

export default Home;
