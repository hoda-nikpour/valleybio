from django.urls import path
from .views import PaperQAAPIView

urlpatterns = [
    path('query/', PaperQAAPIView.as_view(), name='query'),
]
