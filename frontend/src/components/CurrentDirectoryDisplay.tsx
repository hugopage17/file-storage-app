import React from 'react';
import { ButtonGroup, styled, LinearProgress, Divider, Link, Toolbar, Breadcrumbs, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useLocation } from 'react-router-dom';
import StorageObjectDisplay from './storage-object/StorageObjectDisplay';
import AppFrame from './AppFrame';

const FileListPanel = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(16),
    paddingRight: theme.spacing(16),
    paddingTop: theme.spacing(4),
}));

const PanelToolbar = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));

const ToolbarButton = styled(Button)(() => ({
    textTransform: 'none',
    '&:focus': {
        outline: 'none',
        boxShadow: 'none',
    },
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        color: theme.palette.info.light,
    },
}));

const CurrentDirectory: React.FC = () => {
    const [filePaths, setFilePaths] = React.useState<string[]>([]);

    const location = useLocation();

    React.useEffect(() => setFilePaths(location.pathname.split('/').filter((path) => path !== '')), [location]);

    const navigateBreadCrums = (index: number) => filePaths.slice(0, index + 1).join('/');

    return (
        <AppFrame>
            <FileListPanel>
                <Toolbar />
                <PanelToolbar>
                    <Breadcrumbs aria-label="breadcrumb">
                        <BreadcrumbLink underline="hover" color="inherit" href="/">
                            <HomeIcon sx={{ mr: 0.5, fontSize: '24px' }} fontSize="inherit" />
                        </BreadcrumbLink>
                        {filePaths.map((path, index) => (
                            <BreadcrumbLink underline="none" color="info" href={`/${navigateBreadCrums(index)}`} key={`breadcrumb-path-${index}`}>
                                {path}
                            </BreadcrumbLink>
                        ))}
                    </Breadcrumbs>
                    <ButtonGroup variant="contained">
                        <ToolbarButton startIcon={<FileUploadIcon />}>Upload File</ToolbarButton>
                        <ToolbarButton startIcon={<CreateNewFolderIcon />}>Create Folder</ToolbarButton>
                    </ButtonGroup>
                </PanelToolbar>
                <Divider />
                <React.Suspense fallback={<LinearProgress color="secondary" />}>
                    <StorageObjectDisplay path={location.pathname} />
                </React.Suspense>
            </FileListPanel>
        </AppFrame>
    );
};

export default CurrentDirectory;