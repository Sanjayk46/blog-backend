const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors");
const cookieParser = require('cookie-parser');
const {connectionDB} = require('./database/db.js');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./Routes/blogRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

dotenv.config();
connectionDB();
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//routes connection
app.use('/api/user',userRoutes)
app.use('/api/blog',blogRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`server is running ${port}`)
})