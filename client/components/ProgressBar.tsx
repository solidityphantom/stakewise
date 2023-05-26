import { Box, HStack, VStack } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <VStack className={styles.progressContainer}>
      <Box className={`${styles.progressBarContainer}`}>
        <Box
          style={{
            width: `${(((currentStep + 1) / totalSteps) * 100).toFixed(0)}%`,
          }}
          className={`${styles.progressBar}`}
        ></Box>
        <HStack className={styles.progressBarDividers}>
          <Box pl="6px">
            <Box className={styles.progressBarDivider}></Box>
          </Box>
          <Box className={styles.progressBarDivider}></Box>
          <Box pr="7px">
            <Box className={styles.progressBarDivider}></Box>
          </Box>
        </HStack>
      </Box>
    </VStack>
  );
}

export default ProgressBar;
