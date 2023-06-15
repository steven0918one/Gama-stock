import React from "react";
import {
    Stack,
    Typography,
} from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

export default function NoData() {

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ opacity: 0.7 }}
        >
            <SentimentVeryDissatisfiedIcon />
            <Typography
                variant="p"
                component="p"
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                No Data
            </Typography>
        </Stack>
    );
}
