import 'dotenv/config.js';
import express from 'express';
import {authenticationMiddleware} from './src/middleware/auth.middleware.js';
import userRoutes from './src/routes/user.routes.js';
import urlRoutes from './src/routes/url.routes.js';


const app = express();
const PORT = process.env.PORT || 8000;


app.use(express.json());
app.use(authenticationMiddleware);

app.get('/health', (req, res) => {
  try{
    res.status(200).send('Healthy');
  } catch(err){
    res.status(500).send('Unhealthy');
  }
})

app.use(urlRoutes);
app.use('/user', userRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})