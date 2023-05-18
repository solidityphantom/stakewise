import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useState } from "react";
import { ethers } from "ethers";
import MultiStaker from "@data/MultiStaker.json";
import { validators } from "@data/validators.json";

function Home() {
  const address = useAccount();
  const { data: balance } = useBalance(address);
  const [amount, setAmount] = useState("0");
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);

  const handleValidatorCheck = (operator_address: string) => {
    if (selectedValidators.includes(operator_address)) {
      setSelectedValidators(
        selectedValidators.filter((item) => item !== operator_address)
      );
    } else {
      setSelectedValidators([...selectedValidators, operator_address]);
    }
  };

  const maxValue = balance.formatted;

  const handleMaxClick = () => {
    setAmount(maxValue);
  };

  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  const dividedAmount = selectedValidators.length
    ? ethers.utils.parseEther(amount).div(selectedValidators.length)
    : ethers.utils.parseEther("0");

  const { config: stakeConfig } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as any,
    abi: MultiStaker.abi,
    functionName: "stakeTokens",
    args: [
      selectedValidators,
      Array(selectedValidators.length).fill(dividedAmount),
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
        <TableContainer height="500px" overflowY="scroll">
          <Table variant="simple">
            <TableCaption>Validators on tEVMOS</TableCaption>
            <Thead>
              <Tr>
                <Th>Validator</Th>
                <Th>Tokens</Th>
                <Th>Commission</Th>
              </Tr>
            </Thead>
            <Tbody>
              {validators.map(
                ({ operator_address, description, tokens, commission }) => (
                  <Tr
                    key={operator_address}
                    onClick={() => handleValidatorCheck(operator_address)}
                    className={
                      selectedValidators.includes(operator_address)
                        ? styles.selected
                        : undefined
                    }
                  >
                    <Td>{description.moniker}</Td>
                    <Td>{(Number(tokens) / 1e18).toFixed(2)}</Td>
                    <Td isNumeric>
                      {(Number(commission.commission_rates.rate) * 100).toFixed(
                        2
                      )}
                      %
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Box h="1rem" />
        <Button bgColor="teal" onClick={() => stake?.()}>
          {isStakeLoading ? <Spinner /> : "Stake"}
        </Button>
        {isStakeSuccess && (
          <VStack>
            <Text>Staked successfully!</Text>
            <Link href={`https://testnet.escan.live/tx/${stakeTxn.hash}`}>
              View transaction
            </Link>
          </VStack>
        )}
      </VStack>
      <Box h="1rem" />
      <Text className={styles.bold}>
        Built with ❤️ at EVMOS Extensions Hackathon
      </Text>
    </main>
  );
}

export default Home;
