<h1>Content Recommendation System</h1>

This is a project studying content recommendation systems. Some datasets are very large, so they are not uploaded to GitHub. Use the following [link](https://github.com/tonyctyy/content-recommendation/archive/master.zip) to download the archive file.


## Table of Contents
- [Table of Contents](#table-of-contents)
- [Useful Links](#useful-links)
- [Summary (updated on 30/6/2024)](#summary-updated-on-3062024)
  - [Content Recommendation System](#content-recommendation-system)
  - [Popular Techniques](#popular-techniques)
  - [Measurements](#measurements)
  - [Strategy Deployment](#strategy-deployment)
- [Important Dates and Milestones](#important-dates-and-milestones)
  - [Before 1st Meeting](#before-1st-meeting)
  - [1st Meeting with Professor (July or August)](#1st-meeting-with-professor-july-or-august)
  - [After 1st Meeting](#after-1st-meeting)
- [Additional Suggestions](#additional-suggestions)
- [Logs](#logs)



## Useful Links
- [Perplexity](https://www.perplexity.ai/collections/Content-Recommendation-FYP-r8AxwOpsSAyDXFh7Np00lg): Perplexity is used for research purposes, and we have a group chat. We can ask questions here.
- [Introduction to Content Recommendation Systems](https://slogix.in/phd-research-topics-in-recommender-systems-based-on-deep-learning/): This website provides a brief intro to different content recommendation techniques, potential research directions, etc. We can kick off the project here.
- [Dataset for Content Recommendation System (GitHub)](https://github.com/RUCAIBox/RecSysDatasets): This GitHub repo contains many different datasets for content recommendation systems. We can choose our dataset here.
- [Dataset used in the UCSD laboratory](https://cseweb.ucsd.edu/~jmcauley/datasets.html): This website contains some datasets used by the UCSD laboratory.
- [TensorFlow Official Tutorial](https://www.youtube.com/watch?v=BthUPVwA59s&list=PLQY2H8rRoyvy2MiyUBz5RWZr5MPFkV3qz&index=2): This series of videos provides an overview of content recommendation systems and how to build them using TensorFlow.
- [FunRec](https://github.com/datawhalechina/fun-rec?tab=readme-ov-file): This GitHub repo is a Chinese study resource for content recommendation systems, but I haven't checked the details yet.
- [Content Recommendation System Tutorial from Red Algorithm Engineer](https://youtu.be/5dTOPen28ts?si=qhYBTACSpeeFZXqk): This series of videos uses Red as an example to explain content recommendation systems. It's in Chinese, and I've used a lot of information from here for the summary.



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



## Important Dates and Milestones
### Before 1st Meeting
- [ ] Study content recommendation systems
  - Explore different techniques and algorithms used in content recommendation systems.
  - Understand the challenges and limitations of existing approaches.

- [ ] Explore different datasets
  - Identify potential datasets that can be used for the project.
  - Analyze the dataset characteristics (size, features, quality, etc.).

- [ ] Brainstorm about the content to be discussed in the 1st meeting
  - Prepare questions and discussion points related to the project objectives, datasets, and potential approaches.


### 1st Meeting with Professor (July or August)
- [ ] Define the objective of the project
  1. Decide whether the focus will be on studying different content recommendation techniques or solving a specific challenge.
  2. Identify potential research directions and novelty aspects.
  3. Determine if the project will involve building a practical content recommendation system.

- [ ] Define the deliverables
  1. Discuss the scope and format of the research paper (if applicable).
  2. Determine the scale and requirements of the content recommendation system (if applicable).

- [ ] Discuss the potential dataset and insights
  - Present the dataset analysis and insights gained from the exploration phase.
  - Discuss the suitability of the dataset for the project objectives.


### After 1st Meeting
- [ ] Project Proposal
  1. Define the objective of the project based on the discussion.
  2. Define the deliverables (research paper, system implementation, etc.).
  3. Finalize the dataset and document the insights and preprocessing steps.

- [ ] Project Plan
  1. Define the timeline with specific dates for major milestones.
  2. Break down the project into tasks and subtasks.
  3. Define the milestones and checkpoints for progress tracking.
  4. Assign roles and responsibilities to team members (if applicable).
  5. Identify potential risks and mitigation strategies.



## Additional Suggestions
1. Literature Review
   - [ ] Conduct a comprehensive literature review to study existing research and techniques in content recommendation systems.
   - [ ] Identify gaps, limitations, and potential areas for improvement or novelty.

2. Data Preprocessing and Feature Engineering
   - [ ] Include a phase for data preprocessing and feature engineering, if applicable.
   - [ ] Perform necessary data cleaning, transformation, and feature extraction steps.

3. Progress Tracking and Meetings
   - [ ] Plan for regular progress meetings or check-ins with the professor or team members.
   - [ ] Discuss challenges, progress, and next steps during these meetings.

4. Testing, Evaluation, and Documentation
   - [ ] Allocate time for testing and evaluating the system or research findings.
   - [ ] Identify appropriate evaluation metrics and methodologies.
   - [ ] Document the system architecture, implementation details, and research findings.

5. Final Deliverables
   - [ ] Include a phase for writing the research paper or preparing the final deliverables.
   - [ ] Allocate sufficient time for revisions, proofreading, and formatting.



## Logs
- [18/6/2024: TensorFlow Tutorial](logs/tensorflow_tutorial.md)
- [18/6/2024: Yelp Dataset](logs/dataset/yelp.md)
- [26/6/2024: Pre-Meeting Brainstorm](logs/pre-meeting_brainstorm.md)
- [5/7/2024: Red Content Recommendation System Tutorial](logs/RedRS_tutorial.md)
