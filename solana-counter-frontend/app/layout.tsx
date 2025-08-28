import { SolanaProvider } from "../components/SolanaProvider";
import ClientOnly from "../components/ClientOnly";
import WalletErrorBoundary from "../components/WalletErrorBoundary";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Counter dApp",
  description: "A simple counter application built on Solana blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientOnly 
          fallback={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              fontSize: '16px',
              color: '#666666',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
              Loading Solana dApp...
            </div>
          }
        >
          <WalletErrorBoundary>
            <SolanaProvider>
              {children}
            </SolanaProvider>
          </WalletErrorBoundary>
        </ClientOnly>
      </body>
    </html>
  );
}
