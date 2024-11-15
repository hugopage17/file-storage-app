import React from 'react';
import { styled, Box, Button } from '@mui/material';
import { StorageObject } from '../../types';
import StorageThumbnail from './Thumbnail';
import { apiService } from '../../services/api.service';

interface IProps {
    path: string;
}

const StorageObjectsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(4),
    marginTop: theme.spacing(4),
}));

const cache = new Map();

const fetchStorage = (path: string) => {
    if (!cache.has(path)) {
        let data: StorageObject[] | undefined;
        const promise = apiService.listStorage(path).then((response) => (data = response));

        cache.set(path, {
            read() {
                if (!data) {
                    throw promise;
                }
                return data;
            },
        });
    }

    return cache.get(path);
};

const EmptyFolder = () => {
    return (
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '40px' }}>
            <img src="/empty.png" alt="empty-directory" width={256} />
            <Button color="info" variant="text" sx={{ textTransform: 'none', marginTop: '12px' }}>
                Folder Empty, Upload a file
            </Button>
        </Box>
    );
};

const StorageObjectDisplay: React.FC<IProps> = ({ path }) => {
    const storage: StorageObject[] = fetchStorage(path).read();

    if (!storage.length) {
        return <EmptyFolder />;
    }

    return (
        <StorageObjectsBox>
            {storage.map((storageObject) => (
                <StorageThumbnail key={storageObject.FullPath} storageObject={storageObject} />
            ))}
        </StorageObjectsBox>
    );
};

export default StorageObjectDisplay;
