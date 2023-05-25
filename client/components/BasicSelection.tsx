import {
  VStack,
  Text,
  HStack,
  useRadioGroup,
  Box,
  useRadio,
} from "@chakra-ui/react";

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
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

function BasicSelection({ selectedGroup, setSelectedGroup }) {
  const options = ["top", "median", "bottom", "random"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: selectedGroup,
    onChange: setSelectedGroup,
  });

  const group = getRootProps();

  return (
    <VStack>
      <Text>Select Delegate Group</Text>
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
    </VStack>
  );
}

export default BasicSelection;
