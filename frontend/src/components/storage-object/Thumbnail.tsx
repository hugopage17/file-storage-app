import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StorageObject } from '../../types';


interface IProps {
    storageObject: StorageObject;
}

const StorageThumbnail: React.FC<IProps> = ({ storageObject }) => {

    const navigate = useNavigate();

    const openFolder = (path: string) => {
        navigate(path);
    }

    return (
        <Typography onClick={() => openFolder(storageObject.Key)} variant='subtitle1'>{storageObject.Key}</Typography>
    )
}

export default StorageThumbnail;