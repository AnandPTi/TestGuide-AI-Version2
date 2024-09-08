from fastapi import FastAPI, File, UploadFile, Form
import google.generativeai as genai
import PIL.Image as Image  # Import PIL.Image explicitly
import os
from pathlib import Path
import io
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi.responses import JSONResponse


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
genai.configure(api_key="AIzaSyDpp8BBEMOveL5ul3pI0liujnKaNyCZi_A")
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

    # Define the prompt for content generation
    # prompt = """Generate a detailed, step-by-step guide on how to test each functionality based on the provided screenshots. For each test case, include the following details:

    # 1. **Description**: What is this test case about?
    # 2. **Pre-conditions**: What needs to be set up or ensured before starting the test?
    # 3. **Testing Steps**: Provide clear, step-by-step instructions on how to perform the test.
    # 4. **Expected Result**: What should happen if the feature works correctly?

    # The screenshots provided are as follows:
    # """
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

# Command to run the server
# Run with: uvicorn main:app --reload

#from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List
# # from PIL import Image
# import PIL.Image
# import io
# import os
# import google.generativeai as genai

# # Initialize FastAPI app
# app = FastAPI()

# # CORS settings
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust as per your needs
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize Google Generative AI client
# genai.configure(api_key="AIzaSyDpp8BBEMOveL5ul3pI0liujnKaNyCZi_A")
# model = genai.GenerativeModel("gemini-1.5-pro")

# # Helper function to save a PIL image as a temporary file
# def save_image_to_file(image: PIL.Image.Image, file_path: str):
#     image.save(file_path, format='PNG')

# # Helper function to upload a file using the Gemini File API
# async def upload_file_to_genai(file_path: str):
#     try:
#         # Upload the file using the Gemini File API
#         uploaded_file = genai.upload_file(file_path)
#         return uploaded_file.name  # Return the file URI
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# @app.post("/api/generate")
# async def generate_instructions(
#     screenshots: List[UploadFile] = File(...),
#     context: str = Form("")
# ):
#     try:
#         if not screenshots:
#             raise HTTPException(status_code=400, detail="No screenshots uploaded")
        
#         # Prepare the prompt
#         prompt = f"{context}\n\n" if context else ""
#         prompt += """Generate a detailed, step-by-step guide on how to test each functionality based on the provided screenshots. For each test case, include the following details:

#         1. **Description**: What is this test case about?
#         2. **Pre-conditions**: What needs to be set up or ensured before starting the test?
#         3. **Testing Steps**: Provide clear, step-by-step instructions on how to perform the test.
#         4. **Expected Result**: What should happen if the feature works correctly?

#         The screenshots provided are as follows:
#         """

#         # Save uploaded files temporarily and upload them to the Gemini File API
#         upload_dir = "uploads/"
#         if not os.path.exists(upload_dir):
#             os.makedirs(upload_dir)

#         image_uris = []
#         for screenshot in screenshots:
#             file_path = os.path.join(upload_dir, screenshot.filename)
#             # Read the file into a PIL Image
#             image = PIL.Image.open(io.BytesIO(await screenshot.read()))
            
#             # Save the image to a file
#             save_image_to_file(image, file_path)
            
#             # Upload the image and get the file URI
#             file_uri = await upload_file_to_genai(file_path)
#             image_uris.append(file_uri)

#             # Remove the locally stored file after upload
#             #os.remove(file_path)

#         # Prepare the content for Generative API
#         content_parts = [prompt] + image_uris
        
#         # Generate content using the Gemini API
#         result = model.generate_content(content_parts)

#         if result and hasattr(result, 'text'):
#             description = result.text
#             return {"instructions": description}
#         else:
#             raise HTTPException(status_code=500, detail="Failed to generate valid instructions")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating instructions: {str(e)}")

# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List
# from PIL import Image
# import io
# import os  # Import os for file operations
# import google.generativeai as genai

# # Initialize FastAPI app
# app = FastAPI()

