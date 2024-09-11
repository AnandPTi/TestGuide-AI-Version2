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

# prompt = """Provide a comprehensive, detailed guide for testing each functionality based on the provided screenshots. Each test case should include the following elements:

#     -Description: A clear and concise explanation of the purpose of the test.
#     -Pre-conditions: Outline the necessary setup or prerequisites required before conducting the test (2-4 lines that clearly explain the environment, configurations, or data that need to be in place).
#     -Testing Steps: Step-by-step instructions detailing how to execute the test. Ensure that the instructions are exhaustive, covering all possible conditions as would be expected in a real production environment.
#     -Expected Result: Describe the expected outcome if the functionality operates as intended, highlighting the criteria for success.
#     For multiple functionalities, break them down into individual sections, with each functionality clearly defined and the associated test cases outlined using the format above.

# """
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


# Generate content using the model
response = model.generate_content([prompt, sample_file_2, sample_file_3])

# Print the result
print("Generated Instructions:")
print(response.text)
