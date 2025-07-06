
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama
from PIL import Image
import io
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your model
llm = Llama(
    model_path="./models/SmolVLM2-2.2B-Instruct-Q4_K_M.gguf",
    chat_format="chatml",
    n_ctx=2048,
    n_threads=6
)

# Request schema
class PredictRequest(BaseModel):
    image1: str  # base64 (no metadata prefix)
    image2: str
    query: str

def decode_image(base64_str: str) -> Image.Image:
    image_data = base64.b64decode(base64_str)
    return Image.open(io.BytesIO(image_data))

def encode_image(img: Image.Image) -> str:
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

@app.post("/predict")
async def predict(request: PredictRequest):
    img1 = decode_image(request.image1)
    img2 = decode_image(request.image2)

    img1_b64 = encode_image(img1)
    img2_b64 = encode_image(img2)

    result = llm.create_chat_completion(
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img1_b64}"}},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img2_b64}"}},
                    {"type": "text", "text": request.query}
                ]
            }
        ],
        temperature=0.2,
        max_tokens=512
    )

    return {"response": result["choices"][0]["message"]["content"]}
