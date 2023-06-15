import React from "react";
import { Pagination } from "@mui/material";
import { useDispatch } from "react-redux";
import { setPaginationCurrent } from "../../store/reducer";

export default function UsePagination({ page, total, perPage }) {
    const [totalPages, setTotalPages] = React.useState();
    const dispatch = useDispatch();

    React.useEffect(() => {
        let count = total / perPage;
        setTotalPages(Math.ceil(count));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePagination = (event, value) => {
        dispatch(setPaginationCurrent(value));
    }

    return (
        <Pagination count={totalPages} page={page} onChange={handlePagination} sx={styles.pg} />
    );
}

const styles = {
    pg: {
        '& .Mui-disabled': {
            display: 'none',
        },
        '& .MuiPagination-ul': {
            justifyContent: 'flex-end',
        },
        '& [aria-current=true]': {
            backgroundColor: '#000 !important',
            color: '#fff !important'
        }
    }
}