import express from 'express';
const App = express();
import cors from 'cors'
App.use(cors());
import dotenv from 'dotenv';
dotenv.config();
App.use(express.json());

import transactionsRoutes from './Routes/Transactions';
import chartsRouter from './Routes/Charts/Charts';
import CombinedRouter from './Routes/Combined/Combined';
    
const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is undefined

App.use('/api/v1/transactions', transactionsRoutes);
App.use('/api/v1/charts', chartsRouter);
App.use('/api/v1', CombinedRouter);


// App.listen(process.env.p)
// console.log(PORT)
App.listen(PORT, () => {
    console.log('App is listning on port : ', PORT )
})