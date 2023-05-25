import {
  Box,
  Button,
  HStack,
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
import validators from "@data/validators.json";
import validatorsMap from "@data/validatorsMap.json";
import { useModal } from "connectkit";
import AdvancedSelection from "@components/AdvancedSelection";

function Home() {
  const address = useAccount();
  const { setOpen } = useModal();
  const { data: balance } = useBalance(address);
  const { data: signer } = useSigner();
  const [amount, setAmount] = useState("0");
  const [numValidators, setNumValidators] = useState(0);
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [delegatedValidators, setDelegatedValidators] = useState<any[]>([]);
  const [delegationsMap, setDelegationsMap] = useState<any>({});
  const [selectedGroup, setSelectedGroup] = useState("median");
  const [percentile, setPercentile] = useState([30, 80]);
  const [selectedSorting, setSelectedSorting] = useState("Tokens");
  const [sortedValidators, setSortedValidators] = useState(validators);
  const [filteredValidators, setFilteredValidators] = useState(validators);
  const [filterJailed, setFilterJailed] = useState(false);

  const handleValidatorCheck = (operator_address: string) => {
    if (selectedValidators.includes(operator_address)) {
      setSelectedValidators(
        selectedValidators.filter((item) => item !== operator_address)
      );
    } else {
      setSelectedValidators([...selectedValidators, operator_address]);
    }
  };

  const maxValue = balance?.formatted;

  const handleMaxClick = () => {
    console.log(balance);
    setAmount(maxValue);
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

  const handleSelectedGroupChange = (group) => {
    setSelectedGroup(group);
    let selected;
    const num = Number(numValidators);
    switch (group) {
      case "top":
        selected = sortedValidators.slice(0, num);
        break;
      case "median":
        const middle = Math.floor(sortedValidators.length / 2);
        const start = Math.max(middle - Math.floor(num / 2), 0);
        selected = sortedValidators.slice(start, start + num);
        break;
      case "bottom":
        selected = sortedValidators.slice(-num);
        break;
      case "random":
        selected = [];
        while (selected.length < num) {
          const randomValidator =
            sortedValidators[
              Math.floor(Math.random() * sortedValidators.length)
            ];
          if (!selected.includes(randomValidator)) {
            selected.push(randomValidator);
          }
        }
        break;
      default:
        selected = [];
    }
    setSelectedValidators(
      selected.map((validator) => validator.operator_address)
    );
  };

  const handleRangeConfirm = () => {
    const start = Math.floor((sortedValidators.length * percentile[0]) / 100);
    const end = Math.floor((sortedValidators.length * percentile[1]) / 100);
    const rangeValidators = sortedValidators.slice(start, end);

    let selected = [];
    while (selected.length < numValidators) {
      const randomValidator =
        rangeValidators[Math.floor(Math.random() * rangeValidators.length)];
      if (!selected.includes(randomValidator)) {
        selected.push(randomValidator);
      }
    }
    setSelectedValidators(
      selected.map((validator) => validator.operator_address)
    );
  };

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
    if (selectedSorting === "Commission") {
      const sorted = [...validators].sort(
        (a, b) =>
          Number(a.commission.commission_rates.rate) -
          Number(b.commission.commission_rates.rate)
      );
      setSortedValidators(sorted);
    } else if (selectedSorting === "Tokens") {
      const sorted = [...validators].sort(
        (a, b) => Number(b.tokens) - Number(a.tokens)
      );
      setSortedValidators(sorted);
    } else {
      setSortedValidators(validators);
    }
  }, [selectedSorting]);

  useEffect(() => {
    if (filterJailed) {
      setFilteredValidators(
        sortedValidators.filter((validator) => !validator.jailed)
      );
    } else {
      setFilteredValidators(sortedValidators);
    }
  }, [filterJailed, sortedValidators]);

  useEffect(() => {
    if (selectedSorting === "Commission") {
      const sorted = [...validators].sort(
        (a, b) =>
          Number(a.commission.commission_rates.rate) -
          Number(b.commission.commission_rates.rate)
      );
      setSortedValidators(sorted);
    } else if (selectedSorting === "Tokens") {
      const sorted = [...validators].sort(
        (a, b) => Number(b.tokens) - Number(a.tokens)
      );
      setSortedValidators(sorted);
    } else {
      setSortedValidators(validators);
    }
  }, [selectedSorting]);

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

  return (
    <main className={styles.main}>
      <VStack>
        <Box h="1rem" />
        {/* <AdvancedSelection
          percentile={percentile}
          setPercentile={setPercentile}
          handleRangeConfirm={handleRangeConfirm}
          selectedSorting={selectedSorting}
          setSelectedSorting={setSelectedSorting}
          filterJailed={filterJailed}
          setFilterJailed={setFilterJailed}
          filteredValidators={filteredValidators}
          handleValidatorCheck={handleValidatorCheck}
          selectedValidators={selectedValidators}
        /> */}
        <HStack w="100%" justifyContent="space-around">
          <Text>My current delegation</Text>
        </HStack>
        <HStack>
          <TableContainer height="500px" overflowY="scroll">
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
        <HStack>
          <Button bgColor="teal" onClick={() => stake?.()}>
            {isStakeLoading ? <Spinner /> : "Stake"}
          </Button>
          <Button bgColor="teal" onClick={() => stake?.()}>
            {isStakeLoading ? <Spinner /> : "Unstack"}
          </Button>
          <Button bgColor="teal" onClick={() => stake?.()}>
            {isStakeLoading ? <Spinner /> : "Withdraw"}
          </Button>
          <Button bgColor="teal" onClick={() => stake?.()}>
            {isStakeLoading ? <Spinner /> : "Redelegate"}
          </Button>
        </HStack>
        {isStakeSuccess && (
          <VStack>
            <Text>Staked successfully!</Text>
            <Link
              href={`https://testnet.escan.live/tx/${stakeTxn.hash}`}
              isExternal
            >
              View transaction
            </Link>
          </VStack>
        )}
      </VStack>
      <Text className={styles.bold}>
        Built with ❤️ at EVMOS Extensions Hackathon
      </Text>
    </main>
  );
}

export default Home;
