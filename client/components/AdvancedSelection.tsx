import {
  VStack,
  Text,
  Box,
  Button,
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

function RangeSelection({
  percentile,
  setPercentile,
  handleRangeConfirm,
}: any) {
  const timerRef = useRef(null);

  const handleRangeChange = (val) => {
    setPercentile(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      handleRangeConfirm(val);
    }, 300);
  };

  return (
    <RangeSlider
      // eslint-disable-next-line jsx-a11y/aria-proptypes
      aria-label={["min", "max"]}
      defaultValue={[percentile[0], percentile[1]]}
      onChange={handleRangeChange}
      onBlur={handleRangeConfirm}
      width="400px"
    >
      <RangeSliderMark value={percentile[0]} className={styles.sliderMark}>
        {percentile[0]}%
      </RangeSliderMark>
      <RangeSliderMark value={percentile[1]} className={styles.sliderMark}>
        {percentile[1]}%
      </RangeSliderMark>
      <RangeSliderTrack bg="rgba(217, 217, 217, 0.25)">
        <RangeSliderFilledTrack bg="white" />
      </RangeSliderTrack>
      <RangeSliderThumb boxSize={3} index={0}>
        <Box color="white" />
      </RangeSliderThumb>
      <RangeSliderThumb boxSize={3} index={1}>
        <Box color="white" />
      </RangeSliderThumb>
    </RangeSlider>
  );
}

function AdvancedSelection({
  percentile,
  setPercentile,
  setSelectedSorting,
  setFilter,
  filteredValidators,
  handleValidatorCheck,
  selectedValidators,
  handleRangeConfirm,
}) {
  return (
    <VStack>
      <VStack w="100%" justifyContent="center !important">
        <Text className={styles.title}>Custom validator selection</Text>
        <HStack w="100%" justifyContent="space-between">
          <HStack>
            <Text className={styles.filterText}>Sort by:</Text>
            <Select
              w="180px"
              className={styles.select}
              onChange={(e) => setSelectedSorting(e.target.value)}
            >
              <option value="desc_tokens">Voting power (desc.)</option>
              <option value="asc_tokens">Voting power (asc.)</option>
              <option value="desc_comm">Commission rate (desc.)</option>
              <option value="asc_comm">Commission rate (asc.)</option>
            </Select>
          </HStack>
          <HStack>
            <Text className={styles.filterText}>Filter by:</Text>
            <Select
              w="120px"
              className={styles.select}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="none">N/A</option>
              <option value="jail">No jail time</option>
            </Select>
          </HStack>
        </HStack>
        <TableContainer
          height="290px"
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
              {filteredValidators.map(
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
                    <Td>
                      <div style={{ width: "180px", overflow: "hidden" }}>
                        {description.moniker}
                      </div>
                    </Td>
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
        <VStack pt=".5rem" pb="0.5rem">
          <Text className={styles.subtitle3}>
            Select validators by percentile range
          </Text>
          <RangeSelection
            percentile={percentile}
            setPercentile={setPercentile}
            handleRangeConfirm={handleRangeConfirm}
          />
        </VStack>
      </VStack>
    </VStack>
  );
}

export default AdvancedSelection;
