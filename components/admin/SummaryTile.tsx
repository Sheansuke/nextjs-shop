import { CreditCardOffOutlined } from "@mui/icons-material";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import React, { FC } from "react";

interface ISummaryTileProps {
    title: string | number;
    subTitle: string;
    icon: JSX.Element
}

export const SummaryTile: FC<ISummaryTileProps> = ({
    title,
    subTitle,
    icon
}) => {
    return (
        <Grid item xs={12} sm={4} md={3}>
            <Card
                sx={{
                    display: "flex",
                }}
            >
                <CardContent
                    sx={{
                        width: 50,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {icon}
                </CardContent>

                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: "1 0 auto",
                    }}
                >
                    <Typography variant="h3">{title}</Typography>
                    <Typography variant="caption">{subTitle}</Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};
