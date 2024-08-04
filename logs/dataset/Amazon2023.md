[Back to Log Page](../README.md) | [Back to Main Page](../../README.md)   

# 30/7/2024: Amazon Reviews 23 (updated on 31/7/2024)
Amazon Reviews 23 is a dataset that contains reviews of Amazon products from May 1996 to Sep 2023 which is collected by McAuley Lab. This dataset has 24 catagories (e.g. Amazon_Fashion, Software, etc.) and with a total of 571.51M reviews, 54.51M users and 48.19 items.

## [Amazon Reviews 23](https://amazon-reviews-2023.github.io/)
It contains two main files: ***User Reviews*** and ***Item Metadata***.

### User Reviews
| Field | Type | Explanation |
| --- | --- | --- |
| rating | float | Rating of the product (from 1.0 to 5.0). |
| title | str | Title of the user review. |
| text | str | Text body of the user review. |
| images | list | Images that users post after they have received the product. Each image has different sizes (small, medium, large), represented by the small_image_url, medium_image_url, and large_image_url respectively. |
| asin | str | ID of the product. |
| parent_asin | str | Parent ID of the product. Note: Products with different colors, styles, sizes usually belong to the same parent ID. The "asin" in previous Amazon datasets is actually parent ID. Please use parent ID to find product meta. |
| user_id | str | ID of the reviewer |
| timestamp | int | Time of the review (unix time) |
| verified_purchase | bool | User purchase verification |
| helpful_vote | int | Helpful votes of the review |

### Item Metadata
| Field | Type | Explanation |
| --- | --- | --- |
| main_category | str | Main category (i.e., domain) of the product. |
| title | str | Name of the product. |
| average_rating | float | Rating of the product shown on the product page. |
| rating_number | int | Number of ratings in the product. |
| features | list | Bullet-point format features of the product. |
| description | list | Description of the product. |
| price | float | Price in US dollars (at time of crawling). |
| images | list | Images of the product. Each image has different sizes (thumb, large, hi_res). The "variant" field shows the position of image. |
| videos | list | Videos of the product including title and url. |
| store | str | Store name of the product. |
| categories | list | Hierarchical categories of the product. |
| details | dict | Product details, including materials, brand, sizes, etc. |
| parent_asin | str | Parent ID of the product. |
| bought_together | list | Recommended bundles from the websites. |


