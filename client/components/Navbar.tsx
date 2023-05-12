import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { HStack, Image, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Navbar = () => {
  const { address } = useAccount();

  return (
    <HStack className={styles.navbar}>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          cursor="pointer"
          className={styles.logo}
        ></Image>
      </Link>
      <HStack className={styles.navLeftSection}>
        <Link href="/profile">
          <Text cursor="pointer">My Profile</Text>
        </Link>
        <ConnectButton />
      </HStack>
    </HStack>
  );
};

export default Navbar;
