import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Router } from 'express';
import { title } from 'process';
import zod, { any, string } from 'zod';

const transactionsRoutes = Router();
const prisma = new PrismaClient();

// Define Zod validation schema for request body validation
const obj = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(),
    price: zod.number().optional(),
    page: zod.number().optional(),
    month: zod.number()
});


export interface Transaction {
    id: number;
    product_id: number;
    title: string;
    price: Decimal;
    description: string;
    category: string;
    image: string;
    sold: boolean;
    dateOfSale: Date;
    
}


export const Checkmonth = (month: Number , correspoinding_item_date:Date ) => {
    const Monthof_correspondingitem = correspoinding_item_date.getMonth();
    if(Number(month) - 1  == Monthof_correspondingitem) return true;
    return false
}

transactionsRoutes.get('/', async (req: any, res: any) => {
    try {
        console.log(req.query)
        let che =   req.query.price ? Number(req.query.price) : undefined;

        const succees = obj.safeParse({
            title: String(req.query.title),
            description: String(req.query.description),
            price: Number(req.query.price),
            month: Number(req.query.month),
            page: Number(req.query.page)
        });
        console.log(succees)
        if (!succees) {
            return res.status(400).json({ message: 'Send valid Crediantals' })
        }
        if(req.query.month == undefined || Number(req.query.month )>12) return res.status(400).json({message:'Please provide Details of month'})
        
        const { title = '', description = '', page = 1 ,month=3} = req.query;
        let price = String(che)
        let pagination_start = 1;
        let checkpaginationvalue = false;

        if (title.length == 0 && price.length == 0 && description.length == 0) {
            pagination_start = Number(page)
            if (req.query.page == undefined || null) checkpaginationvalue = true;
        }


        // for title 
        const tostoredetails = []
        if (title.length > 0) {
            const titleResponse = await prisma.productTransaction.findMany({
                where: {
                    title: String(title)
                }
            })
            tostoredetails.push(...titleResponse);
        }
        // for descritption 
        if (description.length > 0) {
            const descriptionResponse = await prisma.productTransaction.findMany({
                where: {
                    description: String(description)
                }
            })
            tostoredetails.push(...descriptionResponse);
        }

        // for prices 
        if (price.length > 0) {
            const priceResponse = await prisma.productTransaction.findMany({
                where: {
                    price: parseFloat(price) * 100
                }
            })
            tostoredetails.push(...priceResponse);
        }
        let FinalitemList:Transaction[] = []

        if (title.length > 0 || price.length > 0 || description.length > 0) {

            const uniquetransaction: Transaction[] = tostoredetails.reduce((accumulator: any, current: any) => {
                const existingtransaction = accumulator.find((item: any) => item.product_id === current.product_id);
                if (!existingtransaction) {
                    accumulator.push(current);
                }
                return accumulator;
            }, []);
            FinalitemList = ReturnrecordbasedonMonth(month,uniquetransaction)
            return res.status(200).json({ transacions: FinalitemList });
        }

        if (!checkpaginationvalue && page < 7) {
            pagination_start = (page - 1) * 10 + 1;
            const endpage = page * 10;
            const  response = await prisma.productTransaction.findMany({
                where: {
                    product_id: {
                        gte: pagination_start,
                        lte: endpage
                    }
                }
            })
            FinalitemList = ReturnrecordbasedonMonth(month,response)
            return res.status(200).json({ transacions: FinalitemList });
        }
        const response = await prisma.productTransaction.findMany({
            where: {
                product_id: {
                    gte: 1,
                    lte: 10
                }
            }
        });
        FinalitemList = ReturnrecordbasedonMonth(month,response)
        return res.status(200).json({ transacions: FinalitemList });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})



function ReturnrecordbasedonMonth(month:any,response:any):Transaction[] {
    const FinalitemList:Transaction[] = []
    response.forEach((transaction: any) => {
        if (Checkmonth(month, transaction.dateOfSale)) {
            if (transaction && transaction.price) {
                transaction.price = new Decimal(transaction.price).div(1000); // Adjusting price
                FinalitemList.push(transaction);
            }
        }
    });
    return FinalitemList;
}




transactionsRoutes.get('/statistics', async(req:any,res:any) => {
    try {
        const month: Number = Number(req.query.month);
        const checkmonth = obj.safeParse({month})

        if(!checkmonth.success  || Number(month) > 12) {
            return res.status(400).json({message:'Enter valid Month'})
        }
        //taking whole record and then filtering each record based on month 
        const Totalrecords : Transaction[] = [];

        const extractrecord = await prisma.productTransaction.findMany();
        let solditem = 0;
        let unsolditem = 0;
        let TotalSaleamount : Decimal = new Decimal(0);

        extractrecord.forEach((item)  => {
            if(Checkmonth(month, item.dateOfSale)) {
                if(item.sold ) {
                    TotalSaleamount = TotalSaleamount.plus(new Decimal(item.price).div(1000)); 
                    solditem++;
               }else {
                unsolditem++;
               }
            }
        })
        return  res.status(200).json({TotalSaleamount:TotalSaleamount,Solditem: solditem,Unsolditem: unsolditem})
    } catch(error) {
        res.status(500).json({message:'Internal server Error '})
    }
})


export default transactionsRoutes;