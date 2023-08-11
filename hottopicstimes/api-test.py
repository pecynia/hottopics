import random
import requests

# Define the API endpoint
url = 'http://localhost:3000/api/admin'

# Define the story data and headers
data = {
    'title': 'Live Test Title',
    'content': 'Sample Content',
    'slug': 'sample-slug' + str(random.randint(1, 1000)),
    'views': 0,
}

headers = {
    'x-api-key': 'hoi',  # This is the old API key
    'Content-Type': 'application/json',
}

# Make the POST request
response = requests.post(url, json=data, headers=headers)

# Print the response
print(response.json())
