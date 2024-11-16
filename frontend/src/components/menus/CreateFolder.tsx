import React from 'react';
import { styled, Menu, MenuList, OutlinedInput, InputAdornment, Typography, FormControl, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface IProps {
    isUploading: boolean;
    handleCreateFolder: (params: any) => Promise<void>;
    currentDirectory: string;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightBold,
    '&:focus': {
        outline: 'none',
        boxShadow: 'none',
    },
}))

const CreateFolder: React.FC<IProps> = ({ isUploading, handleCreateFolder, currentDirectory, anchorEl, onClose }) => {
    const theme = useTheme();

    const [folderName, setFolderName] = React.useState<string>('');

    return (
        <Menu
            id="create-folder-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
        >
            <MenuList dense sx={{ padding: 2, width: 360 }} >
                <FormControl sx={{ width: '100%' }}>
                    <Typography variant='subtitle2' fontWeight={theme.typography.fontWeightBold} color={theme.palette.text.secondary}>Create New Folder</Typography>
                    <OutlinedInput onChange={(e) => setFolderName(e.target.value)} color='primary' size='small' placeholder='Folder Name' sx={{ fontSize: 14 }} endAdornment={<InputAdornment position="end">
                        <StyledLoadingButton
                            loading={isUploading}
                            size='small'
                            color='primary'
                            variant='contained'
                            onClick={async () => {
                                await handleCreateFolder({
                                    fileName: currentDirectory === '' ? `${folderName}/` : `${currentDirectory}/${folderName}/`,
                                    fileData: '',
                                    contentType: "text/plain"
                                });
                                window.location.reload();
                            }
                            }>
                            Done
                        </StyledLoadingButton>
                    </InputAdornment>} />
                </FormControl>
            </MenuList>
        </Menu>
    )
}

export default CreateFolder;