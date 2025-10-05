"use client";
import React from 'react';
import styled from 'styled-components';

// Container for the iframe
const IframeContainer = styled.div`
  width: 100%;
  height: calc(100vh - 80px); /* Adjust based on your header height */
  padding: 0;
  margin: 0;
`;

// The iframe itself
const OrderIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export default function OrderPage() {
  // Use the public token from your Clover dashboard
  const publicToken = "b8d462c6b7e4e8ef22052fe0d66f1744";
  
  // Construct the iframe URL with the token
  const orderUrl = `https://www.clover.com/online-ordering/laurinos-tavern-brewster?token=${publicToken}`;
  
  return (
    <IframeContainer>
      <OrderIframe 
        src={orderUrl}
        title="Order from Laurino's Tavern"
        allowFullScreen
      />
    </IframeContainer>
  );
}