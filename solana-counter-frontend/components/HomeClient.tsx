"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Card, Typography, notification } from "antd";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, web3, BN, Idl } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "@/constants/idl.json";

// Define the account structure
interface CounterAccount {
  authority: PublicKey;
  count: BN;
}

// Define the program methods interface
interface CounterProgram extends Program {
  account: {
    counter: {
      fetch: (address: PublicKey) => Promise<CounterAccount>;
    };
  };
}

const { SystemProgram } = web3;
const PROGRAM_ID = new PublicKey("CBg8WUVoFPdppuTBDzpUpgY3PG4PbzK8S676PQKXvLy6");

export const HomeClient = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [program, setProgram] = useState<CounterProgram | null>(null);
  const [counter, setCounter] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!wallet || !connection || !idl) return;
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    setProgram(new Program(idl as Idl, provider) as CounterProgram);
    }, [wallet, connection]);

  const getPDA = (authorityPubkey: PublicKey) =>
    PublicKey.findProgramAddressSync([Buffer.from("counter"), authorityPubkey.toBuffer()], PROGRAM_ID)[0];

  const fetchCount = useCallback(async () => {
    if (!wallet || !program) return;
    
    setLoading(true);
    const pda = getPDA(wallet.publicKey!);
    
    try {
      const acct = await program.account.counter.fetch(pda);
      setCounter(acct.count.toNumber());
      notification.success({
        message: 'Success',
        description: 'Counter value fetched successfully',
        duration: 2,
      });
    } catch (error: unknown) {
      console.error('Error fetching counter:', error);
      setCounter(null);
      notification.error({
        message: 'Error Fetching Counter',
        description: (error as Error)?.message || 'Counter not initialized or network error',
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  }, [wallet, program]);

  async function initialize() {
    if (!wallet || !program) return;
    
    setLoading(true);
    const pda = getPDA(wallet.publicKey!);
    
    try {
      await program.methods.initialize()
        .accounts({ 
          counter: pda, 
          authority: wallet.publicKey!, 
          systemProgram: SystemProgram.programId 
        })
        .rpc();
      
      notification.success({
        message: 'Counter Initialized',
        description: 'Counter has been successfully initialized!',
        duration: 3,
      });
      
      await fetchCount();
    } catch (error: unknown) {
      console.error('Error initializing counter:', error);
      notification.error({
        message: 'Initialization Failed',
        description: (error as Error)?.message || 'Failed to initialize counter. Please try again.',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  }

  async function increment() {
    if (!wallet || !program) return;
    
    setLoading(true);
    const pda = getPDA(wallet.publicKey!);
    
    try {
      await program.methods.increment()
        .accounts({ 
          counter: pda, 
          authority: wallet.publicKey! 
        })
        .rpc();
      
      notification.success({
        message: 'Counter Incremented',
        description: 'Counter value has been successfully incremented!',
        duration: 3,
      });
      
      await fetchCount();
    } catch (error: unknown) {
      console.error('Error incrementing counter:', error);
      notification.error({
        message: 'Increment Failed',
        description: (error as Error)?.message || 'Failed to increment counter. Please try again.',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (wallet && mounted) fetchCount(); }, [wallet, program, mounted, fetchCount]);

  if (!mounted) {
    return (
      <div style={{ 
        padding: 24, 
        maxWidth: 720, 
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: "transparent"
      }}>
        <Card
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: '#666666'
          }}>
            Loading...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: 24, 
      maxWidth: 720, 
      margin: "0 auto",
      minHeight: "100vh",
      backgroundColor: "transparent"
    }}>
      <Card
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography.Title level={4}>Solana Counter (Devnet)</Typography.Title>
          <WalletMultiButton />
        </div>

        <div style={{ marginTop: 20 }}>
          <Typography.Text strong>Wallet:</Typography.Text> {wallet?.publicKey?.toBase58() ?? "Not connected"}
        </div>

        <div style={{ marginTop: 12 }}>
          <Typography.Text strong>Counter:</Typography.Text> {counter === null ? "Not initialized" : counter}
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <Button 
            type="primary" 
            onClick={initialize} 
            disabled={!wallet || loading}
            loading={loading}
          >
            Initialize
          </Button>
          <Button 
            onClick={increment} 
            disabled={!wallet || counter === null || loading}
            loading={loading}
          >
            Increment
          </Button>
          <Button 
            onClick={() => {
              notification.info({
                message: 'Decrement Not Available',
                description: 'Decrement function needs to be implemented in the Solana program.',
                duration: 3,
              });
            }}
            disabled={!wallet || counter === null || loading}
          >
            Decrement
          </Button>
          <Button 
            onClick={fetchCount} 
            disabled={!wallet || loading}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </Card>
    </div>
  );
}
