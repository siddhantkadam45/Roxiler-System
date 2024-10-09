
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Statistics() {
    const [selectedMonth, setSelectedMonth] = useState(3);
    const [staticsdetails, setstaticsdetails] = useState({})
    // const [settotalamount]
    useEffect(() => {
        async function Makerequest() {
            const url = "http://localhost:3000/api/v1/transactions/statistics"
            const response = await axios.get(url, {
                params: {
                    month: selectedMonth
                }
            })
            console.log(response)
            setstaticsdetails(response.data)
            console.log(staticsdetails)
        }
        Makerequest()
    }, [selectedMonth])
    const totalSaleAmount =
        staticsdetails?.TotalSaleamount
            ? parseFloat(staticsdetails.TotalSaleamount.replace(/[^0-9.-]+/g, "").trim()).toLocaleString()
            : "0";
    return (
        <div className='pb-10 h-screen '>
            <div className='w-screen flex justify-center flex-col items-center h-3/4 bg-[#edf6f6]'>
                <div className='flex flex-col justify-center  item-center   '>
                    <div className='flex gap-2 text-3xl'>
                        <div className='semibold'>
                            Statistics -
                        </div>
                        <div className=' semibold'>
                            <MonthDropdown setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth} />
                        </div>
                        <div className='text-sm'>
                            ( Selected Month Name from Dropdown )
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div className='flex flex-col border bg-[#f8df8c] w-3/4 gap-5 text-xl px-2 pt-4 pb-3 rounded-lg'>
                            <div className=' flex  justify-between  text-start'>
                                <p>Total sale </p>
                                {staticsdetails.TotalSaleamount > 0 ? <p className='text-start  w-24'>{totalSaleAmount}</p> : <p className='text-start  w-24'>0</p>}
                            </div>
                            <div className='flex  justify-between'>
                                <p>Total sold item   </p>
                                {staticsdetails.Solditem > 0 ? <p className='text-start  w-24'>{staticsdetails.Solditem}</p> : <p className='text-start  w-24'>0</p>}
                            </div>
                            <div className='flex  justify-between  '>
                                <p >Total  not sold item  </p>
                                {staticsdetails.Unsolditem > 0 ? <p className='text-start  w-24'>{staticsdetails.Unsolditem}</p> : <p className='text-start  w-24'>0</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


export const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function MonthDropdown({ selectedMonth, setSelectedMonth }) {

    const handleChange = (event) => {
        setSelectedMonth(Number(event.target.value));
    };

   
    return (
        <select name="month" id="month" value={selectedMonth} onChange={handleChange} className='bg-[#edf6f6] cursor-pointer rounded-xl p-2 px-3 border-black border-2'>
            {months.map((month, index) => (
                <option key={index} value={index + 1} className='cursor-pointer'>
                    {month}
                </option>
            ))}
        </select>
    );
}
