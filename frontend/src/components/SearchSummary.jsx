// SearchSummary.jsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[2],
  width: '100%',
}));

export default function SearchSummary() {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search Summary
        </Typography>
        <Typography variant="body2">
          {/* Placeholder text—update with model performance and summary details */}
          Model performance and search summary details will be displayed here.
        </Typography>
      </CardContent>
    </StyledCard>
  );
}
