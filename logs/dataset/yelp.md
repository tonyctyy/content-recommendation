[Back to Log Page](../README.md) | [Back to Main Page](../../README.md)   

# 18/6/2024: the Yelp Dataset (updated on 31/7/2024)
Yelp is a platform for users to find, review, and recommend businesses in different categories (e.g. food, shopping, entertainment, etc.) across 8 metropolitan areas in the USA and Canada. This dataset is originally used for the Yelp Challenge and it is open for academic research.

## Insights
- Variety of Attributes: There are many extra information that can be used as features (e.g. geographical location, business attributes, etc.)
- Weighted Score: The importance of each review can be weighted using the user's review history.

## [Official Dataset Documentation](https://www.yelp.com/dataset/documentation/main)
It has a total of six json files: ***business***, ***review***, ***user***, ***checkin***, ***tip***, ***photo***.

### Business
| Field | Type | Explanation |
| --- | --- | --- |
| business_id | string | 22 character unique string business id |
| name | string | The business's name |
| address | string | The full address of the business |
| city | string | The city |
| state | string | 2 character state code, if applicable |
| postal code | string | The postal code |
| latitude | float | Latitude |
| longitude | float | Longitude |
| stars | float | Star rating, rounded to half-stars |
| review_count | integer | Number of reviews |
| is_open | integer | 0 or 1 for closed or open, respectively |
| attributes | object | Business attributes to values. Note: some attribute values might be objects (e.g. RestaurantsTakeOut, BusinessParking) |
| categories | array of strings | Business categories (e.g. Mexican, Burgers) |
| hours | object | An object of key day to value hours, hours are using a 24hr clock | 
 
### Review
| Field | Type | Explanation |
| --- | --- | --- |
| review_id | string | 22 character unique review id |
| user_id | string | 22 character unique user id, maps to the user in user.json |
| business_id | string | 22 character business id, maps to business in business.json |
| stars | integer | Star rating |
| date | string | Date formatted YYYY-MM-DD |
| text | string | The review itself |
| useful | integer | Number of useful votes received |
| funny | integer | Number of funny votes received |
| cool | integer | Number of cool votes received |

### User
| Field | Type | Explanation |
| --- | --- | --- |
| user_id | string | 22 character unique user id, maps to the user in user.json |
| name | string | The user's first name |
| review_count | integer | The number of reviews they've written |
| yelping_since | string | When the user joined Yelp, formatted like YYYY-MM-DD |
| friends | array of strings | An array of the user's friend as user_ids |
| useful | integer | Number of useful votes sent by the user |
| funny | integer | Number of funny votes sent by the user |
| cool | integer | Number of cool votes sent by the user |
| fans | integer | Number of fans the user has |
| elite | array of integers | The years the user was elite |
| average_stars | float | Average rating of all reviews |
| compliment_hot | integer | Number of hot compliments received by the user |
| compliment_more | integer | Number of more compliments received by the user |
| compliment_profile | integer | Number of profile compliments received by the user |
| compliment_cute | integer | Number of cute compliments received by the user |
| compliment_list | integer | Number of list compliments received by the user |
| compliment_note | integer | Number of note compliments received by the user |
| compliment_plain | integer | Number of plain compliments received by the user |
| compliment_cool | integer | Number of cool compliments received by the user |
| compliment_funny | integer | Number of funny compliments received by the user |
| compliment_writer | integer | Number of writer compliments received by the user |
| compliment_photos | integer | Number of photo compliments received by the user |

### Checkin
| Field | Type | Explanation |
| --- | --- | --- |
| business_id | string | 22 character business id, maps to business in business.json |
| date | array of strings | An array of the checkin times, each with format YYYY-MM-DD HH:MM:SS |  

### Tip (~ short review that convey a tip or suggestion)
| Field | Type | Explanation |
| --- | --- | --- |
| text | string | The text of the tip |
| date | string | When the tip was written, formatted like YYYY-MM-DD |
| compliment_count | integer | How many compliments the tip has |
| business_id | string | 22 character business id, maps to business in business.json |
| user_id | string | 22 character unique user id, maps to the user in user.json |

### Photo
| Field | Type | Explanation |
| --- | --- | --- |
| photo_id | string | 22 character unique photo id |
| business_id | string | 22 character business id, maps to business in business.json |
| caption | string | The photo caption, if any |
| label | string | The category the photo belongs to, if any |

## [Dataset Example on Github](https://github.com/Yelp/dataset-examples)
- It shows different use cases of the Yelp Dataset. They are "Category Predictor" (given some text, predict likely categories), "Review Autopilot" (use a markov chain to finish a review, ~auto predict text outcome), "Positive Category Words" (generates positivity score for words either globally or per-category, ~ sentiment analysis).
- The set up is using the mjrob's runner (run the code in the docker container). It is based on Hadoop. We can choose either local or cloud environment.
  - Local: if you have access to your own hadoop cluster, check out the mrjob docs for instructions on how to set this up
  - Cloud: Amazon EMR

## [Kaggle Dataset](https://www.kaggle.com/datasets/yelp-dataset/yelp-dataset)
- I can't access the dataset on the official website so I find this archive version on Kaggle. However, it doesn't have the photo files since it is originally separated. We can also check how other people use this dataset on Kaggle.


