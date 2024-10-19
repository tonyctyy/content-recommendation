[Back to Main Page](./README.md)

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
  - [1. Local Setup vs Remote Server (UST)](#1-local-setup-vs-remote-server-ust)
  - [2. Development and Testing](#2-development-and-testing)
- [Folder Structure](#folder-structure)
- [Data Sampling](#data-sampling)
- [Item Collaborative Filtering Model (Testing Stage)](#item-collaborative-filtering-model-testing-stage)
  - [Data Loading](#data-loading)
  - [Sparse Cosine Similarity Calculation](#sparse-cosine-similarity-calculation)
  - [Index Table for Results Prediction](#index-table-for-results-prediction)
  - [Predicting Recommendations](#predicting-recommendations)
- [Database Setup](#database-setup)
  - [Indexed Tables](#indexed-tables)
  - [Processed Dataset Table Structures](#processed-dataset-table-structures)
    - [Business Data](#business-data)
    - [User Data](#user-data)
    - [Review Data](#review-data)
    - [Tip Data](#tip-data)
- [Flask Backend Server](#flask-backend-server)
  - [Backend Server Setup](#backend-server-setup)
  - [Flask File Structure](#flask-file-structure)

## Introduction
The following sections use the [Yelp Dataset](./logs/dataset/yelp.md) to demonstrate the system flow and database setup using the **Item-based Collaborative Filtering Model** from the [Red Recommendation System Tutorial](./logs/RedRS_tutorial/RedRS_tutorial_Retrieval.md). These stages guide you through understanding the system flow and database setup.

### 1. Local Setup vs Remote Server (UST)
It's recommended to develop using a local setup, as it's easier to maintain and debug. The UST server can be used in cases where:
- Your local machine lacks sufficient resources (mainly RAM) for model processing/training and indexing.
- You need to access datasets stored on the UST server, including raw and processed datasets accessible via the JupyterHub server.

**Local Setup**: 
1. Use `pipenv` for dependency (packages) management. To install `pipenv`, run the following:
    ```bash
    pip install pipenv
    ```
    ***Note***: You only need to install `pipenv` once.

2. To install the dependencies, run:
    ```bash
    pipenv install
    ```
    This will install the required packages specified in the `Pipfile`. If you want to add new packages, you can install them using `pipenv install <package_name>`.
3. To execute Python code in the virtual environment, run:
    ```bash
    pipenv shell
    ```
    After entering the pipenv shell, you can run Python code as usual (e.g. `python src/data_processing/data_sampling.py`). For Jupyter Notebook, you can choose the kernel `content-recommendation` in the Jupyter Notebook.

The detail for the `Flask` backend server is provided in the section, [Flask Backend Server](#flask-backend-server).

**Remote Server Setup**: You may check the detail setup in [Jupyterhub Guidebook](./logs/jupyterhub_guidebook.md).

### 2. Development and Testing
Development and testing of the recommendation system can be done locally. The stages of the system flow include:
1. **Data Sampling**: A reduced version of the Yelp dataset is used for faster processing and testing.
2. **Model Testing**: Jupyter Notebooks are used to test calculations and predictions.
3. **Index Tables**: Store trained model results for prediction in `SQLite`. When using new datasets, consider the database structure for the UI. (See [Processed Dataset Table Structures](#processed-dataset-table-structures)).
4. **Backend Server**: Transfer model results to the backend server for API testing with a UI.
5. **Frontend**: Use `Flask` for a simple display of results. The frontend will eventually be migrated to `React.js`.

We'll first focus on steps 1 to 3 to understand and test different datasets and content recommendation models.

## Folder Structure
The project folder structure is organized as follows:

```bash
content-recommendation/
├── data/
│   ├── processed_data/
│   │   ├── yelp_data/             # Frontend Database
│   │   │   ├── yelp_business_data.db
│   │   │   ├── yelp_user_data.db
│   │   │   ├── yelp_review_data.db
│   │   │   └── yelp_tip_data.db
│   │   └── yelp_ItemCF.db         # Index Table for Item Collaborative Filtering (CF)
│   ├── raw_datasets/
│   │   └── yelp/                  # Raw Dataset Samples
│   │       ├── sampled_yelp_academic_dataset_business.json
│   │       └── sampled_yelp_academic_dataset_review.json
│
├── logs/
│   ├── dataset/
│   │   └── yelp.md                # Original dataset description
│   ├── flask_guidebook.md 
│   ├── jupyterhub_guidebook.md
│   └── RedRS_tutorial/
│       └── RedRS_tutorial_Retrieval.md  # Item-based CF model Reference
│
├── src/
│   ├── backend/                   # Flask Backend Server
│   │   ├── app.py
│   └── data_processing/
│       ├── data_index.ipynb        # Store Processed Tables for Frontend
│       └── data_sampling.py        # Data Sampling Script
│   ├── ItemCF_Index.ipynb          # Item-based CF Indexing
│   └── ItemCF_Retrieval.ipynb      # Item-based CF Retrieval
├── README.md                       # Main Page
├── Introduction.md                 # Current File
└── Pipfile                         # Package Management

```

## Data Sampling
The Yelp dataset is sampled to create a smaller subset for faster processing and testing of the recommendation system. The script `data_sampling.py` provides the following functionalities:

- **Random Sampling**: Allows random sampling of a percentage of records from large datasets (e.g., reviews, businesses, or users) for testing purposes.
- **Condition-Based Sampling**: Filters businesses or users with specific conditions before sampling, like selecting businesses with more reviews or users with multiple interactions.
- **Configurable Parameters**: Enables easy adjustment of sampling rates and conditions to suit different test scenarios.

The sampling process also ensures related records are included. For more details, refer to the script: [data_sampling.py](./src/data_%20processing/data_sampling.py).

## Item Collaborative Filtering Model (Testing Stage)
For detail code, please refer to: [Item_CF_Index.ipynb](./src/ItemCF_Index.ipynb) and [Item_CF_Retrieval.ipynb](./src/ItemCF_Retrieval.ipynb).

### Data Loading
The project uses the sampled Yelp academic dataset. Below is a sample of how the data is loaded:

```python
folder_path = './data/'
transit_bucket = 'raw_datasets/'
target_bucket = 'yelp/'
prefix_path = folder_path + transit_bucket + target_bucket
file_list = [
    "sampled_yelp_academic_dataset_business.json",
    "sampled_yelp_academic_dataset_review.json",
]

df = load_dataset(file_list, prefix_path)
df_business = df["sampled_yelp_academic_dataset_business.json"]
df_review = df["sampled_yelp_academic_dataset_review.json"]
```

### Sparse Cosine Similarity Calculation
The system calculates cosine similarity between items based on user ratings using Sparse Matrix Multiplication:

``` python
def sparse_cosine_similarity_topn(A, top_n, threshold=0):
    C = sp_matmul_topn(A.T, A.T, top_n=top_n, threshold=threshold, n_threads=4, sort=True)
    return C
```

### Index Table for Results Prediction
After calculating the similarity matrix, index tables are created to store:
- **User-item interactions**
- **Item-item similarity vectors**
- **Business mappings for numerical indexing**
These tables facilitate recommendation predictions. For more details, refer to the section on [Database Setup](#database-setup).

### Predicting Recommendations
The system accepts a user ID as input and predicts the top N recommendations using the item-item similarity matrix.


## Database Setup
We use SQLite to store user-item interactions and item-item similarities. Below is the setup:

``` python
db_path = './data/processed_data/yelp_ItemCF.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
```

### Indexed Tables
The following indexed tables are created to facilitate efficient queries:

1. **user_item_index**: Stores user-item interactions:
    ``` sql
   CREATE TABLE IF NOT EXISTS user_item_index (
       user_id TEXT,
       business_id TEXT,
       stars_review REAL,
       PRIMARY KEY (user_id, business_id)
   )
    ```

2. **item_item_similarity**: Stores similarity vectors between items:
    ``` sql
   CREATE TABLE IF NOT EXISTS item_item_similarity (
       item_id TEXT PRIMARY KEY,
       similarity_vector BLOB
   )
    ```

3. **business_mapping**: Maps business IDs to numerical indices:
    ``` sql
   CREATE TABLE IF NOT EXISTS business_mapping (
       business_id TEXT PRIMARY KEY,
       business_idx INTEGER
   )
    ```

### Processed Dataset Table Structures
This section describes the table structures of the processed dataset stored in the SQLite database which is used for front-end application development.

#### Business Data

**Table Name:** `business_details`  
**Location:** `../../data/processed_data/yelp_data/yelp_business_data.db`

| Column Name   | Data Type | Description                                   |
|---------------|-----------|-----------------------------------------------|
| business_id   | TEXT      | Unique identifier for each business          |
| name          | TEXT      | Name of the business                          |
| address       | TEXT      | Street address of the business                |
| city          | TEXT      | City where the business is located            |
| state         | TEXT      | State where the business is located           |
| postal_code   | TEXT      | Postal code of the business                   |
| latitude      | REAL      | Latitude coordinate of the business location   |
| longitude     | REAL      | Longitude coordinate of the business location  |
| stars         | REAL      | Average star rating of the business           |
| review_count  | INTEGER   | Number of reviews for the business            |
| is_open       | INTEGER   | Indicator of whether the business is open (1) or closed (0) |
| attributes    | TEXT      | Attributes of the business stored as a string |
| hours         | TEXT      | Operating hours of the business stored as a string |

**Table Name:** `business_categories`  
**Location:** `../../data/processed_data/yelp_data/yelp_business_data.db`

| Column Name   | Data Type | Description                                   |
|---------------|-----------|-----------------------------------------------|
| business_id   | TEXT      | Foreign key referencing `business_details`    |
| category      | TEXT      | Category of the business                       |

**Table Name:** `checkin_data`  
**Location:** `../../data/processed_data/yelp_data/yelp_business_data.db`

| Column Name   | Data Type | Description                                   |
|---------------|-----------|-----------------------------------------------|
| business_id   | TEXT      | Foreign key referencing `business_details`    |
| checkin_date  | TEXT      | Date of check-in (format: YYYY-MM-DD HH:MM:SS) |

#### User Data

**Table Name:** `user_data`  
**Location:** `../../data/processed_data/yelp_data/yelp_user_data.db`

| Column Name         | Data Type | Description                                   |
|---------------------|-----------|-----------------------------------------------|
| user_id             | TEXT      | Unique identifier for each user               |
| name                | TEXT      | Name of the user                              |
| review_count        | INTEGER   | Number of reviews written by the user        |
| yelping_since       | TEXT      | Date when the user joined (format: YYYY-MM) |
| useful              | INTEGER   | Useful votes received                          |
| funny               | INTEGER   | Funny votes received                           |
| cool                | INTEGER   | Cool votes received                            |
| fans                | INTEGER   | Number of fans                                |
| average_stars       | REAL      | Average star rating given by the user        |
| friends             | TEXT      | List of friends stored as a string            |
| elite               | TEXT      | Years the user was elite stored as a string   |
| compliment_hot      | INTEGER   | Number of hot compliments received             |
| compliment_more     | INTEGER   | Number of more compliments received            |
| compliment_profile   | INTEGER   | Number of profile compliments received         |
| compliment_cute     | INTEGER   | Number of cute compliments received            |
| compliment_list     | INTEGER   | Number of list compliments received            |
| compliment_note     | INTEGER   | Number of note compliments received            |
| compliment_plain    | INTEGER   | Number of plain compliments received           |
| compliment_cool     | INTEGER   | Number of cool compliments received            |
| compliment_funny    | INTEGER   | Number of funny compliments received           |
| compliment_writer   | INTEGER   | Number of writer compliments received          |
| compliment_photos   | INTEGER   | Number of photo compliments received           |

#### Review Data

**Table Name:** `review_data`  
**Location:** `../../data/processed_data/yelp_data/yelp_review_data.db`

| Column Name   | Data Type | Description                                   |
|---------------|-----------|-----------------------------------------------|
| review_id     | TEXT      | Unique identifier for each review             |
| user_id       | TEXT      | Foreign key referencing `user_data`           |
| business_id   | TEXT      | Foreign key referencing `business_details`    |
| stars         | REAL      | Star rating given in the review               |
| date          | TEXT      | Date of the review (format: YYYY-MM-DD HH:MM:SS) |
| text          | TEXT      | Review text                                   |
| useful        | INTEGER   | Useful votes received                          |
| funny         | INTEGER   | Funny votes received                           |
| cool          | INTEGER   | Cool votes received                            |

#### Tip Data

**Table Name:** `tip_data`  
**Location:** `../../data/processed_data/yelp_data/yelp_tip_data.db`

| Column Name         | Data Type | Description                                   |
|---------------------|-----------|-----------------------------------------------|
| user_id             | TEXT      | Foreign key referencing `user_data`           |
| business_id         | TEXT      | Foreign key referencing `business_details`    |
| text                | TEXT      | Tip text                                      |
| date                | TEXT      | Date of the tip (format: YYYY-MM-DD HH:MM:SS) |
| compliment_count     | INTEGER   | Number of compliments received for the tip     |

## Flask Backend Server
### Backend Server Setup
We use Flask to build the backend server. To run the server, make sure you are inside the `pipenv` shell, then use the following command:
```bash
cd src/backend
pipenv shell
python app.py
```
The backend server will run at `http://127.0.0.1:5000/`, and you can access it through this URL.

### Flask File Structure
Although the primary focus is on running the backend using Python, some frontend files are also present. Here's a breakdown of the structure:

| File Type | Description |
| --- | --- |
| `hyml` |	Defines the structure of the web pages |
| `JavaScript` | Adds interactivity and dynamic content (e.g., button actions)|
| `css` | Stylesheets for the web pages |


The backend server is organized as follows:
```bash
content-recommendation/src/backend/
├── /models
│   └── ItemCF.py              # Item-based CF model
├── /templates                 # Stores HTML frontend files
|   ├── base.html              # Base template (includes header, footer, etc.)
|   └── index.html             # Main page
|   └── item_cf.html           # Item-based CF results page
├── /static
|   ├── /css                   # Stores CSS files
|   |   └── style.css          # Main stylesheet
|   └── /js                    # Stores JavaScript files
|       └── fetch_itemCF_results.js   # Handles fetching Item-based CF results
|       └── display_user_info.js      # Displays user information in cards
|       └── display_business_info.js  # Displays business information in cards
├── app.py                     # Main Flask file (optional to review)
├── routes.py                  # Flask server routing
├── api.py                     # API functions for the Flask server
└── retrieve_info.py            # Retrieves information from the database
```
| Folder/File | Description |
| --- | --- |
| `/models` | Contains the code for different models, working as regular functions (similar to model testing) |
| `/templates` | Stores the frontend files (HTML), with each page usually having its own file (includes various JavaScript components) |
| `item_cf.html` | Page for Item CF, contains an input form for `user_id` and interacts with `fetch_itemCF_results.js` |
| `fetch_ItemCF_results.js` | Handles the Item CF page; calls the API (defined in `api.py`) and passes results to `display_user_info.js` and `display_business_info.js` to generate output cards |
| `routes.py` | Defines the routes (URLs) for the Flask server and calls appropriate API functions |
| `api.py` | Called via URLs; consolidates results by using functions from `/models` and `retrieve_info.py`, and returns the response to the frontend JavaScript handlers |
| `retrieve_info.py` | 	Handles data retrieval from the database |
