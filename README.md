# Content Recommendation System
This is a project studying about the content recommendation system. Some dataset is very large so don't upload to github.

## Table of Contents
- [Content Recommendation System](#content-recommendation-system)
  - [Table of Contents](#table-of-contents)
  - [Useful Links](#useful-links)
  - [Important Dates and Milestones](#important-dates-and-milestones)
    - [Before 1st Meeting ](#before-1st-meeting-)
    - [1st Meeting with Professor (July or August) ](#1st-meeting-with-professor-july-or-august-)
    - [After 1st Meeting ](#after-1st-meeting-)
  - [Additional Suggestions](#additional-suggestions)
    - [Literature Review](#literature-review)
    - [Data Preprocessing and Feature Engineering](#data-preprocessing-and-feature-engineering)
    - [Progress Tracking and Meetings](#progress-tracking-and-meetings)
    - [Testing, Evaluation, and Documentation](#testing-evaluation-and-documentation)
    - [Final Deliverables](#final-deliverables)
  - [Insights](#insights)
    - [Popular Techniques](#popular-techniques)
    - [Alternative Approaches](#alternative-approaches)
  - [Logs](#logs)
    - [18/6/2024: the Yelp Dataset ](#1862024-the-yelp-dataset-)
    - [18/6/2024: Some Existing Products ](#1862024-some-existing-products-)
      - [Tensorflow Recommenders](#tensorflow-recommenders)
      - [ScaNN (Scalable Nearest Neighbors)](#scann-scalable-nearest-neighbors)
      - [Tensorflow Lite](#tensorflow-lite)
      - [TensorFlow Recommenders Addons](#tensorflow-recommenders-addons)



## Useful Links
- [Perplexity](https://www.perplexity.ai/collections/Content-Recommendation-FYP-r8AxwOpsSAyDXFh7Np00lg): Perplexity is used for the research purpose and we have a group chat. We can ask questions here.
- [Introduction of Content Recommendation System](https://slogix.in/phd-research-topics-in-recommender-systems-based-on-deep-learning/): This website provides an brief intro on different content recommendation techniques, potential research directions, etc. We can kick off the project here.
- [Dataset for Content Recommendation System (Github)](https://github.com/RUCAIBox/RecSysDatasets): This Github repo contains many different datasets for content recommendation system. We can choose our dataset here.



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
### Literature Review 
- [ ] Conduct a comprehensive literature review to study existing research and techniques in content recommendation systems.
- [ ] Identify gaps, limitations, and potential areas for improvement or novelty.


### Data Preprocessing and Feature Engineering
- [ ] Include a phase for data preprocessing and feature engineering, if applicable.
- [ ] Perform necessary data cleaning, transformation, and feature extraction steps.


### Progress Tracking and Meetings 
- [ ] Plan for regular progress meetings or check-ins with the professor or team members.
- [ ] Discuss challenges, progress, and next steps during these meetings.


### Testing, Evaluation, and Documentation 
- [ ] Allocate time for testing and evaluating the system or research findings.
- [ ] Identify appropriate evaluation metrics and methodologies.
- [ ] Document the system architecture, implementation details, and research findings.


### Final Deliverables
- [ ] Include a phase for writing the research paper or preparing the final deliverables.
- [ ] Allocate sufficient time for revisions, proofreading, and formatting.



## Insights
### Popular Techniques 
- **Collaborative Filtering Systems:** These systems rely heavily on user behavior data to make recommendations.
- **Challenge:** Acquiring user behavior data can be difficult.


### Alternative Approaches 
**Content-Based Techniques:**
- **Item-Item Collaborative Filtering:** This method only requires content data, making it suitable when user behavior data is unavailable.

**Synthetic User Behavior Data:**
- **Generating Data:** Another approach is to generate synthetic user behavior data from available content data.



## Logs
### 18/6/2024: the Yelp Dataset <a name="18622024-the-yelp-dataset"></a>
Yelp is a platform for users to find, review, and recommend businesses in different categories (e.g. food, shopping, entertainment, etc.) across 8 metropolitan areas in the USA and Canada. This dataset is originally used for the Yelp Challenge and it is open for academic research.

[Official Dataset Documentation](https://www.yelp.com/dataset/documentation/main)
- It has a total of six json files: business, review, user, checkin, tip, photo.
- Business: location data, rate, attributes, categories, hours, etc.
- Review: user review (rate, text), other people's response to the review (vote), etc.
- User: review count, friends, vote count, fan count, compliments count, etc.
- Checkin: checkin time
- Tip (~ short review that convey a tip or suggestion): text, compliments count
- Photo: caption, classification label (one of "food", "drink", "menu", "inside" or "outside").

[Dataset Example on Github](https://github.com/Yelp/dataset-examples)
- It shows different use cases of the Yelp Dataset. They are "Category Predictor" (given some text, predict likely categories), "Review Autopilot" (use a markov chain to finish a review, ~auto predict text outcome), "Positive Category Words" (generates positivity score for words either globally or per-category, ~ sentiment analysis).
- The set up is using the mjrob's runner (run the code in the docker container). It is based on Hadoop. We can choose either local or cloud environment.
  - Local: if you have access to your own hadoop cluster, check out the mrjob docs for instructions on how to set this up
  - Cloud: Amazon EMR

[Kaggle Dataset](https://www.kaggle.com/datasets/yelp-dataset/yelp-dataset)
- I can't access the dataset on the official website so I find this archive version on Kaggle. However, it doesn't have the photo files since it is originally separated. We can also check how other people use this dataset on Kaggle.

**Insights**: I haven't check the detail of the json data (the validity of the data in terms of the date, area, number of data, etc.). But I think it is useful that we can use the Collaborative Filtering Systems here since it also provide the user profile data. Still, We need to check if they are valid or not.


### 18/6/2024: Some Existing Products <a name="18622024-some-existing-products"></a>
- [Recommendation System Intro from TensorFlow on YouTube](https://www.youtube.com/watch?v=BthUPVwA59s&list=PLQY2H8rRoyvy2MiyUBz5RWZr5MPFkV3qz&index=2)

#### [Tensorflow Recommenders](https://github.com/tensorflow/recommenders)
It is based on Tensorflow 2.0 and Keras. It is an open-source project on Github that provides a set of components for building, evaluating, and deploying recommender models. It aims at covering the entire stack, from retrieval, through ranking, to post-ranking. It integrate with
- **Generative Adversarial Networks (GAN)**: for efficient retrieval
- [**TF-Ranking**](https://github.com/tensorflow/ranking): for efficient ranking
- **TPU**: for training large-scale models

#### [ScaNN (Scalable Nearest Neighbors)](https://github.com/google-research/google-research/tree/master/scann)
It can be used to conduct efficient vector similarity search. Modern machine learning models can transform input such as images into embeddings (high-dimensional vectors trained such that more similar inputs cluster close together). Given a query item, we can find the embeddings that are closest to the query item's embedding. ScaNN is designed to

#### [Tensorflow Lite](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/lite)
It is a on-device machine learning framework for mobile and embedded devices without network dependency and instant response to user's interaction or context changes.

#### [TensorFlow Recommenders Addons](https://github.com/tensorflow/recommenders-addons)
It is a community-driven SIG group focused on large scale recommendation models.
- How to train large-scale sparse models
- How to deal with dynamic embedding
It also includes useful tools such as **Dynamic Embedding** from Tencent and **Embedding Variable** from Alibaba.

