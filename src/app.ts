import express from 'express';
import { router } from './routes/router';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());
app.get('/', (req, res) => {
  res.send('App is online');
});

app.use('/api', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

