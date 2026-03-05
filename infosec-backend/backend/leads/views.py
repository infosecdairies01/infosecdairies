from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Lead
from .serializers import LeadSerializer


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def create_lead(request):
    """Create a new lead/enquiry from live course page"""
    serializer = LeadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"detail": "Thank you! Your enquiry has been submitted. We will contact you soon."},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_leads(request):
    """List all leads - admin only"""
    if not request.user.is_staff:
        return Response({"detail": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
    
    leads = Lead.objects.all()
    serializer = LeadSerializer(leads, many=True)
    return Response(serializer.data)
