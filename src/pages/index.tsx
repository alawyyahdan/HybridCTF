import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {   
  type BaseError,
  useReadContracts, 
  useAccount, 
  useWriteContract 
} from 'wagmi';
import { contractAddress, contractABI } from '../contractconfig';
import { formatUnits } from 'viem';
import { toast } from 'react-toastify';

import CustomErrorToast from '../errorToast';
import annoyed from '../assets/annoyed.gif';

const Home: NextPage = () => {
  const CtfContract = {
    address: contractAddress,
    abi: contractABI,
  } as const;

  const { address, isConnected } = useAccount();

  function formatAddress(address: string) {
    if (!address || address.length !== 42) return address;
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  }

  const {
    data: hash,
    isPending,
    writeContractAsync,
    error: mintError
  } = useWriteContract();

  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        ...CtfContract,
        functionName: 'endTime',
      },
      {
        ...CtfContract,
        functionName: 'flagOwner',
      },
      {
        ...CtfContract,
        functionName: 'getTotalSteals',
      },
      {
        ...CtfContract,
        functionName: 'userChallenges',
        args: [address],
      },
    ],
    blockTag: 'latest',
    query:{
    staleTime: 0, // Make data stale immediately, triggering refetches
    refetchInterval: 5000, // Refetch data every 5 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    enabled: isConnected, // Only run query when connected
    }
  });

  const [endTime, flagOwner, totalSteals, userChallenges] = data || [];

  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!endTime) return;

    const endTimestamp = Number(endTime.result) * 1000;

    const updateCountdown = () => {
      const now = Date.now();
      const timeLeft = endTimestamp - now;

      if (timeLeft <= 0) {
        setCountdown('Challenge ended');
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Hybrid CTF</title>
        <meta content="Very capture, such steal" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        {!isConnected && <ConnectButton />}
        {isConnected && (
          <>
            <ConnectButton />
            <h1 className={styles.title}>
              Hybrid <a href="#" style={{color:'#73f3b3'}}>Capture</a> the Flag
            </h1>

            <button
             style={{
              color: 'rgb(255, 255, 255)', // White text
              backgroundColor: 'rgb(54, 89, 96)', // Teal background
              borderRadius: '0.5rem', // Rounded corners
              display: 'flex', // Flexbox layout
              justifyContent: 'center', // Center content horizontally
              alignItems: 'center', // Center content vertically
              width: '248px', // Full width
              height: '48px', // Fixed height
              marginTop: '0.5rem', // Margin on top
              border: 'none', // Remove default border
              cursor: 'pointer', // Pointer cursor on hover
              fontFamily: 'Area Normal, sans-serif', // Specific font family
              fontSize: '1rem', // Medium font size
            }}

            onClick={async() =>
              writeContractAsync({
                ...CtfContract,
                chainId: 1225,
                functionName: 'steal',
              })
                .then((result) => {
                  // Check if the result indicates a success
                  if (result) {
                    toast.success(<CustomErrorToast
                      message="Nice!"
                      gifUrl='https://media1.tenor.com/m/AlrUVwjmtDQAAAAC/yikes-running.gif' // Replace with your desired GIF URL
                    />)

                  }
                })
                .catch((error) => {
                  console.error('Steal action failed:', error);
                        toast.error(<CustomErrorToast
                        message=""
                        gifUrl='https://media1.tenor.com/m/ciNDyf6AgH0AAAAd/disappointed-disappointed-fan.gif' // Replace with your desired GIF URL
                      /> )               })
            }
            disabled={isPending}
          >
            {isPending ? 'Stealing...' : 'Steal'}
          </button>
          <p>{address == flagOwner?.result ? "You own the flag!" : ""} </p>


            {mintError && (
              <div className={styles.error}>
                Error: {(mintError as BaseError).shortMessage || mintError.message}
              </div>
            )}

            {error && (
              <div className={styles.error}>
                Error fetching data: {error.message}
              </div>
            )}

            <div className={styles.grid}>
              <div className={styles.card}>
                <h2>Total Times Flag Was Stolen</h2>
                {/*@ts-ignore*/}
                <p>{totalSteals ? formatUnits(totalSteals.result, 0) : 'Loading...'}</p>
              </div>

              <div className={styles.card}>
                <h2>Current Flag Owner:</h2>
                <a
                  href={`https://explorer.buildonhybrid.com/address/${flagOwner?.result}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {/*@ts-ignore*/}
                  {flagOwner?.result ? formatAddress(flagOwner.result) : 'Loading...'}
                </a>
              </div>

              <div className={styles.card}>
                <h2>Your Steals</h2>
                {/*@ts-ignore*/}
                <p>{userChallenges ? formatUnits(userChallenges.result[0], 0) : 'Loading...'}</p>
              </div>

              <div className={styles.card}>
                <h2>Cumulative Hold Time</h2>
                {/*@ts-ignore*/}
                <p>{userChallenges ? formatUnits(userChallenges.result[1], 0) + ' seconds' : 'Loading...'}</p>
              </div>

              <div className={styles.card}>
                <h2>Last Claimed Timestamp</h2>
                {/*@ts-ignore*/}
                <p>{userChallenges ? new Date(Number(userChallenges.result[2]) * 1000).toLocaleString() : 'Loading...'}</p>
              </div>

              <div className={styles.card}>
                <h2>Block Divisible by 10 Challenge</h2>
                {/*@ts-ignore*/}
                <p>{userChallenges ? (userChallenges.result[3] ? 'Yes' : 'No') : 'Loading...'}</p>
              </div>

              <div className={styles.card}>
                <h2>Block Divisible by 50 Challenge</h2>
                {/*@ts-ignore*/}
                <p>{userChallenges ? (userChallenges.result[4] ? 'Yes' : 'No') : 'Loading...'}</p>
              </div>

              <div className={styles.card}>
                <h2>Stolen from Address Ending in 'A' or 'a' </h2>
                {/*@ts-ignore*/}
                <p>{userChallenges ? (userChallenges.result[5] ? 'Yes' : 'No') : 'Loading...'}</p>
              </div>

              <div className={styles.card}>
                <h2>Stolen from Address Ending in '22'</h2>
                {/*@ts-ignore*/}
                <p>{userChallenges ? (userChallenges.result[6] ? 'Yes' : 'No') : 'Loading...'}</p>
              </div>

              <div className={styles.card}>
                <h2>Challenge Ends in</h2>
                <p>{countdown}</p>
              </div>

             

            
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
