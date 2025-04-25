// components/FinalRecommendation.jsx
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
  Box,
  CircularProgress,
} from '@mui/material';

import BusinessCardCarousel from './BusinessCardCarousel';

const FinalRecommendation = ({ userData, API_BASE_URL, model, k = 100 }) => {
  const [finalRecommendations, setFinalRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      let response;
      let data;
      let businesses = {};
      if (model === 'DeepFM') {
        response = await Axios.post(
          `${API_BASE_URL}/${model}_recommendations`,
          { user_id: userData.user_id, k }
        );
        data = response.data
      } else {
        response = await fetch('/popular_businesses.json');
        const records = await response.json();
        const recommendations = records.slice(0, k).map((record) => [record.business_id, record.popularity]);
        data = { recommendations };  
      }

      if (data.recommendations?.length){
        data.recommendations.sort(() => Math.random() - 0.5);
        if (model === 'DeepFM'){
          businesses = data.businesses;
        } else {
          const bizIds = data.recommendations.map(([id]) => id).join(',');
          const bizResp = await Axios.post(
            `${API_BASE_URL}/business_info`,
            { business_ids: bizIds }
          );
          businesses = bizResp.data;
        }
        setFinalRecommendations({
          recommendations: data.recommendations,
          businesses: businesses,
          model: model,
        });
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
    fetchRecommendations();
  }, [userData]);

  return (
    <>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && finalRecommendations?.recommendations?.length > 0 && (
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