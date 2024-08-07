#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import random

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Client, Stylist, Appointment, Service, appointment_service

fake = Faker()

def create_clients():
    clients = []
    for _ in range(20):
        c = Client(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            phone_number=fake.phone_number(),
            email=fake.email(),
            stylist_id=randint(1, 5)
        )
        clients.append(c)
    return clients

def create_stylists():
    stylists = []
    for _ in range(5):
        s = Stylist(
            name=fake.first_name(),
        )
        stylists.append(s)
    return stylists

def create_services():
    services = []
    s1 = Service(
        type='Root Touchup',
        price=100.00
    )
    services.append(s1)
    s2 = Service(
        type='Highlights',
        price=250.00
    )
    services.append(s2)
    s3 = Service(
        type='Full Color',
        price=150.00
    )
    services.append(s3)
    s4 = Service(
        type='Haircut',
        price=60.00
    )
    services.append(s4)
    s5 = Service(
        type='Blowout',
        price=50.00
    )
    services.append(s5)
    return services

def create_appointments():
    appointments = []
    for _ in range(50):
        a = Appointment(
            date=fake.date_this_year(),
            time=randint(8,17),
            stylist_id=rc([stylist.id for stylist in stylists]),
            client_id=rc([client.id for client in clients])
        )
        appointments.append(a)
    return appointments

def create_appointment_services(appointments, services):
    for appointment in appointments:
        # Randomly decide how many services to associate with each appointment
        num_services = randint(1, 3)  # Each appointment gets 1 to 3 services
        
        # Randomly choose services
        chosen_services = random.sample(services, min(num_services, len(services)))  # Choose up to `num_services` unique services
        
        for service in chosen_services:
            # Add each (appointment, service) pair to the association table
            db.session.execute(
                appointment_service.insert().values(
                    appointment_id=appointment.id,
                    service_id=service.id,
                    quantity=randint(1, 3)  # Random quantity
                )
            )
    db.session.commit()


if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        print("Clearing database...")
        Client.query.delete()
        Stylist.query.delete()
        Service.query.delete()
        Appointment.query.delete()

        print("Creating stylists...")
        stylists = create_stylists()
        db.session.add_all(stylists)
        db.session.commit()

        print("Creating clients...")
        clients = create_clients()
        db.session.add_all(clients)
        db.session.commit()

        print("Creating services...")
        services = create_services()
        db.session.add_all(services)
        db.session.commit()

        print("Creating appointments...")
        appointments = create_appointments()
        db.session.add_all(appointments)
        db.session.commit()

        print("Creating appointment services...")
        create_appointment_services(appointments, services)
        db.session.commit()


        print("Seeding complete.")
        

