require('dotenv').config();
const express = require('express');
const { ConnectDb } = require('./utils/ConnectDB');
const { errorHandler } = require('./middlewares/error-middleware');
const paymentRoute = require('./routes/idempotency-route');
const { userRoute } = require('./routes/user-route');
const cors = require('cors');
const cookiesParser = require('cookie-parser');
const healthRoute = require('./routes/health-route');

//initializing app
const app = express();

//connect to mongoDb
ConnectDb();

const port = process.env.PORT || 3000;

// security
app.use(express.json());
app.use(cookiesParser());
app.use(
  cors({
    origin: 'http://localhost:3001/',
    credentials: true,
  }),
);

// routes
app.use('/process-payment', paymentRoute);
app.use('/user', userRoute);
app.use('/health', healthRoute);

// errorHandler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listeening to the port : ${port}`);
});
