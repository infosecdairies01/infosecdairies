from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_certificate, name='upload_certificate'),
    path('share/', views.certificate_share, name='certificate_share'),
]
