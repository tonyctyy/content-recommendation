[Back to Main Page](../../README.md)

# 18/6/2024: the Yelp Dataset
Yelp is a platform for users to find, review, and recommend businesses in different categories (e.g. food, shopping, entertainment, etc.) across 8 metropolitan areas in the USA and Canada. This dataset is originally used for the Yelp Challenge and it is open for academic research.

## [Official Dataset Documentation](https://www.yelp.com/dataset/documentation/main)
- It has a total of six json files: business, review, user, checkin, tip, photo.
- Business: location data, rate, attributes, categories, hours, etc.
- Review: user review (rate, text), other people's response to the review (vote), etc.
- User: review count, friends, vote count, fan count, compliments count, etc.
- Checkin: checkin time
- Tip (~ short review that convey a tip or suggestion): text, compliments count
- Photo: caption, classification label (one of "food", "drink", "menu", "inside" or "outside").

## [Dataset Example on Github](https://github.com/Yelp/dataset-examples)
- It shows different use cases of the Yelp Dataset. They are "Category Predictor" (given some text, predict likely categories), "Review Autopilot" (use a markov chain to finish a review, ~auto predict text outcome), "Positive Category Words" (generates positivity score for words either globally or per-category, ~ sentiment analysis).
- The set up is using the mjrob's runner (run the code in the docker container). It is based on Hadoop. We can choose either local or cloud environment.
  - Local: if you have access to your own hadoop cluster, check out the mrjob docs for instructions on how to set this up
  - Cloud: Amazon EMR

## [Kaggle Dataset](https://www.kaggle.com/datasets/yelp-dataset/yelp-dataset)
- I can't access the dataset on the official website so I find this archive version on Kaggle. However, it doesn't have the photo files since it is originally separated. We can also check how other people use this dataset on Kaggle.

**Insights**: I haven't check the detail of the json data (the validity of the data in terms of the date, area, number of data, etc.). But I think it is useful that we can use the Collaborative Filtering Systems here since it also provide the user profile data. Still, We need to check if they are valid or not.
