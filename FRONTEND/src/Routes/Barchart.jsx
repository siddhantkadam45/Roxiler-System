import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { MonthDropdown } from './Statistics';
import axios from 'axios';
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function Barchart() {
    const [barchartdata, setbarchartdata] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(3);
    let data1 = {};

    useEffect(() => {
        async function getdata() {
            const url = "http://localhost:3000/api/v1/Charts/bar";
            const res = await axios.get(url, {
                params: {
                    month: selectedMonth
                }
            });
            setbarchartdata(res.data.Rangearray);
        }
        getdata();
    }, [selectedMonth]);

    const xlabel = [];
    const ylabel = [];
    if (barchartdata.length > 1) {
        barchartdata.forEach((item) => {
            const s = item[0];
            const e = item[1];
            const value = item[2];
            if (s === 901) {
                xlabel.push(`${s}- above`);
                ylabel.push(`${value }`);
            } else {
                xlabel.push(`${s}-${e}`);
                ylabel.push(`${value}`);
            }
        });
    }

    if (xlabel.length > 0) {
        data1 = {
            labels: xlabel,
            datasets: [{
                label: "Month Statistics",
                data: ylabel,
                backgroundColor: [
                    "rgb(108,229,232)"
                ],
                borderColor: [
                    "rgb(108,229,232)"
                ]
            }]
        };
    }

    const templabelx = [
        '0-100',
        '101-200',
        '201-300',
        '301-400',
        '401-500',
        '501-600',
        '601-700',
        '701-800',
        '801-900',
        '901-above'
    ];

    const tempylabel = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

    const data2 = {
        labels: templabelx,
        datasets: [{
            label: "Month Statistics",
            data: tempylabel,
            backgroundColor: [
                "rgb(108,229,232)"
            ],
            borderColor: [
                'rgb(108,229,232)'
            ]
        }]
    };

    const options = {};

    return (

        <div className=' '>
            <div className=''>
                <div className='flex  justify-center  item-center   '>
                    <div className='flex gap-2 text-3xl mt-10 mb-16'>
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
                </div>
                <div className='flex flex-col justify-center items-center '>
                    <div className='w-1/2 h-1/2'>
                        {xlabel.length > 0 ? (
                            <div>
                                <Bar options={options} data={data1} className='w-full h-1/2'></Bar>
                            </div>
                        ) : (
                            <div>
                                <Bar options={options} data={data2}></Bar>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
