require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testHistory() {
    const logs = [];
    const log = (msg) => {
        console.log(msg);
        logs.push(msg);
    };
    const error = (msg) => {
        console.error(msg);
        logs.push("ERROR: " + JSON.stringify(msg));
    };

    log('Testing History...');

    try {
        // 1. Sign In
        const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
            email: 'dholesangmesh121@gmail.com',
            password: '1234567890'
        });

        if (authError) {
            error(authError);
            fs.writeFileSync('history_results.json', JSON.stringify({ success: false, logs }, null, 2));
            return;
        }
        log('Logged in: ' + user.id);

        // 2. Create Scan
        const scanData = {
            user_id: user.id,
            input_type: 'upload',
            intent: 'verify',
            image_url: 'https://via.placeholder.com/150',
            created_at: new Date()
        };

        log('Inserting Scan...');
        const { data: scan, error: scanError } = await supabase
            .from('scans')
            .insert(scanData)
            .select()
            .single();

        if (scanError) {
            error(scanError);
            fs.writeFileSync('history_results.json', JSON.stringify({ success: false, logs }, null, 2));
            return;
        }
        log('Scan Inserted: ' + scan.id);

        // 3. Create Result
        const resultData = {
            scan_id: scan.id,
            authenticity_status: 'Genuine',
            confidence_score: 0.95,
            product_name: 'Test Product',
            brand: 'Test Brand'
        };

        log('Inserting Result...');
        const { data: result, error: resultError } = await supabase
            .from('scan_results')
            .insert(resultData)
            .select()
            .single();

        if (resultError) {
            error(resultError);
        } else {
            log('Result Inserted');
        }

        // 4. Fetch History
        log('Fetching History...');
        const { data: history, error: historyError } = await supabase
            .from('scans')
            .select(`
            *,
            scan_results (*),
            price_results (*)
        `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (historyError) {
            error(historyError);
        } else {
            log(`Found ${history.length} history items.`);
            if (history.length > 0) {
                log('First item ID: ' + history[0].id);
            }
            fs.writeFileSync('history_results.json', JSON.stringify({ success: true, logs, historyCount: history.length, firstItem: history[0] }, null, 2));
        }
    } catch (err) {
        error(err);
        fs.writeFileSync('history_results.json', JSON.stringify({ success: false, logs, error: err.message }, null, 2));
    }
}

testHistory();
