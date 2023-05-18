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
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import MultiStaker from "@data/MultiStaker.json";
import { validators } from "@data/validators.json";
import validatorsMap from "@data/validatorsMap.json";

function Home() {
  const address = useAccount();
  const { data: balance } = useBalance(address);
  const [amount, setAmount] = useState("0");
  const { data: signer } = useSigner();
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [delegatedValidators, setDelegatedValidators] = useState<any[]>([]);
  const [delegationsMap, setDelegationsMap] = useState<any>({});

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

  const fetchValidators = useCallback(async () => {
    try {
      const contract = new ethers.Contract(
        "0x02a85c9E6D859eAFAC44C3c7DD52Bbe787e54d0A",
        MultiStaker.abi,
        signer
      );
      const contractWithSigner = contract.connect(signer);
      const result = await contractWithSigner.getDelegatorValidators();
      const fetchedValidators = result.map((v) => validatorsMap[v]);
      setDelegatedValidators(fetchedValidators);
    } catch (e) {
      console.log(e);
    }
  }, [signer]);

  const fetchDelegation = useCallback(async () => {
    try {
      const contract = new ethers.Contract(
        "0x02a85c9E6D859eAFAC44C3c7DD52Bbe787e54d0A",
        MultiStaker.abi,
        signer
      );

      const contractWithSigner = contract.connect(signer);
      const newDelegatedValidators = [...delegatedValidators];

      const tempMap = {};
      for (let i = 0; i < delegatedValidators.length; i++) {
        const result = await contractWithSigner.getDelegation(
          delegatedValidators[i].operator_address
        );
        console.log(result);
        const formattedResult = ethers.utils.formatUnits(result[1][1], 18);
        tempMap[delegatedValidators[i].operator_address] = formattedResult;
      }
      setDelegationsMap(tempMap);
    } catch (e) {
      console.log(e);
    }
  }, [delegatedValidators, signer]);

  useEffect(() => {
    fetchValidators();
  }, [signer]);

  useEffect(() => {
    fetchDelegation();
  }, [delegatedValidators]);

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
        <HStack w="100%" justifyContent="space-around">
          <Text>Validators on tEVMOS</Text>
          <Text>My Validators</Text>
        </HStack>
        <HStack>
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
                        {(
                          Number(commission.commission_rates.rate) * 100
                        ).toFixed(2)}
                        %
                      </Td>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          </TableContainer>
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
                {delegatedValidators &&
                  Object.keys(delegationsMap).length > 0 &&
                  delegatedValidators.map(
                    ({ operator_address, description, commission }) => (
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
                        <Td>
                          {Number(delegationsMap[operator_address]).toFixed(4)}
                        </Td>
                        <Td isNumeric>
                          {(
                            Number(commission.commission_rates.rate) * 100
                          ).toFixed(2)}
                          %
                        </Td>
                      </Tr>
                    )
                  )}
              </Tbody>
            </Table>
          </TableContainer>
        </HStack>
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
