// ModelTesting.jsx - Main component
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from './shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import TestLayout from './components/TestLayout';


export default function ModelTesting() {
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar/>
      <Container
        maxWidth={false} // disables maxWidth and centers
        disableGutters  // removes default padding
        component="main"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            my: 10,
            gap: 4,
            px: '7.5%' , 
        }}
        >
            <TestLayout
                results={results}
                setResults={setResults}
                setLoading={setLoading}
                loading={loading}
            />
      </Container>
      <Footer />
    </AppTheme>
  );
}