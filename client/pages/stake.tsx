import {
  Box,
  Button,
  HStack,
  Link,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import MultiStaker from "@data/MultiStaker.json";
import validators from "@data/validators.json";
import validatorsMap from "@data/validatorsMap.json";
import { useModal } from "connectkit";
import AdvancedSelection from "@components/AdvancedSelection";
import ProgressBar from "@components/ProgressBar";
import BasicSelection from "@components/BasicSelection";
import AmountInput from "@components/AmountInput";
import ValidatorInput from "@components/ValidatorInput";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Confirmation from "@components/Confirmation";
import { useRouter } from "next/router";

function Home() {
  const address = useAccount();
  const { setOpen } = useModal();
  const router = useRouter();
  const { data: signer } = useSigner();
  const [amount, setAmount] = useState("0");
  const [numValidators, setNumValidators] = useState();
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [delegatedValidators, setDelegatedValidators] = useState<any[]>([]);
  const [delegationsMap, setDelegationsMap] = useState<any>({});
  const [selectedGroup, setSelectedGroup] = useState("");
  const [percentile, setPercentile] = useState([25, 75]);
  const [selectedSorting, setSelectedSorting] = useState("desc_tokens");
  const [sortedValidators, setSortedValidators] = useState(validators);
  const [filteredValidators, setFilteredValidators] = useState(validators);
  const [filter, setFilter] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [fiatAmount, setFiatAmount] = useState(0);
  const [inputWidth, setInputWidth] = useState("1ch");
  const [fontSize, setFontSize] = useState("48px");
  const [isAdvancedSelection, setAdvancedSelection] = useState(false);

  const handleValidatorCheck = useCallback(
    (operator_address: string) => {
      if (selectedValidators.includes(operator_address)) {
        setSelectedValidators(
          selectedValidators.filter((item) => item !== operator_address)
        );
      } else {
        setSelectedValidators([...selectedValidators, operator_address]);
      }
    },
    [selectedValidators]
  );

  const handleSelectedGroupChange = useCallback(
    (group) => {
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
    },
    [numValidators, sortedValidators]
  );

  const handleRangeConfirm = useCallback(() => {
    if (!numValidators) return;
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
  }, [numValidators, percentile, sortedValidators]);

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
    if (selectedSorting === "asc_comm") {
      const sorted = [...validators].sort(
        (a, b) =>
          Number(a.commission.commission_rates.rate) -
          Number(b.commission.commission_rates.rate)
      );
      setSortedValidators(sorted);
    } else if (selectedSorting === "asc_tokens") {
      const sorted = [...validators].sort(
        (a, b) => Number(a.tokens) - Number(b.tokens)
      );
      setSortedValidators(sorted);
    } else if (selectedSorting === "desc_comm") {
      const sorted = [...validators].sort(
        (a, b) =>
          Number(b.commission.commission_rates.rate) -
          Number(a.commission.commission_rates.rate)
      );
      setSortedValidators(sorted);
    } else {
      const sorted = [...validators].sort(
        (a, b) => Number(b.tokens) - Number(a.tokens)
      );
      setSortedValidators(sorted);
    }
  }, [selectedSorting]);

  useEffect(() => {
    if (filter === "jail") {
      setFilteredValidators(
        sortedValidators.filter((validator) => !validator.jailed)
      );
    } else {
      setFilteredValidators(sortedValidators);
    }
  }, [filter, sortedValidators]);

  useEffect(() => {
    fetchValidators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  useEffect(() => {
    fetchDelegation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delegatedValidators]);

  const goHome = () => router.push("/");
  const goBack = () => setCurrentStep((prev) => prev - 1);
  const goToNextStep = () => {
    if (currentStep === 0 && (error || amount === "" || amount === "0")) {
      setError(`You must stake at least 0.001 EVMOS.`);
      return;
    }
    if (currentStep === 1 && (error || !numValidators)) {
      setError(
        `Input must be greater than 0 and less than or equal to ${validators.length}.`
      );
      return;
    }
    if (currentStep === 2 && (error || selectedValidators.length === 0)) {
      setError(`You must select at least one validator.`);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const getComponent = useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <AmountInput
            amount={amount}
            fiatAmount={fiatAmount}
            setAmount={setAmount}
            setFiatAmount={setFiatAmount}
            inputWidth={inputWidth}
            fontSize={fontSize}
            setInputWidth={setInputWidth}
            setFontSize={setFontSize}
            setError={setError}
          />
        );
      case 1:
        return (
          <ValidatorInput
            numValidators={numValidators}
            setNumValidators={setNumValidators}
            maxValidators={validators.length}
            setError={setError}
          />
        );
      case 2:
        return !isAdvancedSelection ? (
          <BasicSelection
            selectedGroup={selectedGroup}
            setSelectedGroup={handleSelectedGroupChange}
          />
        ) : (
          <AdvancedSelection
            percentile={percentile}
            setPercentile={setPercentile}
            setSelectedSorting={setSelectedSorting}
            setFilter={setFilter}
            filteredValidators={filteredValidators}
            handleValidatorCheck={handleValidatorCheck}
            selectedValidators={selectedValidators}
            handleRangeConfirm={handleRangeConfirm}
          />
        );
      case 3:
        return (
          <Confirmation
            amount={amount}
            fiatAmount={fiatAmount}
            fontSize={fontSize}
            validatorsMap={validatorsMap}
            selectedValidators={selectedValidators}
          />
        );
    }
  }, [
    amount,
    currentStep,
    fiatAmount,
    filteredValidators,
    fontSize,
    handleRangeConfirm,
    handleSelectedGroupChange,
    handleValidatorCheck,
    inputWidth,
    isAdvancedSelection,
    numValidators,
    percentile,
    selectedGroup,
    selectedValidators,
  ]);

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
      <VStack className={styles.container}>
        <HStack className={styles.stepperHeader}>
          {currentStep > 0 ? (
            <ChevronLeftIcon boxSize={6} onClick={goBack} cursor="pointer" />
          ) : (
            <Box w="26px" />
          )}
          <ProgressBar currentStep={currentStep} totalSteps={4} />
        </HStack>
        {getComponent()}
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
        {currentStep === 3 ? (
          <HStack>
            <Button className={styles.secondaryBtn} onClick={goHome}>
              Cancel
            </Button>
            <Button className={styles.button} onClick={() => stake?.()}>
              {isStakeLoading ? <Spinner color="#09182c" /> : "Stake"}
            </Button>
          </HStack>
        ) : (
          <Button className={styles.button} onClick={goToNextStep}>
            Continue
          </Button>
        )}
        {currentStep === 2 && !isAdvancedSelection ? (
          <Text
            fontSize="12px"
            onClick={() => setAdvancedSelection(true)}
            cursor="pointer"
          >
            Advanced selection settings
          </Text>
        ) : (
          currentStep === 2 && (
            <Text
              fontSize="12px"
              onClick={() => setAdvancedSelection(false)}
              cursor="pointer"
            >
              Basic selection settings
            </Text>
          )
        )}
        {error && (
          <Text color="red" fontSize="14px" pt="0.5rem">
            {error}
          </Text>
        )}
      </VStack>
    </main>
  );
}

export default Home;
