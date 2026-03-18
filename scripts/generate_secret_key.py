#!/usr/bin/env python
from django.core.management.utils import get_random_secret_key

def generate_secret_key():
    secret_key = get_random_secret_key()
    print(f"Your new DJANGO_SECRET_KEY:\n\n{secret_key}\n")
    print("Add this to your .env file as:")
    print(f"DJANGO_SECRET_KEY='{secret_key}'")

if __name__ == "__main__":
    generate_secret_key()

