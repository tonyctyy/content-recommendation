// components/BusinessCardCarousel.jsx
import React, { useState, useRef }from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BusinessCard from './BusinessCard';
import BusinessDetailModal from './BusinessDetailModal';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function BusinessCardCarousel({ recommendations, businesses, model }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Calculate items to show based on screen size
  const itemsToShow = isLarge ? 4 : (isDesktop ? 3 : 1);
  
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);
  
  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleNext = () => {
    setStartIndex(prev => 
      Math.min(prev + itemsToShow, recommendations.length - itemsToShow)
    );
  };

  const handlePrev = () => {
    setStartIndex(prev => Math.max(prev - itemsToShow, 0));
  };
  
  // Handle card click to open modal
  const handleCardClick = (businessId, score) => {
    const business = businesses[businessId];
    // Add the score to the business object for the modal
    setSelectedBusiness({ ...business, score });
    setModalOpen(true);
  };

  // Visible businesses based on current index
  const visibleRecommendations = recommendations.slice(
    startIndex, 
    startIndex + itemsToShow + 1 // Show one extra card partially
  );

  return (
    <Box sx={{ position: 'relative', width: '100%', my: 2 }}>
      {/* Left Navigation Button */}
      <IconButton 
        sx={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'rgba(0,0,0,0.3)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
          display: startIndex === 0 ? 'none' : 'flex'
        }}
        onClick={handlePrev}
        aria-label="previous"
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Carousel Container */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          px: 2,
          gap: 2
        }}
      >
        {visibleRecommendations.map((item, index) => {
          const businessId = item[0];
          const score = item[1];
          const business = businesses[businessId];
          
          return (
            <Box 
              key={businessId}
              sx={{
                flex: `0 0 calc(${100 / itemsToShow}% - ${(16 * (itemsToShow - 1)) / itemsToShow}px)`,
                transition: 'transform 0.3s ease',
                transform: index === visibleRecommendations.length - 1 && 
                           index !== recommendations.length - 1 ? 
                           'translateX(-30px)' : 'none',
                opacity: index === visibleRecommendations.length - 1 && 
                         index !== recommendations.length - 1 ? 
                         0.6 : 1,
                cursor: 'pointer',
              }}
            >
              <Box 
                onClick={() => handleCardClick(businessId, score)}
                sx={{ height: '100%' }}
              >
                <BusinessCard 
                  business={business} 
                  score={score} 
                  model={model} 
                  isTest={false}
                />
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Right Navigation Button */}
      <IconButton 
        sx={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'rgba(0,0,0,0.3)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
          display: startIndex >= recommendations.length - itemsToShow ? 'none' : 'flex'
        }}
        onClick={handleNext}
        aria-label="next"
      >
        <ArrowForwardIosIcon />
      </IconButton>
      
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