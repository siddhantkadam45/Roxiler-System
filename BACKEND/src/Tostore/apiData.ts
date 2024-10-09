// As The data is constant so storing it one time
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import axios from "axios";

const Storedetails = async () => {
    try{
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
        const Detailsofshop = response.data;
        
        Detailsofshop.forEach(async(item:any,index:Number) => {
            const Product_id = item.id;
            const title = item.title;
            //converting into a integer value to avoid breaches 
            const price = item.price*1000;
            const description = item.description;
            const category = item.category;
            const image = item.image;
            const sold = item.sold;
            const dateOfSale =  new Date(item.dateOfSale)
      
    
            await prisma.productTransaction.create({
                data: {
                    product_id: Product_id,
                    title: title,
                    price: price,
                    description: description,
                    category: category,
                    image: image,
                    sold: sold,
                    dateOfSale: dateOfSale,
                },
            });
        });
    } catch(error) {
        console.error("Error fetching or storing data:", error);
    } finally {
        await prisma.$disconnect(); 
    }
   
}
Storedetails();