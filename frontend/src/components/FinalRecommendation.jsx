// components/FinalRecommendation.jsx
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
  Box,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';

import BusinessCardCarousel from './BusinessCardCarousel';

const FinalRecommendation = ({ userData, API_BASE_URL, model, k = 100 }) => {
  const [finalRecommendations, setFinalRecommendations] = useState(null);
  const [recommendationCat, setRecommendationCat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const extractCategories = (recommendations, businesses) => {
    const counts = {};
    const topRecs = recommendations.slice(0, 100);
    const ignore = ['Restaurants', 'Food'];

    topRecs.forEach(([bizId]) => {
      const biz = businesses[bizId];
      biz.categories.forEach((cat) => {
        if (!ignore.includes(cat)) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  };

  const fetchPersonalRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await Axios.post(
        `${API_BASE_URL}/${model}_recommendations`,
        { user_id: userData.user_id, k }
      );

      const data = response.data;
      if (data.recommendations?.length) {
        const bizIds = data.recommendations.map(([id]) => id).join(',');
        const bizResp = await Axios.post(
          `${API_BASE_URL}/business_info`,
          { business_ids: bizIds }
        );

        setFinalRecommendations({
          recommendations: data.recommendations,
          businesses: bizResp.data,
          model: model,
        });

        setRecommendationCat(
          extractCategories(data.recommendations, bizResp.data)
        );
      } else {
        setFinalRecommendations({ recommendations: [], businesses: {}, model: model });
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalRecommendations();
  }, [userData]);

  return (
    <>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* {!isLoading && recommendationCat?.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              overflowX: 'auto',
              mb: -1,
            }}
          >
            {recommendationCat.map(({ category, count }) => (
              <Chip
                key={category}
                label={`${category} (${count})`}
                variant="outlined"
                size="medium"
                sx={{ bgcolor: 'action.hover' }}
              />
            ))}
          </Box>
        </Box>
      )} */}

      {!isLoading && finalRecommendations?.recommendations?.length > 0 && (
        // <BusinessCardList
        //   recommendations={finalRecommendations.recommendations}
        //   businesses={finalRecommendations.businesses}
        //   model={finalRecommendations.model}
        // />
        <BusinessCardCarousel
          recommendations={finalRecommendations.recommendations}
          businesses={finalRecommendations.businesses}
          model={finalRecommendations.model}
        />
      )}
    </>
  );
};

export default FinalRecommendation;