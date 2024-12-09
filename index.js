const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors");
const cookieParser = require('cookie-parser');
const {connectionDB} = require('./database/db.js');
//const userRoutes = require('./routes/userRoutes');
// const blogRoutes = require('./Routes/blogRoutes');
const studentRoutes = require('./Routes/student');
const markRoutes = require('./Routes/mark');
const { notFound, errorHandler } = require('./middleware/ErrorMiddleware');

dotenv.config();
connectionDB();
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//routes connection
//app.use('/api/user',userRoutes)
//app.use('/api/blog',blogRoutes);
app.use('/api/student',studentRoutes);
app.use('/api/mark',markRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`server is running ${port}`)
})
