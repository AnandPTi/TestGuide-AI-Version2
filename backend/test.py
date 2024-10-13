
# Markdown(">" + response.text)
import google.generativeai as genai
import PIL.Image
import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

# Configure the generative model
api_key = os.getenv("GENAI_API_KEY")
# Now use the api_key in your code
genai.configure(api_key=api_key)
# Configure API key and model
# genai.configure(api_key="AIzaSyDpfeedvdscwefewdwedecyCZi_A")
model = genai.GenerativeModel(model_name="gemini-1.5-pro")
prompt = """provide all the text that are present in image"""
# Open images using PIL
sample_file_2 = PIL.Image.open('../assets/image.png')
# sample_file_3 = PIL.Image.open('Screenshot from 2024-09-08 02-46-43.png')
# print(sample_file_2)
# Define the prompt
images=[]
images.append(sample_file_2)
# images.append(sample_file_3)
print(images)


# Generate content using the model
response = model.generate_content([prompt, sample_file_2])

# Print the result
print("Generated Instructions:")

print(response.text)



# import os
# import google.generativeai as genai

# # Configure the generative model
# api_key = os.getenv("LATEST_GENAI_API_KEY")
# # Now use the api_key in your code
# genai.configure(api_key=api_key)

# model = genai.get_model('imagen-3.0-generate-001') 

# result = model.predict(prompt='A realistic portrait of a cat wearing a hat')





# imagen = genai.ImageGenerationModel("imagen-3.0-generate-001")
# # Generate images with the model
# result = imagen.generate_images(
#     prompt="Fuzzy bunnies in my kitchen",
#     num_images=4,
#     safety_settings={"category": "BLOCK_ONLY_HIGH"},
#     aspect_ratios=["3:4"],
#     negative_prompt="Outside"
# )

# # Handle the result
# for i, image in enumerate(result['images']):
#     image_data = image['image']
    
#     # Save the images locally
#     with open(f"generated_image_{i}.png", "wb") as img_file:
#         img_file.write(image_data)

#     print(f"Image {i+1} saved as 'generated_image_{i}.png'.")

# # You can open the images using PIL if necessary
# from PIL import Image
# for i in range(4):
#     img = Image.open(f"generated_image_{i}.png")
#     img.show()



# import os
# import google.generativeai as genai

# # # Configure the generative model
# api_key = os.getenv("LATEST_GENAI_API_KEY")
# # Now use the api_key in your code
# genai.configure(api_key=api_key)

# imagen = genai.ImageGenerationModel("imagen-3.0-generate-001")

# result = imagen.generate_images(
#     prompt="Fuzzy bunnies in my kitchen",
#     number_of_images=4,
#     safety_filter_level="block_only_high",
#     person_generation="allow_adult",
#     aspect_ratio="3:4",
#     negative_prompt="Outside",
# )

# for image in result.images:
#   print(image)

# # The output should look similar to this:
# # <vertexai.preview.vision_models.GeneratedImage object at 0x78f3396ef370>
# # <vertexai.preview.vision_models.GeneratedImage object at 0x78f3396ef700>
# # <vertexai.preview.vision_models.GeneratedImage object at 0x78f33953c2b0>
# # <vertexai.preview.vision_models.GeneratedImage object at 0x78f33953c280>

# for image in result.images:
#   # Open and display the image using your local operating system.
#   image._pil_image.show()









# import google.generativeai as genai
# # import os

# # genai.configure(api_key="AIzacdcdfvevevwfdwscdcfvnKaNyCZi_A")
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

