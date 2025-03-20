import * as React from 'react';
import { Box } from '@mui/material';
import siteMarkUrl from '../assets/yelp_logo.svg';

export default function SitemarkIcon() {
  return (
    <Box
      component="img"
      src={siteMarkUrl}
      alt="Site Mark"
      sx={{ height: 35, width: 100, mr: 2 }}
    />
  );
}
