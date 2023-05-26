import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { Button, HStack, Image } from "@chakra-ui/react";
import { useModal } from "connectkit";
import { useAccount } from "wagmi";

function shortenAddress(address: string) {
  if (!address) return address;
  const l = address.length;
  if (l < 20) return address;
  return `${address.substring(0, 6)}...${address.substring(l - 4, l)}`;
}

const Navbar = () => {
  const { address } = useAccount();
  const { setOpen } = useModal();

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
      {address && (
        <HStack className={styles.navLeftSection}>
          <Button className={styles.homeBtn} onClick={() => setOpen(true)}>
            {shortenAddress(address)}
          </Button>
        </HStack>
      )}
    </HStack>
  );
};

export default Navbar;
