import { supabase } from './supabase';
import { Platform } from 'react-native';

export const SupabaseService = {
    // --- USER PROFILE ---
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async updateProfile(userId: string, updates: any) {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);
        if (error) throw error;
    },

    // --- USER SETTINGS ---
    async getUserSettings(userId: string) {
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async updateUserSettings(userId: string, updates: any) {
        const { error } = await supabase
            .from('user_settings')
            .update(updates)
            .eq('user_id', userId);
        if (error) throw error;
    },

    // --- SCANS ---
    async saveScan(scanData: { 
        user_id: string; 
        input_type: string; 
        intent: string; 
        image_url?: string; 
        front_image_url?: string; 
        back_image_url?: string; 
        website_url?: string 
    }) {
        const { data, error } = await supabase
            .from('scans')
            .insert(scanData)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async saveScanResults(resultData: any) {
        const { error } = await supabase
            .from('scan_results')
            .insert(resultData);
        if (error) throw error;
    },

    async savePriceResults(resultData: any) {
        const { error } = await supabase
            .from('price_results')
            .insert(resultData);
        if (error) throw error;
    },

    async getUserHistory(userId: string, page: number = 1, limit: number = 5) {
        // Calculate pagination range
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Fetch scans with their results, ordered by creation date descending
        const { data, error, count } = await supabase
            .from('scans')
            .select(`
                *,
                scan_results (*),
                price_results (*)
            `, { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        // Resolve relative storage URLs to public URLs
        const resolvedData = (data || []).map((scan: any) => ({
            ...scan,
            image_url: SupabaseService.getStorageUrl(scan.image_url),
            front_image_url: SupabaseService.getStorageUrl(scan.front_image_url),
            back_image_url: SupabaseService.getStorageUrl(scan.back_image_url)
        }));

        const totalRecords = count || 0;
        const totalPages = Math.ceil(totalRecords / limit);

        return {
            currentPage: page,
            totalPages: totalPages,
            totalRecords: totalRecords,
            data: resolvedData
        };
    },

    async getDashboardStats(userId: string) {
        const { data, error } = await supabase
            .from('scans')
            .select('*, scan_results(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
            
        if (error) throw error;

        // Resolve relative storage URLs to public URLs
        const resolvedData = (data || []).map((scan: any) => ({
            ...scan,
            image_url: SupabaseService.getStorageUrl(scan.image_url),
            front_image_url: SupabaseService.getStorageUrl(scan.front_image_url),
            back_image_url: SupabaseService.getStorageUrl(scan.back_image_url)
        }));
        
        let verifiedCount = 0;
        let issuesCount = 0;
        let verifiedList: any[] = [];
        let issuesList: any[] = [];
        
        resolvedData.forEach(scan => {
            const result = scan.scan_results?.[0];
            if (!result) return;
            
            let isVerified = false;
            let isFake = false;

            // Direct properties mapping (legacy fallback)
            if (result.is_authentic === true || result.status === 'authentic') isVerified = true;
            else if (result.is_authentic === false || result.status === 'counterfeit' || result.status === 'fake') isFake = true;

            // Deep properties mapping (v3 & latest API responses)
            if (result.metadata) {
                const meta = result.metadata;
                
                // Newer CoT structure
                if (meta.verification_result) {
                    if (meta.verification_result.is_authentic === true || meta.verification_result.verdict === 'Genuine') isVerified = true;
                    else if (meta.verification_result.is_authentic === false || meta.verification_result.verdict === 'Suspect' || meta.verification_result.verdict === 'Counterfeit') isFake = true;
                } 
                // Older direct metadata
                else if (meta.is_authentic !== undefined) {
                    if (meta.is_authentic === true) isVerified = true;
                    else isFake = true;
                }
            }

            if (isVerified) {
                verifiedCount++;
                if (scan.image_url) verifiedList.push(scan);
            } else if (isFake) {
                issuesCount++;
                if (scan.image_url) issuesList.push(scan);
            }
        });
        
        return {
            total: resolvedData.length,
            verified: verifiedCount,
            issues: issuesCount,
            verifiedList: verifiedList,
            issuesList: issuesList,
            recentScans: resolvedData.slice(0, 3)
        };
    },

    // --- SUPPORT ---
    async createSupportTicket(ticket: { user_id: string; subject: string; message: string }) {
        const { error } = await supabase
            .from('support_tickets')
            .insert(ticket);
        if (error) throw error;
    },

    // --- STORAGE ---
    async uploadImage(uri: string, bucket: string = 'scans') {
        try {
            let fileName = `${Date.now()}.jpg`;
            let fileData: any;

            if (Platform.OS === 'web') {
                const response = await fetch(uri);
                fileData = await response.blob();
            } else {
                const ext = uri.substring(uri.lastIndexOf('.') + 1) || 'jpg';
                fileName = `${Date.now()}.${ext}`;
                const formData = new FormData();
                formData.append('file', {
                    uri,
                    name: fileName,
                    type: `image/${ext}`,
                } as any);
                fileData = formData;
            }

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, fileData);

            if (error) throw error;

            return fileName;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    },
    // --- SECURITY & ACCOUNT ---
    async updatePassword(newPassword: string) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
    },

    async deleteUserAccount(userId: string) {
        // Delete all data. Due to cascade on profile, deleting profile should be enough.
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);
        if (error) throw error;

        // Note: We cannot delete the Auth User from client side without Edge Function.
        // We will just sign out after data wipe.
        await supabase.auth.signOut();
    },

    async getFullUserData(userId: string) {
        // Parallel fetching for export
        const [profile, settings, scans, tickets] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', userId).single(),
            supabase.from('user_settings').select('*').eq('user_id', userId).single(),
            supabase.from('scans').select('*, scan_results(*), price_results(*)').eq('user_id', userId),
            supabase.from('support_tickets').select('*').eq('user_id', userId)
        ]);

        return {
            profile: profile.data,
            settings: settings.data,
            scans: scans.data,
            support_tickets: tickets.data,
            exported_at: new Date().toISOString()
        };
    },

    getStorageUrl(path: string | null | undefined) {
        if (!path) return undefined;
        if (
            path.startsWith('http://') || 
            path.startsWith('https://') || 
            path.startsWith('file://') || 
            path.startsWith('content://') || 
            path.startsWith('blob:')
        ) {
            return path;
        }
        return supabase.storage.from('scans').getPublicUrl(path).data.publicUrl;
    },

    async ensureUserProfile(user: any) {
        try {
            // 1. Check/Insert profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();

            if (!profile) {
                console.log('Profile missing, creating one...');
                const { error: insertProfileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                        email: user.email
                    });
                if (insertProfileError) console.error('Failed to auto-create profile:', insertProfileError);
            }

            // 2. Check/Insert user settings
            const { data: settings } = await supabase
                .from('user_settings')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (!settings) {
                console.log('Settings missing, creating one...');
                const { error: insertSettingsError } = await supabase
                    .from('user_settings')
                    .insert({ user_id: user.id });
                if (insertSettingsError) console.error('Failed to auto-create settings:', insertSettingsError);
            }

            // 3. Check/Insert subscription
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (!subscription) {
                console.log('Subscription missing, creating one...');
                const { error: insertSubError } = await supabase
                    .from('subscriptions')
                    .insert({ user_id: user.id });
                if (insertSubError) console.error('Failed to auto-create subscription:', insertSubError);
            }
        } catch (e) {
            console.error('Error in ensureUserProfile:', e);
        }
    }
};
