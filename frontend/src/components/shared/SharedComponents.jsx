// src/components/shared/SharedComponents.jsx
import { styled } from '@mui/material/styles';
import { Card, Box } from '@mui/material';

export const AppCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.8)`
        : theme.palette.background.paper,
}));

export const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));
