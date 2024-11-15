import React from 'react';
import { Typography, styled, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StorageObject } from '../../types';

interface IProps {
    storageObject: StorageObject;
}

const Label = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary
}))

const StorageObjectBox = styled(ButtonBase)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&:focus': {
        outline: 'none',
        boxShadow: 'none',
    },
}))

const StorageThumbnail: React.FC<IProps> = ({ storageObject }) => {

    const navigate = useNavigate();

    const openFolder = (path: string) => navigate(path);

    return (
        <StorageObjectBox onClick={() => openFolder(storageObject.FullPath)}>
            <img src={`/file-icons/${storageObject.ContentType.split('/').pop()}.png`} alt='file-icon' width={48} />
            <Label variant='body2'>{storageObject.Key}</Label>
        </StorageObjectBox>

    )
}

export default StorageThumbnail;