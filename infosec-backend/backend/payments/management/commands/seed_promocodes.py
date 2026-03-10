from django.core.management.base import BaseCommand
from payments.models import PromoCode


class Command(BaseCommand):
    help = "Seed initial promo codes with usage limits"

    def handle(self, *args, **options):
        # Define promo codes with their limits
        promo_codes = [
            # (code, course_slug, max_uses, is_active)
            ("HEHE100", "blue-team-soc-fundamentals", 10, True),
            ("PBRVITS", "blue-team-soc-fundamentals", 10, True),
            ("FIX100", "blue-team-soc-fundamentals", 10, True),
            ("FIRST100", "blue-team-soc-fundamentals", 15, True),
        ]

        created_count = 0
        updated_count = 0

        for code, course_slug, max_uses, is_active in promo_codes:
            obj, created = PromoCode.objects.update_or_create(
                code=code,
                defaults={
                    "course_slug": course_slug,
                    "max_uses": max_uses,
                    "is_active": is_active,
                }
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created promo code: {code} (max: {max_uses})"))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f"Updated promo code: {code} (max: {max_uses})"))

        self.stdout.write(self.style.SUCCESS(
            f"\nDone! Created {created_count}, Updated {updated_count} promo codes."
        ))
