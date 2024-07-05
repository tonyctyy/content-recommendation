# Content Recommendation System
This is a project studying about the content recommendation system. Some dataset is very large so don't upload to github. Use the following link to download the archive file: https://github.com/tonyctyy/content-recommendation/archive/master.zip

## Table of Contents
- [Content Recommendation System](#content-recommendation-system)
  - [Table of Contents](#table-of-contents)
  - [Useful Links](#useful-links)
  - [Summary (update on 30/6/2024)](#summary-update-on-3062024)
    - [Content Recommendation System](#content-recommendation-system-1)
    - [Popular Techniques](#popular-techniques)
    - [Measurements](#measurements)
    - [Strategy Procedure](#strategy-procedure)
  - [Important Dates and Milestones](#important-dates-and-milestones)
    - [Before 1st Meeting ](#before-1st-meeting-)
    - [1st Meeting with Professor (July or August) ](#1st-meeting-with-professor-july-or-august-)
    - [After 1st Meeting ](#after-1st-meeting-)
  - [Additional Suggestions](#additional-suggestions)
  - [Logs](#logs)



## Useful Links
- [Perplexity](https://www.perplexity.ai/collections/Content-Recommendation-FYP-r8AxwOpsSAyDXFh7Np00lg): Perplexity is used for the research purpose and we have a group chat. We can ask questions here.
- [Introduction of Content Recommendation System](https://slogix.in/phd-research-topics-in-recommender-systems-based-on-deep-learning/): This website provides an brief intro on different content recommendation techniques, potential research directions, etc. We can kick off the project here.
- [Dataset for Content Recommendation System (Github)](https://github.com/RUCAIBox/RecSysDatasets): This Github repo contains many different datasets for content recommendation system. We can choose our dataset here.
- [Tensorflow Official Tutorial](https://www.youtube.com/watch?v=BthUPVwA59s&list=PLQY2H8rRoyvy2MiyUBz5RWZr5MPFkV3qz&index=2): This series of videos provides an overview of the content recommendation system and how to build it using Tensorflow.
- [FunRec](https://github.com/datawhalechina/fun-rec?tab=readme-ov-file): This Github repo is a Chinese study content for content recommendation system but I haven't checked the detail.
- [Content Recommendation System Tutorial from Red Algorithm Engineer](https://youtu.be/5dTOPen28ts?si=qhYBTACSpeeFZXqk): This series of videos uses Red as the example to explain the content recommendation system. It is in Chinese and I use a lot information here to do the summary.



## Summary (update on 30/6/2024)
The following summary is based on the material from the [Red Content Reccomendation System Tutorial](logs/RedRS_tutorial.md). You should check it for the big picture.
### Content Recommendation System
The Content Recommendation System includes different stages:
1. **Retrieval** (reduce results from trillions to thousands)
   - It usually combines different methods (e.g. Collaborative Filtering, GNN)to retrieve results and add them up. 
2. **Pre-Ranking** (reduce results from thousands to hundreds)
   - This is where neural networks are used to do prediction in terms of the evaluation metrics (e.g. click-through rate, like rate). 
3. **Ranking** (a more complex mechanism to rank results compare to pre-ranking)
4. **Re-Ranking** (reduce results from hundreds to tens)
   - It considers both scores and variety of the results. As a result, it sets up rules to re-distribute similar results.
   - It uses different sampling methods (e.g. MMR, DPP) to reduce results. 
   - It also adds advertisements and additional information to the results.


### Popular Techniques 
- **Collaborative Filtering:**: This is a widely used technique in the retrieval stage. The general applications are **Item CF** and **User CF**. We can use CF to construct multiple tunels to retrieve related contont effectively.
  - **Challenges**
    - It is difficult to find user behavior data in open-source dataset.
      1. **Item-Item Collaborative Filtering:** This method only requires content data, making it suitable when user behavior data is unavailable.
      2. **Synthetic User Behavior Data:** Another approach is to generate synthetic user behavior data from available content data (i.e. simulation data that keep the original properties).
    - There will be many null data when considering millions of item and user (e.g. User Rating to Movies Matrix).
  

### Measurements 
**Case Study of Social Media (e.g. Red):**
- **Key Performance Indicators:**
  - Click Through Rate: Clicks/Impressions
  - Like Rate: Likes/Clicks
  - Share Rate: Shares/Clicks
  - Comment Rate: Comments/Clicks
  - Finish Rate: Scroll to the end/Clicks x f(length of the content)
- **North Star Metric** (This is a more important metric.)**:**
  - User Size: Daily Active Users (DAU), Monthly Active Users (MAU), etc.
  - User Stat: Average Time Spent on Content (ATC), Average Number of Content Views (ANV), etc.
  - Posting Stat: Average Number of Posts (AP), Post Penetration Rate (PPR), etc.


### Strategy Procedure
1. Offline Experiment 
   - This is the focus of the project. We can use the dataset to test the model.
2. AB Test
   - We can't use the dataset to conduct AB test as AB Test is a simulation.
3. Update Strategy



## Important Dates and Milestones
### Before 1st Meeting <a name="before-1st-meeting"></a>
- [ ] Study about the content recommendation system.
  - Explore different techniques and algorithms used in content recommendation systems.
  - Understand the challenges and limitations of existing approaches.
- [ ] Explore different datasets.
  - Identify potential datasets that can be used for the project.
  - Analyze the dataset characteristics (size, features, quality, etc.).
- [ ] Brainstorm about the content to be discussed in the 1st meeting.
  - Prepare questions and discussion points related to the project objectives, datasets, and potential approaches.


### 1st Meeting with Professor (July or August) <a name="1st-meeting-with-professor-july-or-august"></a>
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


### After 1st Meeting <a name="after-1st-meeting"></a>
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
- [18/6/2024: Tensorflow Tutorial](logs/tensorflow_tutorial.md)
- [18/6/2024: Yelp Dataset](logs/dataset/yelp.md)
- [26/6/2024: Pre-Meeting Brainstorm](logs/pre-meeting_brainstorm.md)
- [5/7/2024: Red Content Recommendation System Tutorial](logs/RedRS_tutorial.md)