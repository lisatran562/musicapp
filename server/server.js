const express = require('express')
const app = express()
const cors = require('cors')

const cookieParser = require('cookie-parser');

require('dotenv').config()
require('./configs/mongoose.config')

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());

require('./routes/user.routes') (app)



app.listen(8000, () => console.log('Listening to port 8000'))