import React from 'react';
import { Avatar, CssBaseline, Toolbar, Typography, Box, AppBar, Menu, MenuItem, IconButton, MenuList } from '@mui/material';
import { signOut } from 'aws-amplify/auth';

interface IProps {
    children: React.ReactNode;
}

const AppFrame: React.FC<IProps> = ({ children }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    return (
        <Box>
            <CssBaseline />
            <AppBar component="nav" sx={{ p: 0 }}>
                <Toolbar variant="dense">
                    <img src="/logo/logo.png" alt="app-logo" width={32} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}></Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}><Avatar /></IconButton>
                    </Box>
                    <Menu
                        id="user-dropdown-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuList dense>
                            <MenuItem onClick={async () => await signOut()}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Toolbar>
            </AppBar>
            {children}
        </Box>
    );
};

export default AppFrame;
