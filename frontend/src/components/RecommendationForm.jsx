// RecommendationForm.jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import Axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.vars 
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.8)`
    : theme.palette.background.paper,
}));

export default function RecommendationForm({ setResults, setLoading }) {
    const [model, setModel] = React.useState('ItemCF');
    const [userId, setUserId] = React.useState('');
    const [k, setK] = React.useState(100);  

    const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
        const response = await Axios.post(`${API_BASE_URL}/ItemCF_recommendations`, {
        user_id: userId,
        k: k,
        });
        const data = response.data;
        
        // If recommendations exist, fetch business info
        if (data.recommendations && data.recommendations.length > 0) {
        const businessIds = data.recommendations.map(item => item[0]);
        const businessIdQuery = businessIds.join(',');
        
        const businessResponse = await Axios.post(`${API_BASE_URL}/business_info`, {
            business_ids: businessIdQuery,
        });
        
        const businessData = businessResponse.data;

        // Combine the data
        setResults({
            user: data.users ? data.users[userId] : null,
            recommendations: data.recommendations,
            businesses: businessData,
            model: model
        });
        } else {
        setResults({
            user: data.users ? data.users[userId] : null,
            recommendations: [],
            businesses: {},
            model: model
        });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
    };

    return (
    <Box sx={{ width: '100%' }}>
        
        <StyledCard>
        <CardContent sx={{ p: 0 }}>
            <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexWrap: 'wrap', // allow items to wrap to the next line
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                // align item in center
                alignItems: 'flex-end'
            }}
            >
            <FormControl sx={{ minWidth: 250 }} size="small">
                <InputLabel id="model-select-label">Recommendation Model</InputLabel>
                <Select
                labelId="model-select-label"
                id="model"
                value={model}
                label="Recommendation Model"
                onChange={(e) => setModel(e.target.value)}
                required
                >
                <MenuItem value="ItemCF">Item-based Collaborative Filtering (ItemCF)</MenuItem>
                <MenuItem value="DSSM">Deep Structured Semantic Model (DSSM)</MenuItem>
                <MenuItem value="DeepFM">Deep Factorized Machines (DeepFM)</MenuItem>
                </Select>
            </FormControl>
            
            <TextField
                id="userId"
                label="User ID"
                variant="outlined"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                sx={{ flexGrow: 1 }}

            />
            
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    startIcon={<SearchIcon />}
                    sx={{ height: '100%' }}
                >
                    Get Recommendations
                </Button>
            </Box>

            </Box>
        </CardContent>
        </StyledCard>
    </Box>
    );
}