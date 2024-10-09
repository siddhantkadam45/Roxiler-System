import React, { useEffect, useState } from 'react'
import { MonthDropdown } from './Statistics';
import axios from 'axios'
import { months } from './Statistics';
export default function Transaction() {
    const [Transactiondetails, setTransactiondetails] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(3); // Default March
    const [searchText, setSearchText] = useState('');
    const [tempSelectorOpen, setTempSelectorOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [notFound, setNotFound] = useState(false);
    const url = "http://localhost:3000/api/v1/transactions";

    const temp = [
        {
            product_id: "Not Found",
            title: "Not Found",
            description: "Not Found",
            price: "Not Found",
            category: "Not Found",
            sold: "Not Found",
            image: "Not Found"
        }
    ];


    useEffect(() => {
        async function getTransactionDetails() {
            const isNumeric = /^\d+$/.test(searchText);  // Check if searchText is fully numeric

            const res = await axios.get(url, {
                params: {
                    month: selectedMonth,
                    page: page,
                    // If searchText is numeric, set it as `price`, otherwise set it as `title` or `description`
                    title: !isNumeric ? searchText : "",
                    description: !isNumeric ? searchText : "",
                    price: isNumeric ? Number(searchText) : ""
                }
            });
            if (res.data.transacions.length === 0) {
                setNotFound(true);
            } else {
                setNotFound(false);
                console.log(res.data.transacions)
                setTransactiondetails(res.data.transacions);
            }
        }
        getTransactionDetails();
    }, [selectedMonth, searchText, page]);

    
    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleChange = (event) => {
        setSelectedMonth(Number(event.target.value));
        setTempSelectorOpen(0)
    };

    return (
        <div className='bg-[#edf6f6] h-screen'>
            <div className='flex justify-center  items-center  '>
                <div className='flex bg-white h-32 w-32 rounded-full items-center flex-col justify-center mt-3 font-semibold'>
                    <div>Transactions</div>
                    <div>Dashboard</div>
                </div>
            </div>
            <div>
                <div className=' flex justify-between px-4   items-center'>
                    <input type="text" placeholder='Search Transactions' className='border-1 bg-[#f8df8c] border-black rounded-3xl  px-2 py-1 text-left' onChange={(e) =>
                        //using settimeout so that request should hit only on completion(assuming 5 second to write the product details) 
                        setTimeout(() => {
                            if (e.target.value == "") {
                                //If user clear’s the search box then initial list of transactions should be displayed for the selected month using API
                                setSelectedMonth(3);
                                setPage(1)
                            }
                            setSearchText(e.target.value)
                            setSelectedMonth((prev) => prev);
                        }, 3000)
                    } />
                    <div className='flex flex-col gap-2 items-center justify-center mt-1'>
                        <button className='bg-yellow-300 py-1 px-4 rounded-3xl cursor-pointer' onClick={() => setTempSelectorOpen(1)}>
                            Select Month
                        </button>
                        {tempSelectorOpen ? <div>
                            {<select name="month" id="month" value={selectedMonth} onChange={handleChange} className='bg-[#edf6f6] cursor-pointer rounded-xl p-2 px-3 border-black border-2'>
                                {months.map((month, index) => (
                                    <option key={index} value={index + 1} className='cursor-pointer'>
                                        {month}
                                    </option>
                                ))}
                            </select>}
                        </div> : null}
                    </div>
                </div>
            </div>
            <div>

                <div className='mt-8'>
                    <table className='bg-[#f8df8c]'>
                        <thead>

                            <tr className="">
                                <th className="border-2 border-black px-4 py-2 text-left items-center">ID</th>
                                <th className="border-2 border-black  px-4 py-2 text-left items-center">Title</th>
                                <th className="border-2 border-black  px-4 py-2 text-left items-center">Description</th>
                                <th className="border-2 border-black  px-4 py-2 text-left items-center">Price</th>
                                <th className="border-2 border-black  px-4 py-2 text-left items-center" >Category</th>
                                <th className="border-2 border-black  px-4 py-2 text-left items-center">Sold</th>
                                <th className="border-2 border-black  px-4 py-2 text-left items-center" >Image</th>
                            </tr>

                        </thead>
                        <tbody >
                            {notFound ? temp.map((item, index) => {
                                return <Handlecreationofrows Singlerecord={item} key={index} />

                            }) : null}
                            {!notFound ? Transactiondetails.map((item, index) => {
                                return <Handlecreationofrows Singlerecord={item} key={index} />
                            }) : null}
                        </tbody>
                    </table>

                    {/* if there is description/ searchtext  provided so no need to provide pages eventhough match found or not found */}
                    {searchText.length == 0 ? <div className='flex justify-between'>
                        <div className='font-semibold'>page NO {page}</div>
                        <div className='flex font-semibold gap-2'>
                            {page < 6 ? <button onClick={handleNextPage}>Next</button> : null}
                            <p>-</p>
                            {page > 1 ? <button onClick={handlePreviousPage}>Previous</button> : null}
                        </div>
                        <div className='font-semibold'>Per Page 10</div>
                    </div> : null}
                </div>
            </div>
        </div>
    )
}


function Handlecreationofrows({ Singlerecord }) {
    console.log(Singlerecord)
    return (
        <tr className="bg-white hover:bg-gray-100">
            <td className="border-2 border-black px-4 py-2 text-left items-center">{Singlerecord.product_id}</td>
            <td className="border-2 border-black px-4 py-2 text-left items-center">{Singlerecord.title}</td>
            <td className="border-2 border-black px-4 py-2 text-left items-center">{Singlerecord.description}</td>
            <td className="border-2 border-black px-4 py-2 text-left items-center">{Singlerecord.price}</td>
            <td className="border-2 border-black px-4 py-2 text-left items-center">{Singlerecord.category}</td>
            <td className="border-2 border-black px-4 py-2 text-left items-center">{Singlerecord.sold ? "True" : "False"}</td>
            <td className="border-2 border-black px-4 py-2 text-left items-center">{Singlerecord.image}</td>
        </tr>

    )
}
