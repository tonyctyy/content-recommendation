import pandas as pd

def sample_ids(file_lists, prefix_path, sample_fraction, chunk_size=10000):
    user_id = set()
    business_id = set()

    for file in file_lists:
        try:
            df_chunks = []
            total_records = 0

            for chunk in pd.read_json(prefix_path + file, lines=True, chunksize=chunk_size):
                df_chunks.append(chunk)
                total_records += chunk.shape[0]

            df = pd.concat(df_chunks, ignore_index=True)
            sampled_df = df.sample(frac=sample_fraction, random_state=42)
            print(f"Sampled {sampled_df.shape[0]}/{total_records} records from {file}.")

            if "user_id" in sampled_df.columns:
                user_id.update(sampled_df["user_id"].unique())
            if "business_id" in sampled_df.columns:
                business_id.update(sampled_df["business_id"].unique())

        except Exception as e:
            print(f"Error: {e}")
            continue
    return user_id, business_id

def sample_files(file_lists, prefix_path, user_ids, business_ids, keep_fraction=0.4, chunk_size=10000):
    df_dict = {}
    for file in file_lists:
        try:
            sampled_df = pd.DataFrame()
            df_chunks = []
            total_records = 0

            for chunk in pd.read_json(prefix_path + file, lines=True, chunksize=chunk_size):
                user_col = True if "user_id" in chunk.columns else False
                business_col = True if "business_id" in chunk.columns else False
                if user_col and business_col:
                    temp_chunk = chunk[chunk["user_id"].isin(user_ids) & chunk["business_id"].isin(business_ids)]
                elif user_col:
                    temp_chunk = chunk[chunk["user_id"].isin(user_ids)]
                elif business_col:
                    temp_chunk = chunk[chunk["business_id"].isin(business_ids)]
                df_chunks.append(temp_chunk)
                total_records += chunk.shape[0]

            df = pd.concat(df_chunks, ignore_index=True)
            if file != "yelp_academic_dataset_user.json" and file != "yelp_academic_dataset_business.json":
                sampled_df = df.sample(frac=keep_fraction, random_state=42)
            else:
                sampled_df = df
            print(f"Total records in {file} after sampling: {sampled_df.shape[0]}.")
            df_dict[file] = sampled_df

        except Exception as e:
            print(f"Error: {e}")
            continue
    return df_dict

def load_dataset(file_lists, prefix_path, chunk_size=10000):
    df_dict = {}
    prefix_path += "sampled_"
    for file in file_lists:
        try:
            df_chunks = []
            total_records = 0

            for chunk in pd.read_json(prefix_path + file, lines=True, chunksize=chunk_size):
                df_chunks.append(chunk)
                total_records += chunk.shape[0]

            df = pd.concat(df_chunks, ignore_index=True)
            df_dict[file] = df
            print(f"Total records in {file}: {df.shape[0]}.")

        except Exception as e:
            print(f"Error: {e}")
            continue
    return df_dict

if __name__ == "__main__":
    folder_path = '../data/'
    transit_bucket = 'raw_datasets/'
    target_bucket = 'yelp/'
    prefix_path = folder_path + transit_bucket + target_bucket

  # Clear terminal
    print("\033c")

    file_list = [
        "yelp_academic_dataset_business.json",
        "yelp_academic_dataset_review.json",
        "yelp_academic_dataset_tip.json",
        "yelp_academic_dataset_checkin.json",
        "yelp_academic_dataset_user.json",
    ]



    """
    The following code is used to sample the dataset (to reduce the data size) and save the sampled files to the disk.


    ----------------------------------------
    sample_fraction = 0.03
    user_id, business_id = sample_ids(file_list, prefix_path, sample_fraction)

    print(f"Total number of unique user_ids: {len(user_id)}")
    print(f"Total number of unique business_ids: {len(business_id)}")

    keep_fraction = 0.4
    df_dict = sample_files(file_list, prefix_path, user_id, business_id, keep_fraction)

    for key, df in df_dict.items():
        df.to_json(prefix_path + "sampled_" + key, orient='records', lines=True)
        print(f"Sampled file {key} saved successfully.")
    """

    df = load_dataset(file_list, prefix_path)

