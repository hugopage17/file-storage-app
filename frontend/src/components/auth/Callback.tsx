import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppFrame from '../AppFrame';
import { fetchAuthSession } from 'aws-amplify/auth';

const Callback = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchAuthSession().then(() => navigate('/'))
    }, [])

    return (
        <AppFrame>
            <Typography variant='h6'></Typography>
        </AppFrame>
    )
}

export default Callback