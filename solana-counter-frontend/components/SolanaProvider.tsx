"use client";
import React, { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { ConfigProvider, theme } from "antd";
import "@solana/wallet-adapter-react-ui/styles.css";

interface Props { children: ReactNode; }

export const SolanaProvider: FC<Props> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgBase: '#ffffff',
          colorTextBase: '#000000',
          colorBgContainer: '#ffffff',
          colorBorder: '#d9d9d9',
        },
        components: {
          Card: {
            colorBgContainer: '#ffffff',
            colorBorderSecondary: '#f0f0f0',
          },
          Button: {
            colorPrimary: '#1890ff',
            colorPrimaryHover: '#40a9ff',
          },
        },
      }}
    >
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ConfigProvider>
  );
};
