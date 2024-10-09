import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Router } from 'express';
import { title } from 'process';
import zod, { any, string } from 'zod';

const chartsRouter = Router();
const prisma = new PrismaClient();
import { Transaction } from '../Transactions/index';
import { Checkmonth } from '../Transactions/index';

const checkmonth = zod.number();
chartsRouter.get('/bar', async (req: any, res: any) => {
    try {
        const month = req.query.month;
        const result = checkmonth.safeParse(month);
        if (!result || month > 12) {
            return res.status(400).json({ message: 'Enter valid Month' })
        }

        const Totalrecords: Transaction[] = [];
        const extractrecord = await prisma.productTransaction.findMany();
        const MonthSatisfied: Transaction[] = [];
        extractrecord.forEach((item: any) => {
            if (Checkmonth(month, item.dateOfSale)) {
                MonthSatisfied.push(item)
            }
        })
        const Rangearray: any = [];
        const t = Calulateitem(MonthSatisfied, new Decimal(0), new Decimal(100))
        Rangearray.push([0, 100, Number(t)]);
        
        for (let i = 1; i <= 8; i++) {
            let s = `${i}01`;
            let e = `${i + 1}00`;
            let Start: Decimal = new Decimal(s);
            let end: Decimal = new Decimal(e);
            const result = Calulateitem(MonthSatisfied, Start, end)
            Rangearray.push([Number(Start), Number(end), Number(result)])
        }
        // // for 9 
        const fornine = Calulateitem(MonthSatisfied, new Decimal(901), new Decimal(1000))
        Rangearray.push([901, 1000, Number(fornine)])
        return res.status(202).json({ Rangearray: Rangearray })

    } catch (error) {
        return res.status(500).json({ message: 'internal server error' })
    }
})

function Calulateitem(MonthSatisfied: Transaction[], start: Decimal, end: Decimal): Number {
    let Totalitems = 0;
    let cntfornine = 0;

    MonthSatisfied.forEach((item: any) => {
        const temp = new Decimal(item.price).div(1000); 
        const price = temp;
        if (price.gte(new Decimal(901))) {
            cntfornine++; 
        } else if (price.gte(start) && price.lte(end)) {
            Totalitems++; 
        }
    });
    if (start.gte(new Decimal(901))) return cntfornine;

    return Totalitems;
}


chartsRouter.get('/pie', async(req:any,res:any) => {
    try{
        const month = req.query.month;
        const result = checkmonth.safeParse(month);
        if (!result || month > 12) {
            return res.status(400).json({ message: 'Enter valid Month' })
        }
        const extractrecord = await prisma.productTransaction.findMany();
        const categoryCountMap = new Map<string, number>();

        extractrecord.forEach((item) => {
            if(Checkmonth(month,item.dateOfSale)) {
                if (categoryCountMap.has(item.category)) {
                    categoryCountMap.set(item.category, categoryCountMap.get(item.category)! + 1);
                } else {
                    categoryCountMap.set(item.category, 1);
                }
            }
            
        });
        const Pierecords:any = Array.from(categoryCountMap.entries()).map(([category, count]) => ({
            category,
            count,
        }));
        return res.status(202).json({Categories_Record : Pierecords})
    }catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
})

export default chartsRouter;