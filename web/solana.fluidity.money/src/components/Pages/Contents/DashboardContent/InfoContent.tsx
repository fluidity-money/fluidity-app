// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

export interface dataTrade {
    amount: string,
    user: string,
    date: string
}

export const Data = ({ dataType }: { dataType: string }) => {
    const data: dataTrade[] = [
        {
            amount: "$123,123",
            user: '0x1a7...29a5h',
            date: '18/5/2021 16:02:00'
        },
        {
            amount: "$123,809",
            user: '0x1a7...29a5h',
            date: '19/5/2021 16:02:00'
        },
        {
            amount: "$100,809",
            user: '0x1a7...29a5h',
            date: '20/5/2021 16:02:00'
        },
        {
            amount: "$90,000",
            user: '0x1a7...29a5h',
            date: '21/5/2021 16:02:00'
        },
        {
            amount: "$123",
            user: '0x1a7...29a5h',
            date: '22/5/2021 16:02:00'
        },

        {
            amount: "$123",
            user: '0x1a7...29a5h',
            date: '22/5/2021 16:02:00'
        },

        {
            amount: "$123",
            user: '0x1a7...29a5h',
            date: '22/5/2021 16:02:00'
        },

        {
            amount: "$123",
            user: '0x1a7...29a5h',
            date: '22/5/2021 16:02:00'
        },

    ]

    // Renders out information to user
    const renderedData = data.map((info, index) => {
        if (dataType === "amount") { return <div key={dataType + index} >{info.amount} </div> }
        else if (dataType === "user") { return <div key={dataType + index}>{info.user}</div> }
        else if (dataType === "date") { return <div key={dataType + index}  >{info.date}</div> }
        return <div></div>;
    })

    // Returns data
    return (
        <div className=" data-style flex column secondary-text ">{renderedData}</div>
    );
};