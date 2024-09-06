[Back to Log Page](../README.md) | [Back to Main Page](../../../README.md)

# 5/7/2024: Red Content Recommendation System Tutorial

This is a summary of the [Red Content Recommendation System Tutorial](https://youtu.be/5dTOPen28ts?si=qhYBTACSpeeFZXqk). It showcases an industrial approach to content recommendation.

## Table of Contents
- [5/7/2024: Red Content Recommendation System Tutorial](#572024-red-content-recommendation-system-tutorial)
  - [Table of Contents](#table-of-contents)
  - [Steps for Content Recommendation (CR) System](#steps-for-content-recommendation-cr-system)
  - [Measurements](#measurements)
  - [Strategy Deployment](#strategy-deployment)

## Steps for Content Recommendation (CR) System
1. [Retrieval](./RedRS_tutorial_Retrieval.md) (reduces results from trillions to thousands)
   - Typically combines different methods (e.g., Collaborative Filtering, GNN) to retrieve results and aggregate them.

2. [Pre-Ranking]() (reduces results from thousands to hundreds)
   - Neural networks are used here to predict evaluation metrics (e.g., click-through rate, like rate).

3. [Ranking]() (a more complex mechanism for ranking results compared to pre-ranking)

4. [Re-Ranking]() (reduces results from hundreds to tens)
   - Considers both scores and variety of the results, setting rules to redistribute similar results.
   - Uses different sampling methods (e.g., MMR, DPP) to reduce results.
   - Adds advertisements and additional information to the results.

## Measurements
- **Key Performance Indicators:**
  - Click-Through Rate: Clicks / Impressions
  - Like Rate: Likes / Clicks
  - Share Rate: Shares / Clicks
  - Comment Rate: Comments / Clicks
  - Finish Rate: (Scroll to the end / Clicks) × f(length of the content)

- **North Star Metric:** (An important metric)
  - User Size: Daily Active Users (DAU), Monthly Active Users (MAU), etc.
  - User Stats: Average Time Spent on Content (ATC), Average Number of Content Views (ANV), etc.
  - Posting Stats: Average Number of Posts (AP), Post Penetration Rate (PPR), etc.

## Strategy Deployment
1. **Offline Experiment:**
   - The focus of the project. We can use the dataset to test the model.

2. **AB Test:**
   - We can't use the dataset to conduct AB tests as AB Testing requires a live environment for simulation.

3. **Update Strategy**