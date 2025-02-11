// /api/contact.js

// cSpell:ignore faunadb
import dotenv from 'dotenv';
dotenv.config(); // Only needed for local development

import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET, // Set this in your Vercel dashboard or .env file
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const data = req.body;

    // Save the data into the "contact_submissions" collection
    const result = await client.query(
      q.Create(q.Collection('contact_submissions'), { data })
    );

    return res.status(200).json({ message: 'Data saved successfully!', result });
  } catch (error) {
    console.error('Error saving to FaunaDB:', error);
    return res.status(500).json({ error: 'Error saving data to database' });
  }
}
