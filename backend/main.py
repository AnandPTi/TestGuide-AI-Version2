from fastapi import FastAPI, File, UploadFile, Form
import google.generativeai as genai
import PIL.Image as Image  # Import PIL.Image explicitly
import os
from pathlib import Path
import io
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or set it to your frontend URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Configure the generative model
api_key = os.getenv("GENAI_API_KEY")
# Now use the api_key in your code
genai.configure(api_key=api_key)

model = genai.GenerativeModel(model_name="gemini-1.5-pro")

# Folder to save uploaded images
UPLOAD_FOLDER = "uploaded_images"
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)


@app.post("/upload_images/")
async def upload_images(files: list[UploadFile] = File(...), context: str = Form("")):
    saved_image_paths = []
    images = []

    # Save each uploaded image and add its path to a list
    for idx, file in enumerate(files):
        # Generate unique filename if original name isn't used
        file_extension = file.filename.split(".")[-1]
        save_name = f"image{idx + 1}.{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, save_name)

        # Save the file locally
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Store the image path for deletion later
        saved_image_paths.append(file_path)

        # Open image with PIL.Image for processing
        image = Image.open(file_path)
        images.append(image)

    prompt = """Provide a comprehensive, detailed guide for testing each functionality based on the provided screenshots. Each test case should include the following elements:

    -Description: A clear and concise explanation of the purpose of the test.
    -Pre-conditions: Outline the necessary setup or prerequisites required before conducting the test (2-4 lines that clearly explain the environment, configurations, or data that need to be in place).
    -Testing Steps: Step-by-step instructions detailing how to execute the test. Ensure that the instructions are exhaustive, covering all possible conditions as would be expected in a real production environment.
    -Expected Result: Describe the expected outcome if the functionality operates as intended, highlighting the criteria for success.
    For multiple functionalities, break them down into individual sections, with each functionality clearly defined and the associated test cases outlined using the format above.

    """

    if context:
            prompt += f"\n\nAdditional context: {context}"

    # Pass prompt and image data to the generative model (adjust depending on API capabilities)
    response = model.generate_content([prompt]+ images)

    # After generating the response, delete the images
    for file_path in saved_image_paths:
        if os.path.exists(file_path):
            os.remove(file_path)

    return {
        "Generated Instructions": response.text,
        "Deleted Files": saved_image_paths
    }
