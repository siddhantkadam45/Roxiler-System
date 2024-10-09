import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Router } from 'express';
import { title } from 'process';
import zod, { any, string } from 'zod';
import axios from 'axios';
const CombinedRouter = Router();
const prisma = new PrismaClient();

// Define Zod validation schema for request body validation
const obj = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(),
    price: zod.number().optional(),
    page: zod.number().optional(),
    month: zod.number()
});

const checkmonth = zod.number();
CombinedRouter.get('/combined', async (req:any,res:any) => {
    try {
        const month = req.query.month;
        const result = checkmonth.safeParse(Number(month));
        if (!result || month > 12) {
            return res.status(400).json({ message: 'Enter valid Month' })
        }
        let  piechartdata = await axios.get(`http://localhost:3000/api/v1/charts/pie?month=${month}`)
        piechartdata = piechartdata.data;
        let barchartdata = await axios.get(`http://localhost:3000/api/v1/charts/bar?month=${month}`)
        barchartdata = barchartdata.data;
        let Staticsdata = await axios.get(`http://localhost:3000/api/v1/transactions/statistics?month=${month}`)
        Staticsdata = Staticsdata.data
        return res.status(200).json({barchartdata:barchartdata,Staticsdata:Staticsdata,piechartdata:piechartdata})
    }catch(error) {
        return res.status(500).json({message:"Internal Server Error "})
    }
})


export default CombinedRouter;