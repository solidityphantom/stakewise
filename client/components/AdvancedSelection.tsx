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
  Switch,
  useRadioGroup,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MdGraphicEq } from "react-icons/md";
import styles from "@styles/Home.module.css";
import { RadioCard } from "./BasicSelection";

function RangeSelection({ percentile, setPercentile }: any) {
  return (
    <RangeSlider
      aria-label={["min", "max"]}
      defaultValue={[30, 80]}
      onChange={(val) => setPercentile(val)}
      width="500px"
    >
      <RangeSliderMark value={25} mt="4" ml="-2.5" fontSize="sm">
        25%
      </RangeSliderMark>
      <RangeSliderMark value={50} mt="4" ml="-2.5" fontSize="sm">
        50%
      </RangeSliderMark>
      <RangeSliderMark value={75} mt="4" ml="-2.5" fontSize="sm">
        75%
      </RangeSliderMark>
      <RangeSliderMark value={percentile[0]} className={styles.sliderMark}>
        {percentile[0]}%
      </RangeSliderMark>
      <RangeSliderMark value={percentile[1]} className={styles.sliderMark}>
        {percentile[1]}%
      </RangeSliderMark>
      <RangeSliderTrack bg="red.100">
        <RangeSliderFilledTrack bg="tomato" />
      </RangeSliderTrack>
      <RangeSliderThumb boxSize={6} index={0}>
        <Box color="tomato" as={MdGraphicEq} />
      </RangeSliderThumb>
      <RangeSliderThumb boxSize={6} index={1}>
        <Box color="tomato" as={MdGraphicEq} />
      </RangeSliderThumb>
    </RangeSlider>
  );
}

function SortSelection({ selectedSorting, setSelectedSorting }: any) {
  const options = ["Tokens", "Commission"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "sorting",
    defaultValue: selectedSorting,
    onChange: setSelectedSorting,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
}

function AdvancedSelection({
  percentile,
  setPercentile,
  handleRangeConfirm,
  selectedSorting,
  setSelectedSorting,
  filterJailed,
  setFilterJailed,
  filteredValidators,
  handleValidatorCheck,
  selectedValidators,
}) {
  return (
    <VStack>
      <VStack>
        <Text>Select By Percentile Range</Text>
        <Box h="1rem" />
        <RangeSelection percentile={percentile} setPercentile={setPercentile} />
        <Button bgColor="teal" onClick={handleRangeConfirm}>
          Confirm Range
        </Button>
      </VStack>
      <VStack>
        <Text>Sort by</Text>
        <SortSelection
          selectedSorting={selectedSorting}
          setSelectedSorting={setSelectedSorting}
        />
      </VStack>
      <Box h="1rem" />
      <VStack>
        <Text>Filter out jailed</Text>
        <Switch onChange={() => setFilterJailed(!filterJailed)} />
      </VStack>
      <Box h="1rem" />
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
    </VStack>
  );
}

export default AdvancedSelection;
