import { VStack, Text, useRadioGroup, Box, useRadio } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";

export function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        _checked={{
          bg: "rgba(255, 255, 255, 0.05)",
        }}
        px={5}
        py={3}
        className={styles.radioCard}
      >
        {props.children}
      </Box>
    </Box>
  );
}

function BasicSelection({ selectedGroup, setSelectedGroup }) {
  const options = ["random", "bottom", "median", "top"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: selectedGroup,
    onChange: setSelectedGroup,
  });

  const group = getRootProps();

  return (
    <VStack p=".5rem">
      <Box h="1rem" />
      <Text className={styles.title}>Select group by voting power</Text>
      <VStack {...group} pt="1.5rem">
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
        <Text className={styles.subtitle2}>
          A validator&apos;s voting power is the proportion of total network
          coins they control, which determines their influence during consensus
          decisions.
        </Text>
      </VStack>
    </VStack>
  );
}

export default BasicSelection;
