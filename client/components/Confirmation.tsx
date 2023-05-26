import {
  VStack,
  Text,
  Box,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
} from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import { useRef } from "react";

function Confirmation({
  amount,
  fiatAmount,
  fontSize,
  validatorsMap,
  selectedValidators,
}) {
  const selectedValidatorObjects = selectedValidators.map(
    (s) => validatorsMap[s]
  );

  return (
    <VStack>
      <VStack w="100%" justifyContent="center !important">
        <Text className={styles.title}>Confirm your delegation</Text>
        <HStack className={styles.textContainer}>
          <Text
            className={styles.amountInputUnit}
            style={{ fontSize: `${fontSize.split("px")[0] - 12}px` }}
          >
            {amount} EVMOS
          </Text>
        </HStack>
        <Text className={styles.fiatAmountInputUnitText}>
          ${fiatAmount.toFixed(2)}
        </Text>
      </VStack>
      <TableContainer
        maxHeight="290px"
        width="440px"
        overflowY="scroll"
        style={{ tableLayout: "fixed" }}
      >
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Validator</Th>
              <Th>Tokens</Th>
              <Th>Commission</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedValidatorObjects.map(
              ({ operator_address, description, commission }) => (
                <Tr key={operator_address}>
                  <Td>
                    <div style={{ width: "180px", overflow: "hidden" }}>
                      {description.moniker}
                    </div>
                  </Td>
                  <Td>
                    <div style={{ width: "80px", overflow: "hidden" }}>
                      {(Number(amount) / selectedValidators.length).toFixed(4)}
                    </div>
                  </Td>
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
      <Box h="2rem" />
      <Text className={styles.subtitle4}>
        Please review the details of your staking preferences before signing the
        transaction to process the transaction.
      </Text>
      <Box h="2rem" />
    </VStack>
  );
}

export default Confirmation;
