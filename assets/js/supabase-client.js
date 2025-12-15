
const supabaseUrl = 'https://xgrzbdahkutqxjpyeked.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhncnpiZGFoa3V0cXhqcHlla2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MDU5MDIsImV4cCI6MjA4MTM4MTkwMn0.YA8X8IBYP9k1D8xjSYF77LRNfSuk9zvFy97S-v2xZSE';

if (supabaseUrl === 'YOUR_SUPABASE_URL') {
    console.error('Supabase URL is not set. Please update assets/js/supabase-client.js');
    alert('Please configure your Supabase credentials in assets/js/supabase-client.js');
}

if (!window.supabase) {
    console.error('Supabase SDK not found. Ensure script tag is in index.html and internet is connected.');
    // Default dummy client to prevent crash
    window.supabase = { createClient: () => null };
}

window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Helper function to check connection
window.checkConnection = async function () {
    if (!window.supabaseClient) return false;
    const { data, error } = await window.supabaseClient.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
        console.error('Error connecting to Supabase:', error.message);
        return false;
    }
    console.log('Connected to Supabase successfully.');
    return true;
}
