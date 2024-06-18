# Content Recommendation System
This is a project studying about the content recommendation system. Some dataset is very large so don't upload to github.


## Useful Links
- [ ] [Perplexity](https://www.perplexity.ai/collections/Content-Recommendation-FYP-r8AxwOpsSAyDXFh7Np00lg): Perplexity is used for the research purpose and we have a group chat. We can ask questions here.
- [ ] [Introduction of Content Recommendation System](https://slogix.in/phd-research-topics-in-recommender-systems-based-on-deep-learning/): This website provides an brief intro on different content recommendation techniques, potential research directions, etc. We can kick off the project here.
- [ ] [Dataset for Content Recommendation System (Github)](https://github.com/RUCAIBox/RecSysDatasets): This Github repo contains many different datasets for content recommendation system. We can choose our dataset here.


## Insights
### Popular Techniques
- **Collaborative Filtering Systems:** These systems rely heavily on user behavior data to make recommendations. 
  - **Challenge:** Acquiring user behavior data can be difficult.
  
### Alternative Approaches
- **Content-Based Techniques:**
  - **Item-Item Collaborative Filtering:** This method only requires content data, making it suitable when user behavior data is unavailable.
- **Synthetic User Behavior Data:**
  - **Generating Data:** Another approach is to generate synthetic user behavior data from available content data.


## Logs

### 18/6/2024: the Yelp Dataset
Yelp is a platform for users to find, review, and recommend businesses in different categories (e.g. food, shopping, entertainment, etc.) across 8 metropolitan areas in the USA and Canada. This dataset is originally used for the Yelp Challenge and it is open for academic research.

- [ ] [Official Dataset Documentation](https://www.yelp.com/dataset/documentation/main)
  - It has a total of six json files: business, review, user, checkin, tip, photo. 
    - Business: location data, rate, attributes, categories, hours, etc.
    - Review: user review (rate, text), other people's response to the review (vote), etc.
    - User: review count, friends, vote count, fan count, compliments count, etc.
    - Checkin: checkin time
    - Tip (~ short review that convey a tip or suggestion): text, compliments count
    - Photo: caption, classification label (one of "food", "drink", "menu", "inside" or "outside"). 

- [ ] [Dataset Example on Github](https://github.com/Yelp/dataset-examples)
  - It shows different use cases of the Yelp Dataset. They are "Category Predictor" (given some text, predict likely categories), "Review Autopilot" (use a markov chain to finish a review, ~auto predict text outcome), "Positive Category Words" (generates positivity score for words either globally or per-category, ~ sentiment analysis).
  - The set up is using the mjrob's runner (run the code in the docker container). It is based on Hadoop. We can choose either local or cloud environment.
    - Local: if you have access to your own hadoop cluster, check out the mrjob docs for instructions on how to set this up
    - Cloud: Amazon EMR

- [ ] [Kaggle Dataset](https://www.kaggle.com/datasets/yelp-dataset/yelp-dataset) 
  - I can't access the dataset on the official website so I find this archive version on Kaggle. However, it doesn't have the photo files since it is originally separated. We can also check how other people use this dataset on Kaggle.

**Insights**: I haven't check the detail of the json data (the validity of the data in terms of the date, area, number of data, etc.). But I think it is useful that we can use the Collaborative Filtering Systems here since it also provide the user profile data. Still, We need to check if they are valid or not.

### 18/6/2024: Some Existing Products
- [ ] [Recommendation System Intro from TensorFlow on YouTube](https://www.youtube.com/watch?v=BthUPVwA59s&list=PLQY2H8rRoyvy2MiyUBz5RWZr5MPFkV3qz&index=2)

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
