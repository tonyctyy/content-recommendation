# Content Recommendation System

This project focuses on studying content recommendation systems. Some datasets are very large, so they are not uploaded to GitHub. Use the following [link](https://github.com/tonyctyy/content-recommendation/archive/master.zip) to download the main branch of the repository.

## Table of Contents
- [Content Recommendation System](#content-recommendation-system)
  - [Table of Contents](#table-of-contents)
  - [Logs](#logs)
  - [Useful Links](#useful-links)
  - [Summary (updated on 30/6/2024)](#summary-updated-on-3062024)
    - [Content Recommendation System](#content-recommendation-system-1)
    - [Popular Techniques](#popular-techniques)
    - [Measurements](#measurements)
    - [Strategy Deployment](#strategy-deployment)

## Logs
All logs related to the project (e.g., dataset information, tutorials, etc.) are stored in the [logs](./logs/README.md) folder. Check the logs for more details.

## Useful Links
- [Trello](https://trello.com/b/5JG6Hmrf/milestones-tasks): Trello board for project management.
- [Perplexity](https://www.perplexity.ai/collections/Content-Recommendation-FYP-r8AxwOpsSAyDXFh7Np00lg): Perplexity is used for research purposes. We have a group chat here for asking questions.
- [Introduction to Content Recommendation Systems](https://slogix.in/phd-research-topics-in-recommender-systems-based-on-deep-learning/): This website provides a brief introduction to different content recommendation techniques and potential research directions. It’s a good starting point for the project.
- [Dataset for Content Recommendation System (GitHub)](https://github.com/RUCAIBox/RecSysDatasets): This GitHub repository contains various datasets for content recommendation systems.
- [Dataset used in the UCSD laboratory](https://cseweb.ucsd.edu/~jmcauley/datasets.html): This website contains some datasets used by the UCSD laboratory.

## Summary (updated on 30/6/2024)
The following summary is based on material from the [Red Content Recommendation System Tutorial](logs/RedRS_tutorial.md). Check it for a comprehensive overview.

### Content Recommendation System
The Content Recommendation System includes several stages:
1. **Retrieval** (reduces results from trillions to thousands)
   - Typically combines different methods (e.g., Collaborative Filtering, GNN) to retrieve results and aggregate them.

2. **Pre-Ranking** (reduces results from thousands to hundreds)
   - Neural networks are used here to predict evaluation metrics (e.g., click-through rate, like rate).

3. **Ranking** (a more complex mechanism for ranking results compared to pre-ranking)

4. **Re-Ranking** (reduces results from hundreds to tens)
   - Considers both scores and variety of the results, setting rules to redistribute similar results.
   - Uses different sampling methods (e.g., MMR, DPP) to reduce results.
   - Adds advertisements and additional information to the results.

### Popular Techniques
- **Collaborative Filtering:** A widely used technique in the retrieval stage. Common applications include **Item CF** and **User CF**. CF can be used to construct multiple channels to retrieve related content effectively.
  - **Challenges:**
    - Difficulty in finding user behavior data in open-source datasets.
      1. **Item-Item Collaborative Filtering:** This method only requires content data, making it suitable when user behavior data is unavailable.
      2. **Synthetic User Behavior Data:** Another approach is to generate synthetic user behavior data from available content data (i.e., simulation data that maintains the original properties).
    - Many null data points exist when considering millions of items and users (e.g., User Rating to Movies Matrix).

### Measurements
**Case Study of Social Media (e.g., Red):**
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

### Strategy Deployment
1. **Offline Experiment:**
   - The focus of the project. We can use the dataset to test the model.

2. **AB Test:**
   - We can't use the dataset to conduct AB tests as AB Testing requires a live environment for simulation.

3. **Update Strategy**