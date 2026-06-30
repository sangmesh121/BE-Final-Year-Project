import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
};

const BASE_URL = getBaseUrl();

export interface VerificationResult {
    filename: string;
    input_analysis: any;
    reference_search: any;
    verification_result: any;
}

export const VerificationService = {
    async verifyProduct(frontUri?: string | null, backUri?: string | null): Promise<VerificationResult> {
        try {
            const formData = new FormData();

            const appendImage = async (uri: string, key: string) => {
                if (!uri) return;
                const filename = uri.split('/').pop() || 'upload.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                if (Platform.OS === 'web') {
                    const res = await fetch(uri);
                    const blob = await res.blob();
                    formData.append(key, blob, filename);
                } else {
                    // @ts-ignore
                    formData.append(key, { uri, name: filename, type });
                }
            };

            await appendImage(frontUri || '', 'front_image');
            await appendImage(backUri || '', 'back_image');

            if (!frontUri && !backUri) {
                throw new Error("At least one image is required");
            }

            console.log(`Uploading to ${BASE_URL}/verify...`);
            const response = await fetch(`${BASE_URL}/verify`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Verification Error:', error);
            throw error;
        }
    },

    async checkPrice(frontUri?: string | null, backUri?: string | null, sortBy: string = 'price_asc'): Promise<any> {
        try {
            const formData = new FormData();

            const appendImage = async (uri: string, key: string) => {
                if (!uri) return;
                const filename = uri.split('/').pop() || 'upload.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                if (Platform.OS === 'web') {
                    const res = await fetch(uri);
                    const blob = await res.blob();
                    formData.append(key, blob, filename);
                } else {
                    // @ts-ignore
                    formData.append(key, { uri, name: filename, type });
                }
            };

            await appendImage(frontUri || '', 'front_image');
            await appendImage(backUri || '', 'back_image');

            if (!frontUri && !backUri) {
                throw new Error("At least one image is required");
            }

            console.log(`Checking price at ${BASE_URL}/price?sort=${sortBy}...`);
            const response = await fetch(`${BASE_URL}/price?sort=${sortBy}`, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) throw new Error(`Server Error ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Price Check Error:', error);
            throw error;
        }
    },

    async getProductDetails(frontUri?: string | null, backUri?: string | null): Promise<any> {
        try {
            const formData = new FormData();

            const appendImage = async (uri: string, key: string) => {
                if (!uri) return;
                const filename = uri.split('/').pop() || 'upload.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                if (Platform.OS === 'web') {
                    const res = await fetch(uri);
                    const blob = await res.blob();
                    formData.append(key, blob, filename);
                } else {
                    // @ts-ignore
                    formData.append(key, { uri, name: filename, type });
                }
            };

            await appendImage(frontUri || '', 'front_image');
            await appendImage(backUri || '', 'back_image');

            if (!frontUri && !backUri) {
                throw new Error("At least one image is required");
            }

            console.log(`Getting details at ${BASE_URL}/details...`);
            const response = await fetch(`${BASE_URL}/details`, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) throw new Error(`Server Error ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Details Error:', error);
            throw error;
        }
    }
};
