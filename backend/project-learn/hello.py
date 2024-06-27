import pandas as pd
# Sample data
data = {
 'Name': ['Tejas', 'Sree', 'Gokul', 'Abhinash', 'Praneesh'],
 'Age': [25, 30, 22, 28, 35],
 'City': ['Bangalore', 'Tirupur', 'Salem', 'Pune', 'Coimbatore']}
# Create a pandas DataFrame
df = pd.DataFrame(data)
# Display the DataFrame
print("DataFrame:")
print(df)
# Save the DataFrame to a CSV file
csv_filename = "sample_data.csv"
df.to_csv(csv_filename, index=False)
print("\nCSV file saved as:", csv_filename)
# Load the CSV file into a pandas DataFrame
loaded_df = pd.read_csv(csv_filename)
# Display the loaded DataFrame
print("\nLoaded DataFrame from CSV:")
print(loaded_df)