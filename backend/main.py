from fastapi import FastAPI, Depends, HTTPException, status, Form, File, UploadFile, BackgroundTasks
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import List
import google.generativeai as genai
import PIL.Image as Image
import shutil
from fastapi.middleware.cors import CORSMiddleware
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pytz import timezone
from datetime import datetime


# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing settings
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# OAuth2 password bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
emailpassword = os.getenv("EMAIL_PASSWORD")
# Initialize Generative AI
api_key = os.getenv("GENAI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name="gemini-1.5-pro")

# Folder to save uploaded images
UPLOAD_FOLDER = "uploaded_images"
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)

# Database Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)  # Ensure email is unique
    username = Column(String, unique=True, index=True)  # Add a unique username
    hashed_password = Column(String)

Base.metadata.create_all(bind=engine)

# Utility functions
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


# def authenticate_user(db: Session, email: str, password: str):
#     user = get_user_by_email(db, email)
#     if not user or not verify_password(password, user.hashed_password):
#         return False
#     return user
def get_user_by_username_or_email(db: Session, username_or_email: str):
    # Query the user by either username or email
    return db.query(User).filter((User.email == username_or_email) | (User.username == username_or_email)).first()

def authenticate_user(db: Session, username_or_email: str, password: str):
    user = get_user_by_username_or_email(db, username_or_email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user


#*******saved response*****************
# Add a new model for saved responses
class SavedResponses(Base):
    __tablename__ = "saved_response"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    heading = Column(String)  # Add heading field
    response_text = Column(String)
    timestamp = Column(String, default=str(datetime.now(timezone("Asia/Kolkata"))))

# class SavedResponse(Base):
#     __tablename__ = "saved_responses"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, index=True)
#     response_text = Column(String)
#     timestamp = Column(String, default=str(datetime.utcnow()))


Base.metadata.create_all(bind=engine)

# Route to save a response
@app.post("/save-response/")
async def save_response(response_text: str = Form(...), heading: str = Form(...), token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Validate the user by token
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    # Save the response with the heading
    saved_response = SavedResponses(user_id=user.id, heading=heading, response_text=response_text)
    db.add(saved_response)
    db.commit()
    db.refresh(saved_response)

    return {"message": "Response saved successfully", "saved_response_id": saved_response.id}


# @app.post("/save-response/")
# async def save_response(response_text: str = Form(...), token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     # Validate the user by token
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise credentials_exception
#     except jwt.PyJWTError:
#         raise credentials_exception

#     user = get_user_by_email(db, email=email)
#     if user is None:
#         raise credentials_exception

#     # Save the response to the database
#     saved_response = SavedResponse(user_id=user.id, response_text=response_text)
#     db.add(saved_response)
#     db.commit()
#     db.refresh(saved_response)

#     return {"message": "Response saved successfully", "saved_response_id": saved_response.id}

# Route to get all saved responses for a user
@app.get("/saved-responses/")
async def get_saved_responses(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Validate the user by token
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    # Fetch saved responses for the user
    saved_response = db.query(SavedResponses).filter(SavedResponses.user_id == user.id).all()

    # Return the responses including heading and timestamp
    return {
        "saved_responses": [
            {
                "id": sr.id,
                "heading": sr.heading,
                "response_text": sr.response_text,
                "timestamp": sr.timestamp
            } for sr in saved_response
        ]
    }

from fastapi import HTTPException

# Route to delete a saved response
@app.delete("/saved-responses/{response_id}")
async def delete_saved_response(response_id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Validate the user by token (same as before)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception

    # Find the response to delete
    saved_response = db.query(SavedResponses).filter(SavedResponses.id == response_id, SavedResponses.user_id == user.id).first()

    if saved_response is None:
        raise HTTPException(status_code=404, detail="Response not found")

    # Delete the response
    db.delete(saved_response)
    db.commit()

    return {"message": "Response deleted successfully"}

# @app.get("/saved-responses/")
# async def get_saved_responses(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     # Validate the user by token
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise credentials_exception
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token has expired")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")
#     user = get_user_by_email(db, email=email)
#     if user is None:
#         raise credentials_exception

#     # Fetch saved responses for the user
#     saved_response = db.query(SavedResponses).filter(SavedResponses.user_id == user.id).all()

#     return {"saved_responses": [{"id": sr.id, "response_text": sr.response_text, "timestamp": sr.timestamp} for sr in saved_response]}




# Email sending function
def send_email(name: str, contact: str, note: str):
    sender_email = "ananpr@iitbhilai.ac.in"  # Replace with your email
    receiver_email = "shunilkumar952515@gmail.com"  # Replace with the receiver email
    password = emailpassword  # Replace with your email password

    message = MIMEMultipart("alternative")
    message["Subject"] = "Subscription Request"
    message["From"] = sender_email
    message["To"] = receiver_email

    text = f"Name: {name}\nContact: {contact}\nNote: {note}"

    part = MIMEText(text, "plain")
    message.attach(part)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

# Route to handle email sending
@app.post("/send-email/")
async def send_subscription_email(
    name: str = Form(...),
    contact: str = Form(...),
    note: str = Form(...),
    background_tasks: BackgroundTasks = None
):
    # Call the send_email function in the background to avoid blocking the request
    background_tasks.add_task(send_email, name, contact, note)
    return {"message": "Subscription email is being sent"}



# Routes for user signup and login
@app.post("/signup")
async def signup(email: str = Form(...), username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user2 = get_user_by_username(db, username)
    if user2:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(password)
    new_user = User(email=email, username=username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User registered successfully"}



@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "username": user.username}

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return {"email": user.email}

# Image upload and prompt generation (Protected)
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


# from fastapi import FastAPI, Depends, HTTPException, status, Form, File, UploadFile
# from sqlalchemy import Column, Integer, String, create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker, Session
# from passlib.context import CryptContext
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from datetime import datetime, timedelta
# import jwt
# import os
# from dotenv import load_dotenv
# from pathlib import Path
# from typing import List
# import google.generativeai as genai
# import PIL.Image as Image
# import io
# import shutil
# from fastapi.middleware.cors import CORSMiddleware


# # Load environment variables
# load_dotenv()

# SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# # Password hashing settings
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # Database setup
# SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
# engine = create_engine(SQLALCHEMY_DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# # OAuth2 password bearer
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# # Initialize FastAPI app
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Your frontend origin
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize Generative AI
# api_key = os.getenv("GENAI_API_KEY")
# genai.configure(api_key=api_key)
# model = genai.GenerativeModel(model_name="gemini-1.5-pro")

# # Folder to save uploaded images
# UPLOAD_FOLDER = "uploaded_images"
# Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)

# # Database Models
# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)

# Base.metadata.create_all(bind=engine)

# # Utility functions
# def get_password_hash(password):
#     return pwd_context.hash(password)

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def create_access_token(data: dict, expires_delta: timedelta = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# # Dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# def get_user_by_email(db: Session, email: str):
#     return db.query(User).filter(User.email == email).first()

# def authenticate_user(db: Session, email: str, password: str):
#     user = get_user_by_email(db, email)
#     if not user or not verify_password(password, user.hashed_password):
#         return False
#     return user

# # Routes for user signup and login
# @app.post("/signup")
# async def signup(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
#     user = get_user_by_email(db, email)
#     if user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     hashed_password = get_password_hash(password)
#     new_user = User(email=email, hashed_password=hashed_password)
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return {"msg": "User registered successfully"}

# @app.post("/token")
# async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = authenticate_user(db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user.email}, expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}

# @app.get("/users/me")
# async def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise credentials_exception
#     except jwt.PyJWTError:
#         raise credentials_exception
#     user = get_user_by_email(db, email=email)
#     if user is None:
#         raise credentials_exception
#     return {"email": user.email}

# # Image upload and prompt generation (Protected)
# @app.post("/upload_images/")
# async def upload_images(files: List[UploadFile] = File(...), context: str = Form(""), token: str = Depends(oauth2_scheme)):
#     print("Received token:", token)  # Debug logging

#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email = payload.get("sub")
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token expired")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")
    
#     saved_image_paths = []
#     images = []

#     # Save each uploaded image and add its path to a list
#     for idx, file in enumerate(files):
#         file_extension = file.filename.split(".")[-1]
#         save_name = f"image{idx + 1}.{file_extension}"
#         file_path = os.path.join(UPLOAD_FOLDER, save_name)

#         # Save the file locally
#         with open(file_path, "wb") as f:
#             shutil.copyfileobj(file.file, f)
#         saved_image_paths.append(file_path)

#         # Open image with PIL.Image for processing
#         image = Image.open(file_path)
#         images.append(image)

#     # Generate the test case prompt based on the images and context
#     prompt = """Provide a comprehensive, detailed guide for testing each functionality based on the provided screenshots. Each test case should include the following elements:

#     -Description: A clear and concise explanation of the purpose of the test.
#     -Pre-conditions: Outline the necessary setup or prerequisites required before conducting the test.
#     -Testing Steps: Step-by-step instructions detailing how to execute the test.
#     -Expected Result: Describe the expected outcome if the functionality operates as intended.
#     """
#     if context:
#         prompt += f"\n\nAdditional context: {context}"

#     # Generate the response using the generative model (this API call may vary depending on the model)
#     response = model.generate_content([prompt] + images)

#     # After generating the response, delete the saved images
#     for file_path in saved_image_paths:
#         if os.path.exists(file_path):
#             os.remove(file_path)

#     return {"Generated Instructions": response.text}

# from fastapi import FastAPI, File, UploadFile, Form
# import google.generativeai as genai
# import PIL.Image as Image  # Import PIL.Image explicitly
# import os
# from pathlib import Path
# import io
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List
# from fastapi.responses import JSONResponse
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()


# # Initialize FastAPI app
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Or set it to your frontend URL if needed
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# # Configure the generative model
# api_key = os.getenv("GENAI_API_KEY")
# # Now use the api_key in your code
# genai.configure(api_key=api_key)

# model = genai.GenerativeModel(model_name="gemini-1.5-pro")

# # Folder to save uploaded images
# UPLOAD_FOLDER = "uploaded_images"
# Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)


# @app.post("/upload_images/")
# async def upload_images(files: list[UploadFile] = File(...), context: str = Form("")):
#     saved_image_paths = []
#     images = []

#     # Save each uploaded image and add its path to a list
#     for idx, file in enumerate(files):
#         # Generate unique filename if original name isn't used
#         file_extension = file.filename.split(".")[-1]
#         save_name = f"image{idx + 1}.{file_extension}"
#         file_path = os.path.join(UPLOAD_FOLDER, save_name)

#         # Save the file locally
#         with open(file_path, "wb") as f:
#             f.write(await file.read())

#         # Store the image path for deletion later
#         saved_image_paths.append(file_path)

#         # Open image with PIL.Image for processing
#         image = Image.open(file_path)
#         images.append(image)

#     prompt = """Provide a comprehensive, detailed guide for testing each functionality based on the provided screenshots. Each test case should include the following elements:

#     -Description: A clear and concise explanation of the purpose of the test.
#     -Pre-conditions: Outline the necessary setup or prerequisites required before conducting the test (2-4 lines that clearly explain the environment, configurations, or data that need to be in place).
#     -Testing Steps: Step-by-step instructions detailing how to execute the test. Ensure that the instructions are exhaustive, covering all possible conditions as would be expected in a real production environment.
#     -Expected Result: Describe the expected outcome if the functionality operates as intended, highlighting the criteria for success.
#     For multiple functionalities, break them down into individual sections, with each functionality clearly defined and the associated test cases outlined using the format above.

#     """

#     if context:
#             prompt += f"\n\nAdditional context: {context}"

#     # Pass prompt and image data to the generative model (adjust depending on API capabilities)
#     response = model.generate_content([prompt]+ images)

#     # After generating the response, delete the images
#     for file_path in saved_image_paths:
#         if os.path.exists(file_path):
#             os.remove(file_path)

#     return {
#         "Generated Instructions": response.text,
#         "Deleted Files": saved_image_paths
#     }
