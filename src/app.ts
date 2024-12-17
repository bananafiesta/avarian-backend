import express from 'express';
import { router } from './routes/router';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());
app.get('/', (req, res) => {
  res.send('App is online');
});
// Version 1 API
app.use('/v1', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

