from random import randint, choice as rc, sample
import random

from faker import Faker

from app import app
from models import db, Client, Stylist, Appointment, Service, AppointmentService

fake = Faker()

def create_clients():
    clients = []
    for _ in range(15):
        c = Client(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            phone_number=random.randint(1000000000, 9999999999),
            email=fake.email(),
        )
        clients.append(c)
    return clients

def create_stylists():
    stylists = []
    for _ in range(8):
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
    s6 = Service(
        type='Beard Trim',
        price=20.00
    )
    services.append(s6)
    return services

def create_appointments():
    appointments = []
    for _ in range(15):
        appointment = Appointment(
            date=fake.date_this_year(),
            time=f"{randint(8, 17)}:00",
            stylist=rc(stylists),
            client=rc(clients)
        )
        appointment_services = sample(services, randint(1, 6))
        for service in appointment_services:
            appointment_service = AppointmentService(
                appointment=appointment,
                service=service,
                notes=fake.sentence()
            )
            db.session.add(appointment_service)

        appointments.append(appointment)
        db.session.add(appointment)

    db.session.commit()
    return appointments


if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        print("Clearing database...")
        Client.query.delete()
        Stylist.query.delete()
        Service.query.delete()
        Appointment.query.delete()
        AppointmentService.query.delete()

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

        print("Seeding complete.")