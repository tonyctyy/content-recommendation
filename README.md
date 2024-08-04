<h1>Content Recommendation System</h1>

This is a project studying content recommendation systems. Some datasets are very large, so they are not uploaded to GitHub. Use the following [link](https://github.com/tonyctyy/content-recommendation/archive/master.zip) to download the archive file.


## Table of Contents
- [Table of Contents](#table-of-contents)
- [Logs](#logs)
- [Useful Links](#useful-links)
- [Summary (updated on 30/6/2024)](#summary-updated-on-3062024)
  - [Content Recommendation System](#content-recommendation-system)
  - [Popular Techniques](#popular-techniques)
  - [Measurements](#measurements)
  - [Strategy Deployment](#strategy-deployment)

## Logs
We stored all the logs about the project (e.g. dataset, tutorials, etc.) in the [logs](./logs/README.md) folder. You can check the logs for more details.


## Useful Links
- [Trello](https://trello.com/b/5JG6Hmrf/milestones-tasks): This Trello board is used for project management.
- [Perplexity](https://www.perplexity.ai/collections/Content-Recommendation-FYP-r8AxwOpsSAyDXFh7Np00lg): Perplexity is used for research purposes, and we have a group chat. We can ask questions here.
- [Introduction to Content Recommendation Systems](https://slogix.in/phd-research-topics-in-recommender-systems-based-on-deep-learning/): This website provides a brief intro to different content recommendation techniques, potential research directions, etc. We can kick off the project here.
- [Dataset for Content Recommendation System (GitHub)](https://github.com/RUCAIBox/RecSysDatasets): This GitHub repo contains many different datasets for content recommendation systems. We can choose our dataset here.
- [Dataset used in the UCSD laboratory](https://cseweb.ucsd.edu/~jmcauley/datasets.html): This website contains some datasets used by the UCSD laboratory.


## Summary (updated on 30/6/2024)
The following summary is based on the material from the [Red Content Recommendation System Tutorial](logs/RedRS_tutorial.md). You should check it for the big picture.

### Content Recommendation System
The Content Recommendation System includes different stages:
1. **Retrieval** (reduce results from trillions to thousands)
   - It usually combines different methods (e.g., Collaborative Filtering, GNN) to retrieve results and add them up.

2. **Pre-Ranking** (reduce results from thousands to hundreds)
   - This is where neural networks are used to predict evaluation metrics (e.g., click-through rate, like rate).

3. **Ranking** (a more complex mechanism to rank results compared to pre-ranking)

4. **Re-Ranking** (reduce results from hundreds to tens)
   - It considers both scores and variety of the results. As a result, it sets up rules to redistribute similar results.
   - It uses different sampling methods (e.g., MMR, DPP) to reduce results.
   - It also adds advertisements and additional information to the results.

### Popular Techniques
- **Collaborative Filtering:** This is a widely used technique in the retrieval stage. The general applications are **Item CF** and **User CF**. We can use CF to construct multiple tunnels to retrieve related content effectively.
  - **Challenges**
    - It is difficult to find user behavior data in open-source datasets.
      1. **Item-Item Collaborative Filtering:** This method only requires content data, making it suitable when user behavior data is unavailable.
      2. **Synthetic User Behavior Data:** Another approach is to generate synthetic user behavior data from available content data (i.e., simulation data that maintains the original properties).

    - There will be many null data points when considering millions of items and users (e.g., User Rating to Movies Matrix).

### Measurements
**Case Study of Social Media (e.g., Red):**
- **Key Performance Indicators:**
  - Click-Through Rate: Clicks / Impressions
  - Like Rate: Likes / Clicks
  - Share Rate: Shares / Clicks
  - Comment Rate: Comments / Clicks
  - Finish Rate: (Scroll to the end / Clicks) × f(length of the content)

- **North Star Metric** (This is a more important metric):
  - User Size: Daily Active Users (DAU), Monthly Active Users (MAU), etc.
  - User Stats: Average Time Spent on Content (ATC), Average Number of Content Views (ANV), etc.
  - Posting Stats: Average Number of Posts (AP), Post Penetration Rate (PPR), etc.

### Strategy Deployment
1. Offline Experiment
   - This is the focus of the project. We can use the dataset to test the model.

2. AB Test
   - We can't use the dataset to conduct AB tests as AB Testing requires a live environment for simulation.

3. Update Strategy