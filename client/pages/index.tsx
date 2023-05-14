import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useState } from "react";
import { ethers } from "ethers";
import MultiStaker from "@data/MultiStaker.json";

function Home() {
  const address = useAccount();
  const { data: balance } = useBalance(address);
  const [amount, setAmount] = useState("0");

  const maxValue = balance.formatted;

  const handleMaxClick = () => {
    setAmount(maxValue);
  };

  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  const { config: stakeConfig } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as any,
    abi: MultiStaker.abi,
    functionName: "stakeTokens",
    args: [
      ["evmosvaloper10t6kyy4jncvnevmgq6q2ntcy90gse3yxa7x2p4"],
      [ethers.utils.parseEther(amount)],
    ],
  });

  const {
    data: stakeTxn,
    isLoading: isStakeLoading,
    isSuccess: isStakeSuccess,
    write: stake,
  } = useContractWrite(stakeConfig);

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
        </HStack>
        <Button bgColor="teal" onClick={() => stake?.()}>
          {isStakeLoading ? <Spinner /> : "Stake"}
        </Button>
      </VStack>
      {isStakeSuccess && (
        <VStack>
          <Text>Staked successfully!</Text>
          <Link href={`https://testnet.escan.live/tx/${stakeTxn.hash}`}>
            View transaction
          </Link>
        </VStack>
      )}
      <Text className={styles.bold}>
        Built with ❤️ at EVMOS Extensions Hackathon
      </Text>
    </main>
  );
}

export default Home;
