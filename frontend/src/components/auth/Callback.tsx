import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppFrame from '../AppFrame';

const Callback = () => {
    const navigate = useNavigate();

    React.useEffect(() => navigate('/'), [])

    return (
        <AppFrame>
            <Typography variant='h6'></Typography>
        </AppFrame>
    )
}

export default Callback