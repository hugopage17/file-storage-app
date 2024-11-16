import React from 'react';
import { Typography, styled, ButtonBase, IconButton, Menu, MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDialogs } from '@toolpad/core/useDialogs';
import { StorageObject } from '../../types';
import FileInfo from '../dialogs/FileInfoDialog';
import StorageObjectService from '../../services/storage-object.service';

const Label = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary
}))

const StorageObjectBox = styled(ButtonBase)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}))

const MenuItemText = styled(ListItemText)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold
}))

interface IProps {
    storageObject: StorageObject;
    openFolder: () => void;
}

const StorageThumbnail: React.FC<IProps> = ({ storageObject, openFolder }) => {
    const dialogs = useDialogs();

    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget)
        event.stopPropagation();
    };

    const downloadObject = async (event?: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        await StorageObjectService.downloadObject(storageObject, event);
        setMenuAnchor(null);
    }

    const openInfo = async (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        event.stopPropagation();
        setMenuAnchor(null);
        await dialogs.open(FileInfo, {
            storageObject,
            downloadObject,
            deleteObject: async () => {
                await StorageObjectService.deleteObject(storageObject, event)
            }
        });
    };

    const menuItems = [
        {
            name: 'Info',
            icon: <InfoIcon />,
            action: async (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => await openInfo(event)
        },
        {
            name: 'Download',
            icon: <FileDownloadIcon />,
            action: async (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => await downloadObject(event),
            disabled: storageObject.ContentType.split('/').pop() === 'folder'
        },
        {
            name: 'Delete',
            icon: <DeleteIcon />,
            action: async (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => await StorageObjectService.deleteObject(storageObject, event)
        }
    ];

    const handleClick = async () => {
        if (storageObject.ContentType.split('/').pop() === 'folder') {
            openFolder()
        } else {
            await downloadObject();
        }
    }

    const fileName = () => {
        if (storageObject.Key.length <= 20) {
            return storageObject.Key;
        }

        const start = storageObject.Key.substring(0, 9);
        const end = storageObject.Key.substring(storageObject.Key.length - 4);
        return `${start}......${end}`;
    }

    return (
        <StorageObjectBox onClick={handleClick}>
            <img src={`/file-icons/${storageObject.ContentType.split('/').pop()}.png`} alt='file-icon' width={48} />
            <Label variant='body2'>
                {fileName()}
                <IconButton onClick={openMenu} sx={{ width: 20, height: 20 }} >
                    <MoreVertIcon sx={{ width: 18, height: 18 }} />
                </IconButton>
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                    event.stopPropagation();
                    setMenuAnchor(null);
                }}>
                    <MenuList dense>
                        {menuItems.map((item) => (
                            <MenuItem disabled={item?.disabled} key={`storage-object-thumbnail-menu-item-${item.name}`} onClick={async (event) => await item.action(event)}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <MenuItemText>{item.name}</MenuItemText>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            </Label>
        </StorageObjectBox>

    )
}

export default StorageThumbnail;