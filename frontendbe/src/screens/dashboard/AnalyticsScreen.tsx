import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Container } from '../../components/Container';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { FontAwesome5 } from '@expo/vector-icons';
import { spacing } from '../../theme/colors';

export const AnalyticsScreen = ({ route, navigation }: any) => {
    const { colors, isDark } = useTheme();
    const { stats, selectedRef, rawStats } = route.params || { stats: [], selectedRef: 'Total Scans', rawStats: {} };

    // stats array looks like: [{ label: 'Total Scans', value: '124' }, { label: 'Verified', value: '98' }, { label: 'Issues', value: '3' }]
    const total = parseInt(stats.find((s: any) => s.label === 'Total Scans')?.value || '0', 10);
    const verified = parseInt(stats.find((s: any) => s.label === 'Verified')?.value || '0', 10);
    const issues = parseInt(stats.find((s: any) => s.label === 'Issues')?.value || '0', 10);

    const screenWidth = Dimensions.get('window').width - 40;

    const chartConfig = {
        backgroundGradientFrom: isDark ? colors.surface : '#FFFFFF',
        backgroundGradientTo: isDark ? colors.surface : '#FFFFFF',
        color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => colors.textSecondary,
        strokeWidth: 2, 
        barPercentage: 0.6,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
    };

    const renderTotalScansView = () => {
        const pieData = [
            {
                name: 'Verified',
                population: verified,
                color: '#00E676', // Vibrant Green
                legendFontColor: colors.text,
                legendFontSize: 13,
            },
            {
                name: 'Counterfeit',
                population: issues,
                color: '#FF3E4D', // Vibrant Red
                legendFontColor: colors.text,
                legendFontSize: 13,
            },
        ];

        const barData = {
            labels: ['Real', 'Fake'],
            datasets: [
                {
                    data: [verified, issues],
                    colors: [
                        () => '#00E676', // Green
                        () => '#FF3E4D', // Red
                    ]
                },
            ],
        };

        return (
            <>
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.cardHeader}>
                        <FontAwesome5 name="chart-pie" size={18} color={colors.primary} style={styles.cardIcon} />
                        <Text style={[styles.chartTitle, { color: colors.text }]}>Real vs Counterfeit Ratio</Text>
                    </View>
                    
                    {total > 0 ? (
                        <View style={styles.chartContainer}>
                            <PieChart
                                data={pieData}
                                width={screenWidth}
                                height={200}
                                chartConfig={chartConfig}
                                accessor={"population"}
                                backgroundColor={"transparent"}
                                paddingLeft={"5"}
                                center={[10, 0]}
                                absolute
                            />
                        </View>
                    ) : (
                        <Text style={{color: colors.textSecondary, padding: 30, textAlign: 'center'}}>No scan data available.</Text>
                    )}
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.cardHeader}>
                        <FontAwesome5 name="chart-bar" size={18} color={colors.primary} style={styles.cardIcon} />
                        <Text style={[styles.chartTitle, { color: colors.text }]}>Volume Comparison</Text>
                    </View>
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={barData as any}
                            width={screenWidth - 20}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            withCustomBarColorFromData={true}
                            flatColor={true}
                            chartConfig={{ 
                                ...chartConfig, 
                                color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})`,
                                barRadius: 8
                            }}
                            style={{ marginVertical: 8, borderRadius: 16 }}
                            fromZero
                            showValuesOnTopOfBars
                        />
                    </View>
                </View>
            </>
        );
    };

    const renderImageList = (images: any[], type: 'Verified' | 'Issues') => {
        if (!images || images.length === 0) {
            return (
                <View style={[styles.card, { backgroundColor: colors.surface, padding: 40, alignItems: 'center' }]}>
                    <FontAwesome5 name="image" size={40} color={colors.border} style={{ marginBottom: 15 }} />
                    <Text style={{color: colors.textSecondary, textAlign: 'center'}}>No {type.toLowerCase()} images recorded yet.</Text>
                </View>
            );
        }

        const typeColor = type === 'Issues' ? '#FF3E4D' : '#00E676';
        const typeIcon = type === 'Issues' ? 'exclamation-circle' : 'check-circle';

        return (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={styles.cardHeader}>
                    <FontAwesome5 name={typeIcon} size={18} color={typeColor} style={styles.cardIcon} />
                    <Text style={[styles.chartTitle, { color: colors.text }]}>
                        {type === 'Issues' ? 'Action Required' : 'Successfully Verified'}
                    </Text>
                </View>
                {images.map((scan, idx) => (
                    <View key={idx} style={[styles.imageRow, { borderBottomColor: isDark ? '#333' : '#F0F0F0', borderBottomWidth: idx === images.length - 1 ? 0 : 1 }]}>
                        <Image source={{ uri: scan.image_url }} style={styles.thumbnail} />
                        <View style={styles.imageInfo}>
                            <Text style={[styles.imageType, { color: typeColor }]}>
                                {type === 'Issues' ? 'Counterfeit Detected' : 'Verified Genuine'}
                            </Text>
                            <Text style={[styles.imageDate, { color: colors.textSecondary }]}>
                                {new Date(scan.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            style={[styles.actionBtn, { backgroundColor: type === 'Issues' ? 'rgba(255, 62, 77, 0.1)' : 'rgba(0, 230, 118, 0.1)' }]}
                            onPress={() => navigation.navigate('History')}
                        >
                            <Text style={{ color: typeColor, fontSize: 13, fontWeight: 'bold' }}>Review</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Text style={[styles.header, { color: colors.text }]}>{selectedRef} Analytics</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Detailed insights and tracking</Text>
                </View>
                
                {selectedRef === 'Total Scans' && renderTotalScansView()}
                {selectedRef === 'Verified' && renderImageList(rawStats?.verifiedList || [], 'Verified')}
                {selectedRef === 'Issues' && renderImageList(rawStats?.issuesList || [], 'Issues')}

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 40,
        paddingTop: 10,
    },
    headerContainer: {
        marginBottom: 25,
        paddingHorizontal: 5,
    },
    header: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    card: {
        marginBottom: 20,
        padding: 20,
        borderRadius: 20,
        // Premium soft shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardIcon: {
        marginRight: 10,
    },
    chartTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        width: '100%',
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 15,
        backgroundColor: '#eee',
    },
    imageInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    imageType: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 4,
    },
    imageDate: {
        fontSize: 12,
        fontWeight: '500',
    },
    actionBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
