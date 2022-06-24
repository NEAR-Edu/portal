import { NextApiRequest, NextApiResponse } from 'next';
import { migrate } from '../../helpers/migrateFromAirtable';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ONEDAY Add security. Also, handle pagination in smaller batches. Allow resuming from most recent record already imported.
  try {
    const result = await migrate();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.json('Error. Check logs.');
  }
}
