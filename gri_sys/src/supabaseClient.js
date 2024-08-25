// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ksghvxxxqapdcccovnte.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZ2h2eHh4cWFwZGNjY292bnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1NDc0NDIsImV4cCI6MjA0MDEyMzQ0Mn0.5UFWm_TxWR6DAOeERYn0AGx4nVfy-sLXh_uyFbwU-Ro'; // Replace with your Supabase Anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
