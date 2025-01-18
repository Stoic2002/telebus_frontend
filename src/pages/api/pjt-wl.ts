import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get('https://telemetri.jasatirta1.co.id:8006/apisvc/get-data/apikey=9f8a0aaf2665d1b478b935e82dcf1b6f&format=json&datatime=lastday&station=waterlevel&ws=4');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch telemetry data' });
  }
}