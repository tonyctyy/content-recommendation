import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import { Link, useLocation } from 'react-router-dom';
import SitemarkIcon from './SitemarkIcon';

// Styled Toolbar
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  textTransform: 'none',
  margin: theme.spacing(0, 1),
  // Default styles for inactive buttons remain unchanged
  ...(active && {
    color: '#282f3d',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: alpha('#282f3d', theme.palette.action.hoverOpacity),
    },
  }),
}));


export default function AppAppBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container
        maxWidth={false} // disables maxWidth and centers
        disableGutters
        sx={{
          px: '7.5%',
          py: 0,
        }}
      >
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <SitemarkIcon />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <NavButton
                component={Link}
                to="/"
                size="small"
                color="info"
                active={isActive('/')}
              >
                Home
              </NavButton>
              <NavButton
                component={Link}
                to="/model_testing"
                size="small"
                color="info"
                active={isActive('/model_testing')}
              >
                Model Testing
              </NavButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button color="primary" variant="text" size="small">
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="small">
              Sign up
            </Button>
            <ColorModeIconDropdown />
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
