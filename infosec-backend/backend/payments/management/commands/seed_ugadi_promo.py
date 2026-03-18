from django.core.management.base import BaseCommand
from payments.models import PromoCode
from courses.models import Course


class Command(BaseCommand):
    help = "Seed UGADI2026 promo code with 50% discount for all courses"

    def handle(self, *args, **kwargs):
        promo_code = "UGADI2026"
        discount_percent = 50
        max_uses = 100  # Limit to 100 users

        # Get all published courses
        courses = Course.objects.filter(is_published=True)
        
        if not courses.exists():
            self.stdout.write(self.style.WARNING("No published courses found. Creating promo codes for static course slugs..."))
            # Fallback to static slugs if no courses in DB
            static_slugs = [
                "blue-team-soc-fundamentals",
                "detection-engineering-basics",
                "incident-response-fundamentals",
                "log-analysis-for-beginners",
                "malware-analysis-fundamentals",
                "network-fundamentals",
                "network-security-monitoring",
                "siem-fundamentals",
                "soc-analyst-path",
                "threat-hunting-fundamentals",
            ]
            for slug in static_slugs:
                promo, created = PromoCode.objects.get_or_create(
                    code=promo_code,
                    course_slug=slug,
                    defaults={
                        "discount_percent": discount_percent,
                        "max_uses": max_uses,
                        "is_active": True,
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created {promo_code} for {slug} with {discount_percent}% off"))
                else:
                    # Update existing
                    promo.discount_percent = discount_percent
                    promo.is_active = True
                    promo.save()
                    self.stdout.write(self.style.WARNING(f"Updated {promo_code} for {slug}"))
        else:
            for course in courses:
                promo, created = PromoCode.objects.get_or_create(
                    code=promo_code,
                    course_slug=course.slug,
                    defaults={
                        "discount_percent": discount_percent,
                        "max_uses": max_uses,
                        "is_active": True,
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created {promo_code} for {course.slug} with {discount_percent}% off"))
                else:
                    promo.discount_percent = discount_percent
                    promo.is_active = True
                    promo.save()
                    self.stdout.write(self.style.WARNING(f"Updated {promo_code} for {course.slug}"))

        self.stdout.write(self.style.SUCCESS(f"\nUGADI2026 promo code seeded successfully! ({discount_percent}% off, max {max_uses} uses per course)"))
