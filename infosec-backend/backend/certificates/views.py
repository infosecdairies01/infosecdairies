from django.conf import settings
from django.http import JsonResponse
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import uuid
import base64
from django.conf import settings

@csrf_exempt
@require_http_methods(["POST"])
def upload_certificate(request):
    import json
    try:
        # Parse JSON body
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST
        
        image_data = data.get('image')
        course_slug = data.get('course_slug', 'certificate')
        user_email = data.get('user_email', 'user')
        
        if not image_data:
            return JsonResponse({'error': 'No image data provided'}, status=400)
        
        # Remove data URL prefix if present
        if 'base64,' in image_data:
            image_data = image_data.split('base64,')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        
        # Generate unique filename
        filename = f"certificates/{course_slug}_{user_email.replace('@', '_').replace('.', '_')}_{uuid.uuid4().hex[:8]}.png"
        
        # Save to storage
        path = default_storage.save(filename, ContentFile(image_bytes))
        
        # Get public URL
        public_url = default_storage.url(path)
        
        # If using local storage, construct full URL
        if public_url.startswith('/'):
            public_url = f"{request.scheme}://{request.get_host()}{public_url}"

        try:
            if user_email and "@" in user_email:
                subject = "Your certificate is ready"
                body = (
                    "Congratulations! You have completed the course.\n\n"
                    f"Certificate download link: {public_url}\n\n"
                    "Thanks,\n"
                    "InfosecDairies"
                )
                from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "infosecdairies@gmail.com")
                send_mail(subject, body, from_email, [user_email], fail_silently=True)
        except Exception:
            pass

        return JsonResponse({
            'success': True,
            'url': public_url,
            'path': path
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
