import React from 'react';
import { IconButton, TableRow, TableCell, styled } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment-timezone';
import { useDialogs } from '@toolpad/core/useDialogs';
import { StorageObject } from '../../types';
import StorageObjectService from '../../services/storage-object.service';
import FileInfo from '../dialogs/FileInfoDialog';

interface IProps {
    storageObject: StorageObject;
    openFolder: () => void;
}

const PrimaryTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.primary
}))

const SecondaryTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.secondary
}))



const StorageListItem: React.FC<IProps> = ({ storageObject, openFolder }) => {
    const dialogs = useDialogs();

    const isFolder = storageObject.ContentType.split('/').pop() === 'folder';

    const handleClick = async (event: React.MouseEvent<any, MouseEvent>) => {
        if (isFolder) {
            openFolder()
        } else {
            await StorageObjectService.downloadObject(storageObject, event)
        }
    }

    const openInfo = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        await dialogs.open(FileInfo, {
            storageObject,
            downloadObject: async () => await handleClick(event),
            deleteObject: async () => {
                await StorageObjectService.deleteObject(storageObject)
            }
        });
    };

    return (
        <TableRow
            hover
            key={storageObject.Key}
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
            onClick={handleClick}
        >
            <PrimaryTableCell component="th" scope="row">
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px' }}>
                    <img src={`/file-icons/${storageObject.ContentType.split('/').pop()}.png`} alt='file-icon' width={24} />
                    {storageObject.Key}
                </span>
            </PrimaryTableCell>
            <SecondaryTableCell component="th" scope="row">
                {storageObject.ContentType}
            </SecondaryTableCell>
            <SecondaryTableCell>{moment(storageObject.LastModified).tz('Pacific/Auckland').format('HH:mm DD/MM/YY')}</SecondaryTableCell>
            <TableCell align='center'>
                <IconButton size='small' color='info' onClick={async (event) => await openInfo(event)}>
                    <InfoIcon />
                </IconButton>
                <IconButton size='small' color='primary' onClick={handleClick}>
                    {isFolder ? <FolderOpenIcon /> : <FileOpenIcon />}
                </IconButton>
                <IconButton size='small' color='error' onClick={async (event) => {
                    await StorageObjectService.deleteObject(storageObject, event)
                }}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow >
    )
}

export default StorageListItem;
