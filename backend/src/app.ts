import express from 'express';
import userRoutes from './routes/userRoutes'
const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
  res.send("hi there")
})

app.use('/user' , userRoutes)



app.listen(3000);