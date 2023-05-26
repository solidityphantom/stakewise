import {
  VStack,
  Input,
  Text,
  HStack,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import styles from "@styles/Home.module.css";

function AmountInput({
  amount,
  setAmount,
  inputWidth,
  setInputWidth,
  fontSize,
  setFontSize,
  fiatAmount,
  setFiatAmount,
  setError,
}) {
  const address = useAccount();
  const { data: balance } = useBalance(address);
  const [selectedPercentage, setSelectedPercentage] = useState(null); // New state for tracking the selected percentage

  const handleAmountChange = (event) => {
    const newAmount = event.target.value;
    setError("");
    setAmount(newAmount);
    setSelectedPercentage(null);
  };

  const handlePercentageClick = useCallback(
    (percentage) => {
      if (balance === null || balance === undefined) {
        return;
      }

      setError("");
      const newAmount = Number(balance.formatted) * (percentage / 100);
      setAmount(newAmount.toFixed(2));
      setSelectedPercentage(percentage);
    },
    [balance, setAmount, setError]
  );

  useEffect(() => {
    setFiatAmount(Number(amount) * 0.14992);

    let newWidth = Math.max(amount.length, 1);
    if (amount.length > 9) {
      newWidth -= 1.5;
    } else if (amount.length > 7) {
      newWidth -= 0.5;
    } else if (amount.length > 5) {
      newWidth -= 1;
    } else if (amount.length > 2) {
      newWidth -= 0.25;
    }

    let newSize = 48;
    if (amount.length > 7) {
      newSize = 28;
    } else if (amount.length > 4) {
      newSize = 32;
    } else if (amount.length > 1) {
      newSize = 40;
    }
    setInputWidth(`${newWidth}ch`);
    setFontSize(`${newSize}px`);
  }, [amount, setFiatAmount, setFontSize, setInputWidth]);

  return (
    <VStack pt="4rem">
      <Text className={styles.title}>Enter the amount to stake</Text>
      <VStack pt="2rem">
        <HStack className={styles.inputContainer}>
          <Input
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            type="number"
            _placeholder={{ color: "rgba(255, 255, 255, 0.25)" }}
            className={styles.amountInput}
            style={{ width: inputWidth, fontSize: fontSize }}
          />
          <Text
            className={styles.amountInputUnit}
            style={{ fontSize: fontSize }}
          >
            EVMOS
          </Text>
        </HStack>
        <Text className={styles.fiatAmountInputUnit}>
          ${fiatAmount.toFixed(2)}
        </Text>
      </VStack>
      <VStack p="3rem">
        <ButtonGroup size="sm" isAttached variant="outline">
          <Button
            onClick={() => handlePercentageClick(25)}
            bg={selectedPercentage === 25 ? "rgba(255,255,255,0.1)" : null}
          >
            25%
          </Button>
          <Button
            onClick={() => handlePercentageClick(50)}
            bg={selectedPercentage === 50 ? "rgba(255,255,255,0.1)" : null}
          >
            50%
          </Button>
          <Button
            onClick={() => handlePercentageClick(75)}
            bg={selectedPercentage === 75 ? "rgba(255,255,255,0.1)" : null}
          >
            75%
          </Button>
          <Button
            onClick={() => handlePercentageClick(100)}
            bg={selectedPercentage === 100 ? "rgba(255,255,255,0.1)" : null}
          >
            100%
          </Button>
        </ButtonGroup>
      </VStack>
    </VStack>
  );
}

export default AmountInput;