# # CORS settings
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust as per your needs
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize Google Generative AI client
# genai.configure(api_key="AIzaSyDpp8BBEMOveL5ul3pI0liujnKaNyCZi_A")
# model = genai.GenerativeModel("gemini-1.5-pro")

# # Helper function to upload a file using the Gemini File API
# async def upload_file_to_genai(image: Image.Image):
#     try:
#         # Save image to a temporary file
#         temp_file_path = "temp_image.png"
#         image.save(temp_file_path)
        
#         # Upload the image using the Gemini File API
#         uploaded_file = genai.upload_file(temp_file_path)
#         os.remove(temp_file_path)
        
#         return uploaded_file.name  # Return the file URI
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# @app.post("/api/generate")
# async def generate_instructions(
#     screenshots: List[UploadFile] = File(...),
#     context: str = Form("")
# ):
#     try:
#         if not screenshots:
#             raise HTTPException(status_code=400, detail="No screenshots uploaded")
        
#         # Prepare the prompt
#         prompt = f"{context}\n\n" if context else ""
#         prompt += """Generate a detailed, step-by-step guide on how to test each functionality based on the provided screenshots. For each test case, include the following details:

#         1. **Description**: What is this test case about?
#         2. **Pre-conditions**: What needs to be set up or ensured before starting the test?
#         3. **Testing Steps**: Provide clear, step-by-step instructions on how to perform the test.
#         4. **Expected Result**: What should happen if the feature works correctly?

#         The screenshots provided are as follows:
#         """

#         # Save uploaded files temporarily and upload them to the Gemini File API
#         image_uris = []
#         for screenshot in screenshots:
#             # Read the file into a PIL Image
#             image = Image.open(io.BytesIO(await screenshot.read()))
            
#             # Upload the image and get the file URI
#             file_uri = await upload_file_to_genai(image)
#             image_uris.append(file_uri)

#         # Prepare the content for Generative API
#         content_parts = [prompt] + image_uris
        
#         # Generate content using the Gemini API
#         result = model.generate_content(content_parts)

#         if result and hasattr(result, 'text'):
#             description = result.text
#             return {"instructions": description}
#         else:
#             raise HTTPException(status_code=500, detail="Failed to generate valid instructions")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating instructions: {str(e)}")

# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List
# import aiofiles
# import os
# import google.generativeai as genai

# # Initialize FastAPI app
# app = FastAPI()

# # CORS settings
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust as per your needs
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize Google Generative AI client
# genai.configure(api_key="AIzaSyDpp8BBEMOveL5ul3pI0liujnKaNyCZi_A")
# model = genai.GenerativeModel("gemini-1.5-flash")

# # Helper function to upload a file using the Gemini File API
# async def upload_file_to_genai(file_path: str):
#     try:
#         # Upload the file using the Gemini File API
#         uploaded_file = genai.upload_file(file_path)
#         return uploaded_file.name  # Return the file URI
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")
# @app.post("/api/generate")
# async def generate_instructions(
#     screenshots: List[UploadFile] = File(...),
#     context: str = Form("")
# ):
#     try:
#         if not screenshots:
#             raise HTTPException(status_code=400, detail="No screenshots uploaded")
        
#         # Prepare the prompt with context
#         prompt = f"{context}\n\n" if context else ""
#         prompt += """Analyze the following screenshots and generate a detailed, step-by-step guide on how to test the functionalities represented in them. For each screenshot, include the following details:

#         1. **Description**: What is this test case about?
#         2. **Pre-conditions**: What needs to be set up or ensured before starting the test?
#         3. **Testing Steps**: Provide clear, step-by-step instructions on how to perform the test.
#         4. **Expected Result**: What should happen if the feature works correctly?

#         Screenshots are provided below:
#         """

#         # Save uploaded files temporarily and upload them to the Gemini File API
#         upload_dir = "uploads/"
#         if not os.path.exists(upload_dir):
#             os.makedirs(upload_dir)

#         image_uris = []
#         file_paths = []

