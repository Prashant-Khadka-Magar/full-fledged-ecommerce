import express from 'express';
import connectDb from './config/db.js';
import productRoutes from './routes/product.route.js'
import {notFound,errorHandler} from './middleware/error.middleware.js'
import dotenv from 'dotenv'
dotenv.config()
const port = process.env.PORT || 5000;

connectDb() 
const app=express();

app.use('/api/products',productRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})