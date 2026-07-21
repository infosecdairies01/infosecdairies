from django.core.management.base import BaseCommand
from payments.models import CountryPricing
from payments.exchange_rates import COUNTRY_CURRENCY_MAP, FALLBACK_RATES, round_to_99

# USD is the anchor: every other currency's price is this, converted at its
# FALLBACK_RATES cross-rate to USD, then rounded to X.99 — not derived from
# the INR base price directly.
USD_ANCHOR_PRICES = {"easy": 9.99, "medium": 14.99, "hard": 19.99, "bundle": 49.99}


class Command(BaseCommand):
    help = (
        "Seed manual price overrides for each supported country, derived from "
        "USD_ANCHOR_PRICES converted via FALLBACK_RATES cross-rates, rounded to X.99."
    )

    def handle(self, *args, **options):
        usd_rate = FALLBACK_RATES["USD"]  # INR -> USD
        created_count = 0
        updated_count = 0

        for country_code, (currency_code, symbol) in COUNTRY_CURRENCY_MAP.items():
            if currency_code == "USD":
                prices = dict(USD_ANCHOR_PRICES)
            else:
                inr_rate = FALLBACK_RATES.get(currency_code)
                if not inr_rate:
                    self.stdout.write(self.style.WARNING(f"Skipping {country_code}: no fallback rate for {currency_code}"))
                    continue
                usd_to_currency = inr_rate / usd_rate
                prices = {
                    tier: round_to_99(usd_amount * usd_to_currency)
                    for tier, usd_amount in USD_ANCHOR_PRICES.items()
                }

            obj, created = CountryPricing.objects.update_or_create(
                country_code=country_code,
                defaults={
                    "currency_code": currency_code,
                    "currency_symbol": symbol,
                    "price_easy": prices["easy"],
                    "price_medium": prices["medium"],
                    "price_hard": prices["hard"],
                    "price_bundle": prices["bundle"],
                    "is_active": True,
                },
            )
            action = "Created" if created else "Updated"
            created_count += created
            updated_count += not created
            self.stdout.write(self.style.SUCCESS(
                f"{action}: {country_code} ({currency_code}) -> "
                f"easy={prices['easy']} medium={prices['medium']} hard={prices['hard']} bundle={prices['bundle']}"
            ))

        self.stdout.write(self.style.SUCCESS(
            f"\nDone! Created {created_count}, Updated {updated_count} country pricing rows."
        ))
