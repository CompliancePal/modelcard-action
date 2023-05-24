import express from 'express';
import { main } from '@compliancepal/modelcard-core';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
  const { modelCard, trackingUrl } = req.body;

  try {
    const mc = await main({
      modelCard,
      disableDefaultRules: false,
      plugins: [
        {
          type: 'mlflow',
          options: {
            trackingUrl,
          },
        },
      ],
    });

    res.status(200).json({
      modelCard: mc,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
