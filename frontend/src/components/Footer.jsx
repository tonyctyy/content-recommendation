// components/Footer.jsx
import React from 'react';
import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

export default function Footer() {
  return (
    <React.Fragment>
      <Divider />
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" color="text.primary">
              © 2025 HKUST IEDA Final Year Project. All rights reserved.
            </Typography>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
}
