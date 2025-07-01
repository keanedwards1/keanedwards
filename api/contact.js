// /api/contact.js
import dotenv from 'dotenv';
dotenv.config(); // For local development

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Or use your anon key if you’ve configured RLS

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key not provided.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 🔥 Dummy read to keep Supabase active
  await supabase.from('contact_submissions').select('id').limit(1);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  try {
    // Ensure the request body is parsed as JSON
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Debugging: Log the incoming data
    console.log('Incoming Data:', data);
    
    // Insert data into the "contact_submissions" table
    const { data: insertedData, error } = await supabase
      .from('contact_submissions')
      .insert([{ ...data }]);
      
    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      return res.status(500).json({ error: 'Error inserting data into Supabase' });
    }
    
    return res.status(200).json({ message: 'Info Sent!', data: insertedData });
  } catch (error) {
    console.error('Error saving data:', error);
    return res.status(500).json({ error: 'Error saving data' });
  }
}

