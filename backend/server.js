import express from 'express';
import connectDb from './config/db.js';
import productRoutes from './routes/product.route.js'
import userRoutes from './routes/user.route.js'
import {notFound,errorHandler} from './middleware/error.middleware.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import multer from 'multer'
const upload = multer();

dotenv.config()
const port = process.env.PORT || 5000;

connectDb() 
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(upload.array())
app.use(cookieParser())



//ROUTES
app.use('/api/products',productRoutes)
app.use('/api/users',userRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})