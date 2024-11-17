import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';

const Callback = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchAuthSession().then(() => navigate('/'));
    }, [navigate]);

    return <></>;
};

export default Callback;
