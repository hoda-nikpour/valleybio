from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import os

try:
    from paperqa import Docs
    print("Successfully imported paperqa.")  
except ImportError as e:
    print(f"Error importing paperqa: {e}")  
    raise ImportError(f"Failed to import paperqa. Error: {e}")

from dotenv import load_dotenv
load_dotenv()
print("Environment variables loaded.")  


api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print("API Key successfully loaded!")  
else:
    print("API Key not found. Ensure .env file is configured properly.")  
    raise EnvironmentError("OPENAI_API_KEY not found in .env file")


class PaperQAAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]  

    def post(self, request, *args, **kwargs):
        print("POST request received!")  

        
        question = request.data.get('question')
        uploaded_file = request.FILES.get('pdf')  

        if not question:
            print("Question field is missing.")  
            return Response(
                {"error": "The 'question' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not uploaded_file:
            print("PDF file is missing.")  
            return Response(
                {"error": "The 'pdf' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        
        temp_file_path = f"/tmp/{uploaded_file.name}"
        try:
            with open(temp_file_path, "wb") as temp_file:
                for chunk in uploaded_file.chunks():
                    temp_file.write(chunk)
        
        except Exception as e:
            print(f"Error saving uploaded file: {e}")  
            return Response(
                {"error": f"An error occurred while saving the file: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
               
        docs = Docs()
        try:
            docs.add(temp_file_path)
            print("File added to Docs object.")  
        except Exception as e:
            print(f"Error adding file to Docs: {e}")  
            os.remove(temp_file_path) 
            return Response(
                {"error": f"An error occurred while adding the PDF: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
       
        try:
            response = docs.query(question)
            print(f"Query successful: {response}")  
        except Exception as e:
            print(f"Error during query: {e}")  
            os.remove(temp_file_path)  
            return Response(
                {"error": f"An error occurred during querying: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

       
        os.remove(temp_file_path)
        print(f"Temporary file removed: {temp_file_path}")  

       
        print("Returning response to client.")  
        return Response({"response": response}, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):
        print("GET request received. This endpoint only supports POST requests.")  
        return Response(
            {"message": "This endpoint only supports POST requests. Please send a POST request with a question."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )
