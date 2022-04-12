import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React, { FC } from "react";

interface IItemCounterProps {
    currentValue: number;
    updatedQuantity: (value: number) => void;
    maxValue: number;
}

export const ItemCounter: FC<IItemCounterProps> = ({
    currentValue,
    maxValue,
    updatedQuantity,
}) => {
    const handleChange = (value: number) => {
        if (value === -1) {
            if (currentValue === 1) return;
            return updatedQuantity(currentValue - 1);
        }

        if (currentValue >= maxValue) return;

        updatedQuantity(currentValue + 1);

    };

    return (
        <Box display="flex" alignItems="center">
            <IconButton onClick={() => handleChange(-1)}>
                <RemoveCircleOutline />
            </IconButton>
            <Typography
                sx={{
                    width: 40,
                    textAlign: "center",
                }}
            >
                {currentValue}
            </Typography>
            <IconButton onClick={() => handleChange(+1)}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    );
};
