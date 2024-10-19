# Content Recommendation System
This project focuses on studying content recommendation systems. Some datasets are very large, so they are not uploaded to GitHub. Use the following [link](https://github.com/tonyctyy/content-recommendation/archive/master.zip) to download the main branch of the repository.

## Table of Contents
- [Content Recommendation System](#content-recommendation-system)
  - [Table of Contents](#table-of-contents)
  - [Useful Links](#useful-links)
  - [Instructions](#instructions)
    - [Local Setup](#local-setup)
    - [Remote Server (UST)](#remote-server-ust)
  - [Summary (updated on 6/9/2024)](#summary-updated-on-692024)
    - [Content Recommendation System](#content-recommendation-system-1)
    - [Popular Techniques](#popular-techniques)
  - [Future Improvements](#future-improvements)
    - [React Implementation](#react-implementation)
      - [1. Handle large business\_id requests:](#1-handle-large-business_id-requests)
      - [2. Display businesses in tabs:](#2-display-businesses-in-tabs)

## Useful Links
- [Trello](https://trello.com/b/5JG6Hmrf/milestones-tasks): Trello board for project management.
- [Perplexity](https://www.perplexity.ai/collections/Content-Recommendation-FYP-r8AxwOpsSAyDXFh7Np00lg): Perplexity is used for research purposes. We have a group chat here for asking questions.
- [Google Drive](https://drive.google.com/drive/folders/1z4Vid9NfHBhHb9hb7fLza9E-zdlkhOt6?usp=drive_link): Google Drive is used for storing zipped/processed datasets.
- [Introduction to Content Recommendation Systems](https://slogix.in/phd-research-topics-in-recommender-systems-based-on-deep-learning/): This website provides a brief introduction to different content recommendation techniques and potential research directions. It’s a good starting point for the project.
- [Dataset for Content Recommendation System (GitHub)](https://github.com/RUCAIBox/RecSysDatasets): This GitHub repository contains various datasets for content recommendation systems.
- [Dataset used in the UCSD laboratory](https://cseweb.ucsd.edu/~jmcauley/datasets.html): This website contains some datasets used by the UCSD laboratory.

## Instructions
### Local Setup
If it is the first time setting up the project, check the detail in the [Introduction](#introduction) section.

Here are the frequently used commands:
  ```bash
  pipenv shell
  ```
To Start the Flask server:
  ```bash
  cd src/backend
  python app.py
  ```
Then, access the url `http://127.0.0.1:5000/` to check the Flask server.
  

### Remote Server (UST)
We will use the UST server to store and share the datasets. It can also reduce the load on you local machine (e.g., RAM usage). To access the UST server, you can refer to the [JupyterHub Guidebook](docs/jupyterhub_guidebook.md).

Here is the command to access the UST server:
  ```bash
  ssh -L 8000:localhost:8000 iefyp2024@iez177.ieda.ust.hk
  ```
  with the password: `FYPoct2024`
Then, access the url `http://127.0.0.1:8000/user/iefyp2024/lab` with the account `iefyp2024` and the password `FYPoct2024`.

## Summary (updated on 6/9/2024)
The following summary is based on material from the [Red Content Recommendation System Tutorial](logs/RedRS_tutorial/RedRS_tutorial.md). Check it for a comprehensive overview.

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
- **Collaborative Filtering (CF):** A widely used model in the retrieval stage. Common applications include **Item CF** and **User CF**. CF can be used to construct multiple channels to retrieve related content effectively.
  - **Challenges:**
    - Difficulty in finding user behavior data in open-source datasets.
      1. **Item-Item Collaborative Filtering:** This method only requires content data, making it suitable when user behavior data is unavailable.
      2. **Synthetic User Behavior Data:** Another approach is to generate synthetic user behavior data from available content data (i.e., simulation data that maintains the original properties).
    - Many null data points exist when considering millions of items and users (e.g., User Rating to Movies Matrix).

- **Deep Structured Semantic Model (DSSM):** Another widely used model in the retrieval stage. DSSM is a neural network model that uses a pairwise loss function to learn the similarity between two items.

## Future Improvements
### React Implementation
#### 1. Handle large business_id requests:
- Current Situation: Currently sending all business IDs in one request for 10 results.
- Future Improvement: When working with 100 or 1000 results, implement chunking (splitting the requests) or another strategy to optimize the number of requests.
- React: Handle large data chunks more efficiently in the React version by batching requests or using pagination.

#### 2. Display businesses in tabs:
- Current Situation: All businesses are displayed in one shot.
- Future Improvement: Implement a feature to limit the number of businesses displayed per tab (e.g., 10, 20, 50 results). Add navigation between tabs.
- React: Develop pagination and tab navigation for business results in the React frontend.