const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;



app.use(express.json());


app.get('/health', (req, res) => {
  try{
    res.status(200).send('Healthy');
  } catch(err){
    res.status(500).send('Unhealthy');
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})