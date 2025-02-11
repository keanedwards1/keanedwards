import dotenv from 'dotenv';
dotenv.config();

import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

console.log('FaunaDB Secret:', process.env.FAUNADB_SECRET); // Add this line to debug

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const data = req.body;

    // Test query to verify connection
    const testResult = await client.query(q.Paginate(q.Collections()));
    console.log('Test query result:', testResult);

    // Save the data into the "contact_submissions" collection
    const result = await client.query(
      q.Create(q.Collection('contact_submissions'), { data })
    );

    return res.status(200).json({ message: 'Data saved successfully!', result });
  } catch (error) {
    console.error('Error saving to FaunaDB:', error.message);
    console.error(error);
    return res.status(500).json({ error: 'Error saving data to database' });
  }
}