import express from 'express';
const app = express();
const PORT = process.env.PORT || 8000;
import userRoutes from './src/routes/user.routes.js';


app.use(express.json());


app.get('/health', (req, res) => {
  try{
    res.status(200).send('Healthy');
  } catch(err){
    res.status(500).send('Unhealthy');
  }
})

app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})