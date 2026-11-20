import express from 'express';

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
  res.send("hi there")
})


app.listen(3000);