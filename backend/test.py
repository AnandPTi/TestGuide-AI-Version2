# import google.generativeai as genai
# # import os

# # genai.configure(api_key="AIzaSyDpp8BBEMOveL5ul3pI0liujnKaNyCZi_A")
# # model = genai.GenerativeModel("gemini-1.5-flash")
# # response = model.generate_content("Write a story about a magic backpack.")
# # print(response.text)
# import PIL.Image

# sample_file_2 = PIL.Image.open('Screenshot from 2024-09-08 02-47-29.png')
# sample_file_3 = PIL.Image.open('Screenshot from 2024-09-08 02-46-43.png')
# genai.configure(api_key="AIzaSyDpp8BBEMOveL5ul3pI0liujnKaNyCZi_A")
# model = genai.GenerativeModel(model_name="gemini-1.5-pro")

# prompt =  """Generate a detailed, step-by-step guide on how to test each functionality based on the provided screenshots. For each test case, include the following details:

#         1. **Description**: What is this test case about?
#         2. **Pre-conditions**: What needs to be set up or ensured before starting the test?
#         3. **Testing Steps**: Provide clear, step-by-step instructions on how to perform the test.
#         4. **Expected Result**: What should happen if the feature works correctly?

#         The screenshots provided are as follows:
#         """
# response = model.generate_content([prompt, sample_file_2, sample_file_3])

# Markdown(">" + response.text)
import google.generativeai as genai
import PIL.Image

# Configure API key and model
genai.configure(api_key="AIzaSyDpp8BBEMOveL5ul3pI0liujnKaNyCZi_A")
model = genai.GenerativeModel(model_name="gemini-1.5-pro")

# Open images using PIL
sample_file_2 = PIL.Image.open('Screenshot from 2024-09-08 02-47-29.png')
sample_file_3 = PIL.Image.open('Screenshot from 2024-09-08 02-46-43.png')
# print(sample_file_2)
# Define the prompt
images=[]
images.append(sample_file_2)
images.append(sample_file_3)
print(images)
prompt = """Generate a detailed, step-by-step guide on how to test each functionality based on the provided screenshots. For each test case, include the following details:

1. **Description**: What is this test case about?
2. **Pre-conditions**: What needs to be set up or ensured before starting the test?
3. **Testing Steps**: Provide clear, step-by-step instructions on how to perform the test.
4. **Expected Result**: What should happen if the feature works correctly?

The screenshots provided are as follows:
"""

# Generate content using the model
response = model.generate_content([prompt, sample_file_2, sample_file_3])

# Print the result
print("Generated Instructions:")
print(response.text)
