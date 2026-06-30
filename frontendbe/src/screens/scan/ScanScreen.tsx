import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, Alert, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Container } from '../../components/Container';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/colors';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';

// Components
import { MethodSelector, ScanMethod } from '../../components/scan/MethodSelector';
import { IntentSelector, ScanIntent } from '../../components/scan/IntentSelector';
import { useAuth } from '../../helpers/AuthContext';
import { SupabaseService } from '../../services/SupabaseService';
import { VerificationService } from '../../services/VerificationService';

export const ScanScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    // Params from Dashboard (e.g. mode='upload')
    const initialMode = route.params?.mode || 'camera';
    const initialIntent = route.params?.intent || 'verify';

    const [method, setMethod] = useState<ScanMethod>(initialMode);
    const [intent, setIntent] = useState<ScanIntent>(initialIntent);

    // Inputs
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const [activeSlot, setActiveSlot] = useState<'front' | 'back' | null>(null);
    const [url, setUrl] = useState('');

    // Camera
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        if (route.params?.mode) setMethod(route.params.mode);
        if (route.params?.intent) setIntent(route.params.intent);
    }, [route.params?.mode, route.params?.intent]);

    useFocusEffect(
        useCallback(() => {
            const loadPref = async () => {
                if (!route.params?.intent) {
                    try {
                        const savedIntent = await AsyncStorage.getItem('scan_preference');
                        if (savedIntent) {
                            setIntent(savedIntent.toLowerCase() as ScanIntent);
                        }
                    } catch (e) {
                        console.error('Failed to load scan preference', e);
                    }
                }
            };
            loadPref();
        }, [route.params?.intent])
    );

    useEffect(() => {
        if (method === 'camera' && !permission?.granted) {
            requestPermission();
        }
    }, [method]);

    const handlePickImage = async (slot: 'front' | 'back') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (slot === 'front') setFrontImage(result.assets[0].uri);
            else setBackImage(result.assets[0].uri);
        }
    };

    const handleCameraCapture = async () => {
        if (cameraRef.current && activeSlot) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (photo) {
                    if (activeSlot === 'front') setFrontImage(photo.uri);
                    else setBackImage(photo.uri);
                    setActiveSlot(null); // Return to overview
                }
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'Failed to take photo');
            }
        }
    };

    const handleClear = () => {
        setFrontImage(null);
        setBackImage(null);
        setActiveSlot(null);
        setUrl('');
    };

    const handleRemoveImage = (slot: 'front' | 'back') => {
        if (slot === 'front') setFrontImage(null);
        else setBackImage(null);
    };

    const handleSubmit = async () => {
        if (method === 'camera' || method === 'upload') {
            if (!frontImage && !backImage) {
                Alert.alert('Input Required', 'Please provide at least one image (Front or Back).');
                return;
            }
        } else if (method === 'url') {
            if (!url) {
                Alert.alert('Input Required', 'Please enter a URL.');
                return;
            }
        }

        if (!user) {
            Alert.alert('Auth Error', 'You must be logged in to scan.');
            return;
        }

        setIsProcessing(true);
        try {
            let apiResult = null;
            let finalImageUrl = null;
            let uploadedFrontUrl = null;
            let uploadedBackUrl = null;

            // 1. Upload & Verify
            if (method !== 'url') {
                if (!frontImage && !backImage) {
                    Alert.alert('Input Required', 'Please provide at least one image (Front or Back).');
                    setIsProcessing(false);
                    return;
                }

                try {
                    // Call our new Python Backend API based on intent
                    if (intent === 'price') {
                        console.log("Checking Price...");
                        apiResult = await VerificationService.checkPrice(frontImage, backImage);
                    } else if (intent === 'details') {
                        console.log("Getting Details...");
                        apiResult = await VerificationService.getProductDetails(frontImage, backImage);
                    } else {
                        // Default: verify
                        console.log("Verifying...");
                        apiResult = await VerificationService.verifyProduct(frontImage, backImage);
                    }

                    console.log("API Result:", apiResult);
                } catch (err) {
                    console.error("Backend Request Failed:", err);
                    Alert.alert("Request Failed", "Could not process image with backend.");
                    setIsProcessing(false);
                    return;
                }

                // Upload both images to Supabase Storage in parallel for persistence
                try {
                    const uploadPromises = [];
                    if (frontImage) {
                        uploadPromises.push(
                            SupabaseService.uploadImage(frontImage, 'scans').then(url => {
                                uploadedFrontUrl = url;
                            })
                        );
                    }
                    if (backImage) {
                        uploadPromises.push(
                            SupabaseService.uploadImage(backImage, 'scans').then(url => {
                                uploadedBackUrl = url;
                            })
                        );
                    }
                    await Promise.all(uploadPromises);

                    // For backward compatibility, set finalImageUrl to the main uploaded URL
                    finalImageUrl = uploadedFrontUrl || uploadedBackUrl;
                } catch (err) {
                    console.warn("Supabase upload failed, falling back to local URIs", err);
                    uploadedFrontUrl = frontImage;
                    uploadedBackUrl = backImage;
                    finalImageUrl = frontImage || backImage;
                }
            }

            // 2. Save Scan Record (History) - NON-BLOCKING
            let scanData = { id: 'temp-id-' + Date.now() }; // Fallback ID
            try {
                scanData = await SupabaseService.saveScan({
                    user_id: user?.id || 'anon',
                    input_type: method,
                    intent: intent,
                    image_url: finalImageUrl || undefined,
                    front_image_url: uploadedFrontUrl || undefined,
                    back_image_url: uploadedBackUrl || undefined,
                    website_url: method === 'url' ? url : undefined
                });
            } catch (err) {
                console.warn("Supabase History Save Failed (Non-critical):", err);
            }

            // 3. Save Results - NON-BLOCKING
            try {
                const resultForDb = {
                    scan_id: scanData.id,
                    authenticity_status: intent === 'verify' ? 'analyzed' : 'info_only',
                    confidence_score: 0,
                    product_name: apiResult?.product_name || 'Analysis Complete',
                    metadata: apiResult
                };
                await SupabaseService.saveScanResults(resultForDb);
            } catch (err) {
                console.warn("Supabase Result Save Failed (Non-critical):", err);
            }

            console.log("Navigating to ScanResult...", { apiResult, intent });

            // 4. Navigate with Real Data (Using local URIs for instant rendering)
            navigation.navigate('ScanResult', {
                method,
                intent,
                data: frontImage || backImage || url,
                frontImage: frontImage,
                backImage: backImage,
                scanId: scanData.id,
                mockResult: null, // Clear mock
                apiResult: apiResult // Pass real result
            });

        } catch (error: any) {
            Alert.alert('Scan Failed', error.message || 'Could not save scan.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Render Camera Interface
    const renderCameraInterface = () => {
        // If we are actively scanning a slot, show camera
        if (activeSlot) {
            if (!permission?.granted) {
                return (
                    <View style={styles.inputContainer}>
                        <Text style={{ textAlign: 'center', marginBottom: 10, color: colors.text }}>We need your permission to show the camera</Text>
                        <Button onPress={requestPermission} title="Grant Permission" />
                    </View>
                );
            }

            return (
                <View style={[styles.inputContainer, { padding: 0, overflow: 'hidden', height: 400, backgroundColor: '#000' }]}>
                    <CameraView style={{ flex: 1 }} ref={cameraRef}>
                        <View style={styles.cameraOverlay}>
                            <Text style={styles.overlayText}>{activeSlot === 'front' ? "Scan Front (Brand/Logo)" : "Scan Back (Ingredients/Info)"}</Text>
                            <View style={styles.scanFrame} />
                            <TouchableOpacity style={styles.captureBtn} onPress={handleCameraCapture}>
                                <View style={styles.captureInner} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeCameraBtn} onPress={() => setActiveSlot(null)}>
                                <FontAwesome5 name="times" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                </View>
            );
        }

        // Otherwise show the Dual Slot Selector
        return renderDualSlotSelector();
    };

    // Render Dual Slot Selector (for both Camera and Upload modes)
    const renderDualSlotSelector = () => {
        const renderSlot = (slot: 'front' | 'back', image: string | null, label: string) => (
            <TouchableOpacity
                style={[styles.slotContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => {
                    if (image) return; // Do nothing if image exists (use clear button)
                    if (method === 'camera') setActiveSlot(slot);
                    else handlePickImage(slot);
                }}
            >
                {image ? (
                    <>
                        <Image source={{ uri: image }} style={styles.slotImage} />
                        <TouchableOpacity style={styles.slotClearBtn} onPress={() => handleRemoveImage(slot)}>
                            <FontAwesome5 name="times-circle" size={24} color="#FF5252" />
                        </TouchableOpacity>
                        <View style={styles.slotBadge}>
                            <Text style={styles.slotBadgeText}>{label}</Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.slotPlaceholder}>
                        <FontAwesome5 name={method === 'camera' ? "camera" : "image"} size={32} color={colors.textSecondary} />
                        <Text style={[styles.slotLabel, { color: colors.textSecondary }]}>Add {label}</Text>
                        <Text style={[styles.slotSubLabel, { color: colors.textSecondary }]}>
                            {slot === 'front' ? 'Logo & Branding' : 'Ingredients & Info'}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );

        return (
            <View style={styles.dualContainer}>
                {renderSlot('front', frontImage, "Front View")}
                {renderSlot('back', backImage, "Back View")}
                <Text style={{ textAlign: 'center', marginTop: 10, color: colors.textSecondary, fontSize: 12 }}>
                    For best results, upload both views.
                </Text>
            </View>
        );
    };

    // Render URL Input
    const renderUrlInput = () => (
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Submit Product Link</Text>
            <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? '#333' : '#fff' }]}
                placeholder="https://example.com/product/..."
                placeholderTextColor={colors.textSecondary}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                keyboardType="url"
            />
            <Button title="Paste" variant="outline" onPress={() => Alert.alert('Paste', 'Paste logic here')} style={{ alignSelf: 'flex-start' }} />
        </View>
    );

    const getButtonTitle = () => {
        switch (intent) {
            case 'verify': return 'Verify Authenticity';
            case 'price': return 'Check Pricing';
            case 'details': return 'Get Product Details';
            default: return 'Submit';
        }
    };

    return (
        <Container>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <MethodSelector selectedMethod={method} onSelect={(m) => { handleClear(); setMethod(m); }} />

                {/* Dynamic Input Area */}
                <View style={styles.section}>
                    {method === 'camera' && renderCameraInterface()}
                    {method === 'upload' && renderDualSlotSelector()}
                    {method === 'url' && renderUrlInput()}
                </View>

                {/* Intent Selection */}
                <IntentSelector selectedIntent={intent} onSelect={setIntent} />

                {/* Submit */}
                <Button
                    title={isProcessing ? "Processing..." : getButtonTitle()}
                    onPress={handleSubmit}
                    style={{ marginTop: spacing.m }}
                    disabled={isProcessing || ((!frontImage && !backImage) && method !== 'url') || (method === 'url' && !url)}
                    loading={isProcessing}
                />
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: spacing.xl,
        paddingTop: spacing.m,
    },
    section: {
        marginBottom: spacing.l,
    },
    inputContainer: {
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        minHeight: 150,
        justifyContent: 'center',
        padding: spacing.m,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: spacing.m,
        marginBottom: 10,
    },
    // Camera Styles
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 40,
    },
    scanFrame: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        right: '10%',
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 12,
    },
    captureBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    retakeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    // Dual Slot Styles
    dualContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    slotContainer: {
        flex: 1,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
        height: 180,
        overflow: 'hidden',
        position: 'relative',
    },
    slotPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    slotLabel: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 14,
    },
    slotSubLabel: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 4,
    },
    slotImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    slotClearBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    slotBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 4,
        alignItems: 'center',
    },
    slotBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    overlayText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    closeCameraBtn: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        borderRadius: 30,
    },
});
