import React from 'react';
import { styled, Box, Button } from '@mui/material';
import { StorageObject } from '../../types';
import StorageThumbnail from './Thumbnail';
import StorageListItem from './StorageListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api.service';
import AppContext from '../../AppContext';

interface IProps {
    path: string;
    upload: () => Promise<void>
}

const StorageObjectsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(6),
    marginTop: theme.spacing(4),
    flexWrap: 'wrap'
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


const EmptyFolder: React.FC<{ upload: () => Promise<void> }> = ({ upload }) => {
    return (
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '40px' }}>
            <img src="/empty.png" alt="empty-directory" width={256} />
            <Button onClick={upload} color="info" variant="text" sx={{ textTransform: 'none', marginTop: '12px' }}>
                Folder Empty, Upload a file
            </Button>
        </Box>
    );
};

const StorageObjectDisplay: React.FC<IProps> = ({ path, upload }) => {
    const storage: StorageObject[] = fetchStorage(decodeURIComponent(path)).read();
    const navigate = useNavigate();

    const { displayView } = React.useContext(AppContext);

    const openFolder = (path: string) => navigate(path);

    if (!storage?.length) {
        return <EmptyFolder upload={upload} />;
    }

    return (
        <StorageObjectsBox>
            {displayView === 'tile' && storage.map((storageObject) => (
                <StorageThumbnail openFolder={() => openFolder(storageObject.FullPath)} key={`${storageObject.FullPath}-tile-view`} storageObject={storageObject} />
            ))}
            {displayView === 'list' &&
                <TableContainer>
                    <Table size="small" sx={{ minWidth: 650 }} aria-label="storage-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>File Type</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell align='center'></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {storage.map((storageObject) => (
                                <StorageListItem openFolder={() => openFolder(storageObject.FullPath)} key={`${storageObject.FullPath}-list-view`} storageObject={storageObject} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            }
        </StorageObjectsBox>
    );
};

export default StorageObjectDisplay;
