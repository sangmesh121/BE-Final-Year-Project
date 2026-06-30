import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';

// Result Components
import { ProductSummaryCard } from '../../components/results/ProductSummaryCard';
import { VerificationResult } from '../../components/results/VerificationResult';
import { PricingResult } from '../../components/results/PricingResult';
import { DetailsResult } from '../../components/results/DetailsResult';

export const ScanResultScreen = ({ route, navigation }: any) => {
    const { colors } = useTheme();
    const params = route.params || {};
    const { method, intent, data, frontImage, backImage, scanId, mockResult } = params;
    const apiResult = params.apiResult || params.mockResult?.metadata;

    // Helper to map API result to UI
    const mapApiToUi = () => {
        if (apiResult && Object.keys(apiResult).length > 0) {
            console.log("Mapping API Result (ScanResultScreen):", apiResult);
            // Real Backend Data
            // Real Backend Data (CoT Structure)
            const info = apiResult.product_info || {};
            const result = apiResult.verification_result || {};

            // Legacy support check (if input_analysis exists, use old mapping, otherwise use new)
            if (apiResult.input_analysis) {
                const analysis = apiResult.input_analysis || {};
                const verification = apiResult.verification_result || {};
                const search = apiResult.reference_search || {};
                return {
                    productInfo: {
                        name: analysis.product_name || 'Analyzed Product',
                        brand: analysis.brand || 'Detected Brand',
                        sku: analysis.sku || 'N/A',
                        description: analysis.description || 'No description available.',
                        confidence: verification.similarity_score ? Math.round(verification.similarity_score * 100) : 0,
                        image: data || 'https://via.placeholder.com/300',
                        frontImage,
                        backImage
                    },
                    verificationData: {
                        status: (verification.is_authentic ? 'genuine' : 'fake') as 'genuine' | 'fake' | 'suspicious',
                        checks: [
                            { name: 'Visual Match', status: (verification.similarity_score > 0.8 ? 'pass' : 'warn') as 'pass' | 'warn' | 'fail', score: Math.round((verification.similarity_score || 0) * 100) },
                            { name: 'Feature Analysis', status: 'pass' as 'pass' | 'warn' | 'fail', score: 95 },
                            { name: 'Reference Check', status: (search.found_url ? 'pass' : 'fail') as 'pass' | 'warn' | 'fail', score: search.found_url ? 100 : 0 }
                        ]
                    }
                };
            }

            // New CoT Mapping
            const isAuthentic = result.is_authentic === true;
            const verdict = result.verdict || 'Unknown';
            const status = isAuthentic ? 'genuine' : (verdict === 'Suspect' ? 'suspicious' : 'fake');
            const confidence = Math.round((result.confidence_score || 0) * 100);

            // EXTRACT FORENSIC CHECKS
            let checks = [];

            if (apiResult.raw_forensic_analysis) {
                const forensic = apiResult.raw_forensic_analysis;
                // 1. Forensic Flags
                if (forensic.forensic_flags && forensic.forensic_flags.length > 0) {
                    checks = forensic.forensic_flags.map((flag: any) => ({
                        name: flag.check || 'Forensic Check',
                        status: (flag.status === 'PASS' ? 'pass' : 'fail') as 'pass' | 'warn' | 'fail',
                        score: flag.status === 'PASS' ? 100 : 0
                    }));
                }

                // 2. Health & Safety
                if (forensic.health_safety_assessment) {
                    const risk = forensic.health_safety_assessment.risk_level;
                    let safetyStatus: 'pass' | 'warn' | 'fail' = 'pass';
                    let safetyScore = 100;

                    if (risk === 'High Risk' || risk === 'Critical') {
                        safetyStatus = 'fail';
                        safetyScore = 0;
                    } else if (risk === 'Caution') {
                        safetyStatus = 'warn';
                        safetyScore = 50;
                    }

                    checks.push({
                        name: 'Health & Safety Audit',
                        status: safetyStatus,
                        score: safetyScore
                    });
                }
            }

            // Fallback if no detailed forensic flags found
            if (checks.length === 0) {
                checks = [
                    {
                        name: 'AI Confidence',
                        status: (confidence > 80 ? 'pass' : (confidence > 50 ? 'warn' : 'fail')) as 'pass' | 'warn' | 'fail',
                        score: confidence
                    },
                    {
                        name: 'Anomalies Check',
                        status: (result.anomalies && result.anomalies.length === 0) ? 'pass' : 'warn' as 'pass' | 'warn' | 'fail',
                        score: (result.anomalies && result.anomalies.length === 0) ? 100 : 50
                    }
                ];
            }

            return {
                productInfo: {
                    name: info.model || 'Analyzed Product',
                    brand: info.brand || 'Detected Brand',
                    sku: 'N/A',
                    description: result.reasoning || 'No analysis details provided.',
                    confidence: confidence,
                    image: data || 'https://via.placeholder.com/300',
                    frontImage,
                    backImage
                },
                verificationData: {
                    status: status as 'genuine' | 'fake' | 'suspicious',
                    checks: checks
                }
            };
        } else if (mockResult) {
            // Logic for existing mockResult if any (legacy from ScanScreen fallback)
            return {
                productInfo: {
                    name: mockResult.product_name || 'Simulated Product',
                    brand: mockResult.brand || 'Unknown',
                    sku: '---',
                    description: 'Metadata format is incomplete or missing.',
                    confidence: Math.round((mockResult.confidence_score || 0) * 100),
                    image: data || 'https://via.placeholder.com/300'
                },
                verificationData: {
                    status: (mockResult.authenticity_status === 'Genuine' ? 'genuine' : 'suspicious') as 'genuine' | 'fake' | 'suspicious',
                    checks: []
                }
            };
        } else {
            // Fallback default
            return {
                productInfo: {
                    name: 'Unknown Product',
                    brand: 'Unknown',
                    sku: '---',
                    description: 'Details could not be retrieved.',
                    confidence: 0,
                    image: data
                },
                verificationData: {
                    status: 'warn' as 'genuine' | 'fake' | 'suspicious',
                    checks: []
                }
            };
        }
    };

    const { productInfo, verificationData } = mapApiToUi();

    // Map Price Data
    const mapPriceData = () => {
        if (intent === 'price' && apiResult?.prices) {
            const prices = apiResult.prices || [];
            console.log("DEBUG: Raw API prices:", prices);
            if (prices.length === 0) return { bestPrice: 'N/A', averagePrice: 'N/A', options: [] };

            const best = prices.reduce((min: any, p: any) => p.price < min.price ? p : min, prices[0]);
            const avg = prices.reduce((sum: number, p: any) => sum + p.price, 0) / prices.length;

            const mappedOptions = prices.map((p: any) => ({
                seller: p.seller,
                price: `${p.currency} ${p.price.toFixed(2)}`,
                currency: p.currency,
                shipping: 'Check Link',
                rating: p.rating,
                link: p.link,
                best: p === best,
                availability: 'In stock', // Default if missing
                condition: 'New', // Default if missing
                shippingCost: p.shipping_cost || 'Free Shipping'
            }));

            console.log("DEBUG: Mapped options:", mappedOptions);
            console.log("DEBUG: First option link:", mappedOptions[0]?.link);

            return {
                bestPrice: `${best.currency} ${best.price.toFixed(2)}`,
                averagePrice: `${best.currency} ${avg.toFixed(2)}`,
                options: mappedOptions
            };
        }
        // Fallback if no real data
        return {
            bestPrice: 'N/A',
            averagePrice: 'N/A',
            options: []
        };
    };
    const pricingData = mapPriceData();

    // Map Details Data
    const mapDetailsData = () => {
        if (intent === 'details' && apiResult) {
            return {
                description: apiResult.description || 'No description available.',
                specs: apiResult.specs || [
                    { label: 'Brand', value: productInfo.brand },
                    { label: 'Name', value: productInfo.name }
                ]
            };
        }
        return {
            description: productInfo.name + " detected. Analysis complete.",
            specs: [
                { label: 'Brand', value: productInfo.brand },
                { label: 'Confidence', value: productInfo.confidence + '%' },
            ]
        };
    };
    const detailsData = mapDetailsData();

    const getIntentLabel = () => {
        switch (intent) {
            case 'verify': return 'Authenticity Check';
            case 'price': return 'Price Comparison';
            case 'details': return 'Product Details';
            default: return 'Scan Result';
        }
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Intent Badge */}
                <View style={[styles.badgeContainer, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{getIntentLabel()}</Text>
                </View>

                {/* Product Summary */}
                <ProductSummaryCard
                    image={productInfo.image}
                    frontImage={productInfo.frontImage}
                    backImage={productInfo.backImage}
                    name={productInfo.name}
                    brand={productInfo.brand}
                    sku={productInfo.sku}
                    description={productInfo.description}
                    confidence={productInfo.confidence}
                />

                {/* Dynamic Content Actions */}
                <View style={styles.content}>
                    {intent === 'verify' && (
                        <VerificationResult status={verificationData.status} checks={verificationData.checks} />
                    )}

                    {intent === 'price' && (
                        <PricingResult
                            bestPrice={pricingData.bestPrice}
                            averagePrice={pricingData.averagePrice}
                            options={pricingData.options}
                        />
                    )}

                    {intent === 'details' && (
                        <DetailsResult
                            description={detailsData.description}
                            specs={detailsData.specs}
                        />
                    )}
                </View>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    <Button
                        title={scanId ? "Saved to History ✓" : "Save to History"}
                        variant={scanId ? "outline" : "secondary"}
                        onPress={() => !scanId && alert('Scan should be auto-saved')}
                        disabled={!!scanId}
                        style={{ marginBottom: 10, opacity: scanId ? 0.8 : 1 }}
                    />
                    <Button title="Scan Another" variant="outline" onPress={() => navigation.navigate('ScanScreen')} />
                </View>

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: spacing.xl,
        paddingTop: spacing.m,
    },
    badgeContainer: {
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: '#eee',
    },
    badgeText: {
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    content: {
        marginBottom: spacing.l,
    },
    footer: {
        marginTop: spacing.m,
    },
});
