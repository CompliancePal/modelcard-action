import type { NextApiRequest, NextApiResponse } from 'next';
import { main } from '@compliancepal/modelcard-core';

type Data = {
  modelCard: object;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }

  const { modelCard } = req.body;

  try {
    const mc = await main({
      modelCard,
      disableDefaultRules: false,
      plugins: [],
      logger: console,
    });

    res.status(200).json({
      modelCard: mc,
    });
  } catch (error) {
    res.status(400).json(error);
  }
}
