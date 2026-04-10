from django.core.management.base import BaseCommand
from payments.models import PromoCode


class Command(BaseCommand):
    help = "Seed initial promo codes with usage limits"

    def handle(self, *args, **options):
        # Define promo codes with their limits
        promo_codes = [
            # (code, course_slug, max_uses, is_active, discount_percent)
            ("HEHE100", "blue-team-soc-fundamentals", 10, True, 100),
            ("PBRVITS", "blue-team-soc-fundamentals", 10, True, 100),
            ("FIX100", "blue-team-soc-fundamentals", 10, True, 100),
            ("FIRST100", "blue-team-soc-fundamentals", 15, True, 100),
            ("SOC04", "blue-team-soc-fundamentals", 7, True, 100),
        ]

        created_count = 0
        updated_count = 0

        for code, course_slug, max_uses, is_active, discount_percent in promo_codes:
            obj, created = PromoCode.objects.update_or_create(
                code=code,
                defaults={
                    "course_slug": course_slug,
                    "max_uses": max_uses,
                    "is_active": is_active,
                    "discount_percent": discount_percent,
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
