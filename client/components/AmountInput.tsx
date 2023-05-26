import {
  VStack,
  Input,
  Text,
  HStack,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import styles from "@styles/Home.module.css";

function AmountInput() {
  const address = useAccount();
  const { data: balance } = useBalance(address);
  const [inputWidth, setInputWidth] = useState("1ch");
  const [fontSize, setFontSize] = useState("48px");
  const [amount, setAmount] = useState("");
  const [fiatAmount, setFiatAmount] = useState(0);

  const handleAmountChange = (event) => {
    const newAmount = event.target.value;
    setAmount(newAmount);
  };

  const handlePercentageClick = useCallback(
    (percentage) => {
      if (balance === null || balance === undefined) {
        return;
      }

      const newAmount = Number(balance.formatted) * (percentage / 100);
      setAmount(newAmount.toFixed(2));
    },
    [balance]
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
  }, [amount]);

  return (
    <VStack pt="2rem">
      <Text className={styles.title}>Enter the amount to stake</Text>
      <VStack pt="1rem">
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
      <VStack p="2rem">
        <ButtonGroup size="sm" isAttached variant="outline">
          <Button onClick={() => handlePercentageClick(25)}>25%</Button>
          <Button onClick={() => handlePercentageClick(50)}>50%</Button>
          <Button onClick={() => handlePercentageClick(75)}>75%</Button>
          <Button onClick={() => handlePercentageClick(100)}>100%</Button>
        </ButtonGroup>
      </VStack>
    </VStack>
  );
}

export default AmountInput;
