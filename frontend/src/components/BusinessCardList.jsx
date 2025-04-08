// BusinessCardList.jsx
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import BusinessCard from './BusinessCard';

export default function BusinessCardList({ recommendations, businesses, model }) {
  const [page, setPage] = React.useState(1);
  const cardsPerPage = 6;
  const totalPages = Math.ceil(recommendations.length / cardsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastCard = page * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentRecommendations = recommendations.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <>
        {/* <Paper sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}> */}

            <Grid container spacing={3} alignItems="start">
            {currentRecommendations.map((item) => {
            const businessId = item[0];
            const score = item[1];
            const business = businesses[businessId];
            
            return (
                <Grid item xs={12} md={6} lg={4} key={businessId}>
                <BusinessCard business={business} score={score} model={model} />
                </Grid>
            );
            })}
        </Grid>
        {/* </Paper> */}

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
      />
    </>
  );
}
