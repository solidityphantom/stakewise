import {
  Box,
  Button,
  HStack,
  Spinner,
  Table,
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
import { useAccount, useSigner } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import MultiStaker from "@data/MultiStaker.json";
import validatorsMap from "@data/validatorsMap.json";
import { useModal } from "connectkit";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

function Home() {
  const address = useAccount();
  const router = useRouter();
  const { setOpen } = useModal();
  const { data: signer } = useSigner();
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [delegatedValidators, setDelegatedValidators] = useState<any[]>([]);
  const [delegationsMap, setDelegationsMap] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const handleValidatorCheck = (operator_address: string) => {
    if (selectedValidators.includes(operator_address)) {
      setSelectedValidators(
        selectedValidators.filter((item) => item !== operator_address)
      );
    } else {
      setSelectedValidators([...selectedValidators, operator_address]);
    }
  };

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

      const tempMap = {};
      for (let i = 0; i < delegatedValidators.length; i++) {
        const result = await contractWithSigner.getDelegation(
          delegatedValidators[i].operator_address
        );
        const formattedResult = ethers.utils.formatUnits(result[1][1], 18);
        tempMap[delegatedValidators[i].operator_address] = formattedResult;
      }
      setDelegationsMap(tempMap);
    } catch (e) {
      console.log(e);
    }
  }, [delegatedValidators, signer]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchValidators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  useEffect(() => {
    fetchDelegation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegatedValidators]);

  if (!address.address) {
    return (
      <main className={styles.nullMain}>
        <VStack>
          <Text className={styles.nullText}>
            Connect your wallet to enter the app
          </Text>
          <Button className={styles.button} onClick={() => setOpen(true)}>
            Connect wallet
          </Button>
        </VStack>
      </main>
    );
  }

  if (!delegatedValidators || delegatedValidators.length === 0) {
    <Spinner size="lg" />;
  }

  return (
    <main className={styles.main}>
      <VStack className={styles.container}>
        <Box h="1rem" />
        <HStack w="100%" justifyContent="space-around">
          <Text>Current delegation</Text>
        </HStack>
        <HStack>
          {isLoading ? (
            <VStack h="480px" justifyContent="center">
              <Spinner size="lg" />
            </VStack>
          ) : (
            <TableContainer height="480px" overflowY="scroll">
              <Table variant="simple">
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
                            {Number(delegationsMap[operator_address]).toFixed(
                              4
                            )}
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
          )}
        </HStack>
        <Box h=".5rem" />
        <HStack>
          <Button
            className={styles.homeBtn}
            onClick={() => {
              router.push("/stake");
            }}
          >
            Stake
          </Button>
          {["Unstake", "Withdraw", "Redelegate"].map((val) => (
            <Button
              key={val}
              className={styles.homeBtn}
              onClick={() =>
                toast({
                  position: "bottom",
                  render: () => (
                    <Box p={3} className={styles.toast}>
                      Feature coming soon
                    </Box>
                  ),
                })
              }
            >
              {val}
            </Button>
          ))}
        </HStack>
      </VStack>
    </main>
  );
}

export default Home;
