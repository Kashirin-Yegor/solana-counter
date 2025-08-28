"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, Typography, Button } from "antd";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class WalletErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Wallet Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
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
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Typography.Title level={4} type="danger">
                Wallet Connection Error
              </Typography.Title>
              <Typography.Paragraph>
                There was an error loading the wallet adapter. This might be due to:
              </Typography.Paragraph>
              <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                <li>Browser extension conflicts</li>
                <li>Network connectivity issues</li>
                <li>Wallet adapter compatibility problems</li>
              </ul>
              <div style={{ marginTop: 20 }}>
                <Button 
                  type="primary" 
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WalletErrorBoundary;