#         for screenshot in screenshots:
#             file_path = os.path.join(upload_dir, screenshot.filename)
#             file_paths.append(file_path)
            
#             # Save the file locally using aiofiles
#             async with aiofiles.open(file_path, 'wb') as out_file:
#                 content = await screenshot.read()
#                 await out_file.write(content)
#                 print(f"Saved file: {file_path}")

#             # Verify the file is saved and exists
#             if not os.path.exists(file_path):
#                 raise HTTPException(status_code=500, detail=f"File {file_path} could not be saved.")

#             # Upload the image to Gemini and get the file URI
#             file_uri = await upload_file_to_genai(file_path)
#             image_uris.append(file_uri)

#         # Add the image URIs to the prompt
#         prompt += "\n".join([f"Image URI: {uri}" for uri in image_uris])

#         # Prepare the content for Generative API
#         content_parts = [prompt] + image_uris
        
#         # Generate content using the Gemini API
#         result = model.generate_content(content_parts)

#         if result and hasattr(result, 'text'):
#             description = result.text
#         else:
#             raise HTTPException(status_code=500, detail="Failed to generate valid instructions")

#         # Optionally remove the uploaded files after processing
#         for path in file_paths:
#             os.remove(path)
#             print(f"Removed file: {path}")

#         return {"instructions": description}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating instructions: {str(e)}")


# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List
# import aiofiles
# import os
# import base64
# import google.generativeai as genai

# # Initialize FastAPI app
# app = FastAPI()

# # CORS settings
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust as per your needs
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize Google Generative AI client
# genai.configure(api_key="AIzaSyDpp8BBEMOveL5ul3pI0liujnKaNyCZi_A")
# model = genai.GenerativeModel("gemini-1.5-flash")

# # Helper function to convert file to generative AI part
# async def file_to_generative_part(file_path: str, mime_type: str):
#     async with aiofiles.open(file_path, 'rb') as f:
#         data = await f.read()
#     return {
#         "inlineData": {
#             "data": base64.b64encode(data).decode("utf-8"),
#             "mimeType": mime_type,
#         }
#     }

# @app.post("/api/generate")
# async def generate_instructions(
#     screenshots: List[UploadFile] = File(...),
#     context: str = Form("")
# ):
#     try:
#         if not screenshots:
#             raise HTTPException(status_code=400, detail="No screenshots uploaded")
        
#         # Prepare the prompt
#         prompt = f"{context}\n\n" if context else ""
#         prompt += """Generate a detailed, step-by-step guide on how to test each functionality based on the provided screenshots. For each test case, include the following details:

#         1. **Description**: What is this test case about?
#         2. **Pre-conditions**: What needs to be set up or ensured before starting the test?
#         3. **Testing Steps**: Provide clear, step-by-step instructions on how to perform the test.
#         4. **Expected Result**: What should happen if the feature works correctly?

#         The screenshots provided are as follows:
#         """

#         # Save uploaded files temporarily
#         upload_dir = "uploads/"
#         if not os.path.exists(upload_dir):
#             os.makedirs(upload_dir)

#         image_parts = []
#         for screenshot in screenshots:
#             file_path = f"{upload_dir}/{screenshot.filename}"
#             async with aiofiles.open(file_path, 'wb') as out_file:
#                 content = await screenshot.read()
#                 await out_file.write(content)
#             image_part = await file_to_generative_part(file_path, screenshot.content_type)
#             image_parts.append(image_part)

#         # Prepare the content for Generative API
#         # Combine prompt and image parts as needed
#         # If your API expects the prompt and images in specific format, make sure to adjust accordingly
        
#         # Generate content using the Gemini API
#         result = model.generate_content(prompt)

#         # Clean up uploaded files
#         for screenshot in screenshots:
#             os.remove(f"{upload_dir}/{screenshot.filename}")

#         if result and hasattr(result, 'text'):
#             description = result.text
#             return {"instructions": description}
#         else:
#             raise HTTPException(status_code=500, detail="Failed to generate valid instructions")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating instructions: {str(e)}")
