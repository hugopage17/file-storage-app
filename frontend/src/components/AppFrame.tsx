import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import { Avatar, CssBaseline, styled } from '@mui/material';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useLocation } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { apiService } from '../services/api.service';
import { StorageObject } from '../types';
import StorageThumbnail from './storage-object/Thumbnail';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

const StorageObjectsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(4),
    marginTop: theme.spacing(4)
}))

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

export default function DrawerAppBar(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [filePaths, setFilePaths] = React.useState<string[]>([]);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const [storageObjects, setStorageObjects] = React.useState<StorageObject[]>([])

    const location = useLocation();

    React.useEffect(() => {
        apiService.listStorage(location.pathname).then(setStorageObjects);
    }, [apiService, location])

    React.useEffect(() => setFilePaths(location.pathname.split('/').filter((path) => path !== '')), [location]);

    const navigateBreadCrums = (index: number) => filePaths.slice(0, index + 1).join('/');

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav" sx={{ p: 0 }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        MUI
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Avatar />
                        {/* <Button color="secondary" variant="outlined" onClick={async () => await signOut()}>
                            Sign Out
                        </Button> */}
                    </Box>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
            <Box component="main" sx={{ p: 3 }}>
                <Toolbar />
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" href="/">
                        <HomeIcon sx={{ mr: 0.5, fontSize: '20px' }} fontSize="inherit" />
                    </Link>
                    {filePaths.map((path, index) => (
                        <Link underline="none" sx={{ display: 'flex', alignItems: 'center' }} color="primary" href={`/${navigateBreadCrums(index)}`} key={`breadcrumb-path-${index}`}>
                            {path}
                        </Link>
                    ))}
                </Breadcrumbs>
                <StorageObjectsBox>
                    {storageObjects.map((storageObject) => <StorageThumbnail key={storageObject.FullPath} storageObject={storageObject} />)}
                </StorageObjectsBox>
            </Box>
        </Box>
    );
}
