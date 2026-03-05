from django.urls import path

from .views import create_order, verify_payment, my_purchases


urlpatterns = [
    path("create-order/", create_order, name="payments-create-order"),
    path("verify/", verify_payment, name="payments-verify"),
    path("my-purchases/", my_purchases, name="payments-my-purchases"),
]
