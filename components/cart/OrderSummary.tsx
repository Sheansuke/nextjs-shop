import { Grid, Typography } from '@mui/material'
import React, { FC } from 'react'
import { useContext } from 'react';
import { CartContext } from '../../context';
import { format } from '../../utils';
import { IOrder } from '../../interfaces/IOrder';

interface OrderSummaryProps {
    order?: IOrder
}

export const OrderSummary: FC<OrderSummaryProps> = ({ order }) => {
    const { numberOfItems, subTotal, total, tax } = useContext(CartContext)

    return (
        <Grid container >
            <Grid item xs={6}>
                <Typography >
                    No. Productos
                </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography >
                    {order ? order.numberOfItems : numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'}
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography >
                    SubTotal
                </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography >
                    {order?.subtotal ? format(order.subtotal) : format(subTotal)}
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography >
                    Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100}%)
                </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography >
                    {order?.tax ? format(order.tax) : format(tax)}
                </Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    Total
                </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end" sx={{ mt: 2 }}>
                <Typography variant="subtitle1" >
                    {
                        order?.total ? format(order.total) : format(total)
                    }
                </Typography>
            </Grid>
        </Grid>
    )
}
