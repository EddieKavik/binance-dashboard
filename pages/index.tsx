import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    SimpleGrid,
    Badge,
    Spinner,
    Button,
    Flex,
    Text,
} from '@chakra-ui/react';

interface Trade {
    time: string;
    pair: string;
    price: number;
    size: number;
    volatility: number;
    action: string;
    stopPrice: number;
}

export default function Home() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/trades').then(res => res.json()),
            fetch('/api/status').then(res => res.json()),
        ]).then(([trades, status]) => {
            setTrades(trades);
            setStatus(status);
            setLoading(false);
        });
    }, []);

    return (
        <Box minH="100vh" bg="#f7fafc" p={{ base: 2, md: 8 }}>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg">Binance Bot Dashboard</Heading>
            </Flex>
            {loading ? (
                <Flex justify="center" align="center" minH="40vh">
                    <Spinner size="xl" />
                </Flex>
            ) : (
                <>
                    <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mb={8}>
                        <Box p={4} bg="white" boxShadow="md" borderRadius="lg">
                            <Text fontSize="sm" color="gray.500">Balance</Text>
                            <Text fontSize="2xl" fontWeight="bold">
                                ${status?.balance?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </Text>
                            <Text fontSize="sm" color="gray.400">Current USDT</Text>
                        </Box>
                        <Box p={4} bg="white" boxShadow="md" borderRadius="lg">
                            <Text fontSize="sm" color="gray.500">Open Trades</Text>
                            <Text fontSize="2xl" fontWeight="bold">
                                {status?.openTrades}
                            </Text>
                            <Text fontSize="sm" color="gray.400">Active Positions</Text>
                        </Box>
                        <Box p={4} bg="white" boxShadow="md" borderRadius="lg">
                            <Text fontSize="sm" color="gray.500">Daily PnL</Text>
                            <Text fontSize="2xl" fontWeight="bold" color={status?.dailyPnL >= 0 ? 'green.400' : 'red.400'}>
                                ${status?.dailyPnL?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </Text>
                            <Text fontSize="sm" color="gray.400">Today</Text>
                        </Box>
                        <Box p={4} bg="white" boxShadow="md" borderRadius="lg">
                            <Text fontSize="sm" color="gray.500">Status</Text>
                            <Badge colorScheme={status?.running ? 'green' : 'red'} fontSize="1em">
                                {status?.running ? 'Running' : 'Stopped'}
                            </Badge>
                        </Box>
                    </SimpleGrid>

                    <Heading size="md" mb={4}>Trade Log</Heading>
                    <Box bg="white" boxShadow="md" borderRadius="lg" p={4} overflowX="auto">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: 8, textAlign: 'left' }}>Time</th>
                                    <th style={{ padding: 8, textAlign: 'left' }}>Pair</th>
                                    <th style={{ padding: 8, textAlign: 'right' }}>Price</th>
                                    <th style={{ padding: 8, textAlign: 'right' }}>Size</th>
                                    <th style={{ padding: 8, textAlign: 'right' }}>Volatility</th>
                                    <th style={{ padding: 8, textAlign: 'left' }}>Action</th>
                                    <th style={{ padding: 8, textAlign: 'right' }}>Stop Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: 16 }}>No trades yet.</td>
                                    </tr>
                                ) : (
                                    trades.slice().reverse().map((t, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: 8 }}>{new Date(t.time).toLocaleString()}</td>
                                            <td style={{ padding: 8 }}><Badge colorScheme="purple">{t.pair}</Badge></td>
                                            <td style={{ padding: 8, textAlign: 'right' }}>{t.price}</td>
                                            <td style={{ padding: 8, textAlign: 'right' }}>{t.size}</td>
                                            <td style={{ padding: 8, textAlign: 'right' }}>{t.volatility.toFixed(4)}</td>
                                            <td style={{ padding: 8 }}>
                                                <Badge colorScheme={t.action === 'buy' ? 'green' : 'red'}>{t.action.toUpperCase()}</Badge>
                                            </td>
                                            <td style={{ padding: 8, textAlign: 'right' }}>{t.stopPrice}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </Box>
                </>
            )}
        </Box>
    );
} 