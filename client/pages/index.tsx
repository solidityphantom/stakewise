import { Text } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";

function Home() {
  return (
    <main className={styles.main}>
      <Text className={styles.bold}>
        Built with ❤️ at EVMOS Extensions Hackathon
      </Text>
    </main>
  );
}

export default Home;
