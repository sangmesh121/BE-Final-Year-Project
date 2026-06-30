require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rscsxqoiyfbgoaizyzsr.supabase.co';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY3N4cW9peWZiZ29haXp5enNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDQ5NTYsImV4cCI6MjA3NjI4MDk1Nn0.M0XUBniLuduU3i1E_qLgS09_lcXzZB3RLoxZ_GL9XWs';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing Supabase Credentials in environment variables.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const testEmail = 'dholesangmesh121@gmail.com';
const testPassword = '1234567890';

async function testAuth() {
    console.log(`Testing Auth with: ${testEmail}`);

    // 1. Try Sign In FIRST
    console.log('1. Attempting Sign In...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
    });

    if (signInData.session) {
        console.log('SUCCESS: Sign In successful!');
        console.log('User ID:', signInData.user.id);
        console.log('Access Token:', signInData.session.access_token.substring(0, 20) + '...');
        return; // Exit if success
    }

    if (signInError) {
        console.log('Sign In Failed:', signInError.message);
        if (signInError.message.includes('Email not confirmed')) {
            console.error('CRITICAL: User exists but email is NOT confirmed. Please check inbox or disable confirmation in Supabase.');
            return;
        }
    }

    // 2. If Sign In failed (and not just unconfirmed), try Sign Up
    console.log('\n2. Attempting Sign Up...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
    });

    if (signUpError) {
        console.error('Sign Up Failed:', signUpError.message);
        return;
    }

    console.log('Sign Up Success:', signUpData.user ? 'User Created' : 'No User Returned');

    if (signUpData.session) {
        console.log('SUCCESS: Session received immediately (Email verification DISABLED).');
    } else if (signUpData.user && !signUpData.session) {
        console.log('WARNING: User created but NO session. Email verification is ENABLED.');
        console.log('Please check your email to verify account.');
    }
}

testAuth();
