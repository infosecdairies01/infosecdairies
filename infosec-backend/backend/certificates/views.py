from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import logging
import os
import uuid
import base64
from django.conf import settings
from django.utils.html import escape

from accounts.email_templates import _send_html_email, get_certificate_template


logger = logging.getLogger(__name__)

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

        # Ensure an absolute URL (LinkedIn must be able to fetch og:image)
        if not (public_url.startswith("http://") or public_url.startswith("https://")):
            if not public_url.startswith("/"):
                public_url = f"/{public_url}"
            public_url = f"{request.scheme}://{request.get_host()}{public_url}"

        try:
            if user_email and "@" in user_email:
                subject = "Your certificate is ready"
                text_body, html_body = get_certificate_template(
                    download_url=public_url,
                    course_name=course_slug.replace('-', ' ').title()
                )
                from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@infosecdairies.io")
                _send_html_email(subject, text_body, html_body, user_email, from_email=from_email, context="certificate")
        except Exception:
            logger.exception("Failed to send certificate email")

        return JsonResponse({
            'success': True,
            'url': public_url,
            'path': path
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def certificate_share(request):
    img = request.GET.get("img") or ""
    course = request.GET.get("course") or "Course"
    name = request.GET.get("name") or "Student"
    date = request.GET.get("date") or ""

    title = f"{escape(name)} completed {escape(course)}"
    description = f"Certificate of completion for {escape(course)} at Infosec Dairies."
    if date:
        description = f"Certificate of completion for {escape(course)} at Infosec Dairies ({escape(date)})."

    if not (img.startswith("http://") or img.startswith("https://")):
        img = ""

    page_url = request.build_absolute_uri()

    html = f"""<!doctype html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>{title}</title>
    <meta property=\"og:site_name\" content=\"Infosec Dairies\" />
    <meta property=\"og:title\" content=\"{title}\" />
    <meta property=\"og:description\" content=\"{description}\" />
    <meta property=\"og:type\" content=\"website\" />
    <meta property=\"og:url\" content=\"{escape(page_url)}\" />
    {f'<meta property=\"og:image\" content=\"{escape(img)}\" />' if img else ''}
    <meta name=\"twitter:card\" content=\"summary_large_image\" />
    <meta name=\"twitter:title\" content=\"{title}\" />
    <meta name=\"twitter:description\" content=\"{description}\" />
    {f'<meta name=\"twitter:image\" content=\"{escape(img)}\" />' if img else ''}
    <meta http-equiv=\"refresh\" content=\"0; url=https://www.infosecdairies.io/\" />
  </head>
  <body></body>
</html>"""

    return HttpResponse(html, content_type="text/html")
