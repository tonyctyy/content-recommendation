// components/BusinessCardList.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Pagination,
} from '@mui/material';

import BusinessCard from './BusinessCard';
import BusinessDetailModal from './BusinessDetailModal';

export default function BusinessCardList({ recommendations, businesses, model }) {
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;
  const totalPages = Math.ceil(recommendations.length / cardsPerPage);
  
  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handlePageChange = (_, value) => {
    setPage(value);
  };
  
  // Handle card click to open modal
  const handleCardClick = (business, score) => {
    setSelectedBusiness({ ...business, score });
    setModalOpen(true);
  };

  const indexOfLastCard = page * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentRecommendations = recommendations.slice(
    indexOfFirstCard,
    indexOfLastCard
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} alignItems="start">
        {currentRecommendations.map(([businessId, score]) => {
          const business = businesses[businessId];
          return (
            <Grid item xs={12} md={6} lg={4} key={businessId}>
              <Box 
                onClick={() => handleCardClick(business, score)}
                sx={{ cursor: 'pointer', height: '100%' }}
              >
                <BusinessCard
                  business={business}
                  score={score}
                  model={model}
                  isTest={true} 
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      
      {/* Business Detail Modal */}
      <BusinessDetailModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        business={selectedBusiness}
        model={model}
      />
    </Box>
  );
}