#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, make_response, jsonify
from sqlalchemy import select
from flask_restful import Resource

# Local imports
from config import app, db, api

from models import Client, Stylist, Appointment, Service, appointment_service


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/clients', methods=['GET', 'POST'])
def clients():
    if request.method == 'GET':
        result = []
        for client in Client.query.all():
            client_data = {
                'id': client.id,
                'first_name': client.first_name,
                'last_name': client.last_name,
                'phone_number': client.phone_number,
                'email': client.email,
                'appointments': [
                    {
                        'id': appointment.id,
                        'date': appointment.date,
                        'time': appointment.time,
                        'services': [
                            {
                                'id': service.id,
                                'type': service.type,
                                'price': service.price
                            } for service in appointment.services
                        ]
                    } for appointment in client.appointments
                ]
            }
            result.append(client_data)

        return make_response(jsonify(result), 200)
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            client = Client(
                first_name=data['first_name'],
                last_name=data['last_name'],
                phone_number=data['phone_number'],
                email=data['email'],
            )
            db.session.add(client)
            db.session.commit()
            return make_response(jsonify({"message": "Client created successfully"}), 201)
        
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 400)

@app.route('/stylists', methods=['GET', 'POST'])
def stylists():
    if request.method == 'GET':
        stylists = Stylist.query.all()
        result = []
        for stylist in stylists:
            stylist_data = {
                "id": stylist.id,
                "name": stylist.name,
                "appointments": [
                    {
                        "id": appointment.id,
                        "date": appointment.date,
                        "time": appointment.time,
                        "client": {
                            "id": appointment.client.id,
                            "first_name": appointment.client.first_name,
                            "last_name": appointment.client.last_name,
                            "phone_number": appointment.client.phone_number,
                            "email": appointment.client.email
                        }
                    }
                    for appointment in stylist.appointments
                ]
            }
            result.append(stylist_data)

        return make_response(jsonify(result), 200)
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            stylist = Stylist(
                name=data['name']
            )
            db.session.add(stylist)
            db.session.commit()
            return make_response(jsonify({"message": "Stylist created successfully"}), 201)
        
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 400)

@app.route('/appointments', methods=['GET', 'POST'])
def appointments():
    if request.method == 'GET':
        appointments = Appointment.query.all()
        result = []
        for appointment in appointments:
            appointment_data = {
                "id": appointment.id,
                "date": appointment.date,
                "time": appointment.time,
                "client": {
                    "id": appointment.client.id,
                    "first_name": appointment.client.first_name,
                    "last_name": appointment.client.last_name,
                    "phone_number": appointment.client.phone_number,
                    "email": appointment.client.email
                },
                "stylist": {
                    "id": appointment.stylist.id,
                    "name": appointment.stylist.name
                },
                "services": [
                    {
                        "id": service.id,
                        "type": service.type,
                        "price": service.price,
                    }
                    for service in appointment.services
                ]
            }
            result.append(appointment_data)

        return make_response(jsonify(result), 200)
    
    elif request.method == 'POST':
        data = request.get_json()
        try:
            date = data.get('date')
            time = data.get('time')
            stylist_id = data.get('stylist_id')
            client_id = data.get('client_id')
            services_data = data.get('services', [])

            new_appointment = Appointment(
                date=date,
                time=time,
                stylist_id=stylist_id,
                client_id=client_id
            )
            db.session.add(new_appointment)
            db.session.commit()
        
            for service_data in services_data:
                service_id = service_data.get('service_id')
                quantity = service_data.get('quantity', 1)
                service = Service.query.get(service_id)
                if service:
                    db.session.execute(
                        appointment_service.insert().values(
                            appointment_id=new_appointment.id,
                            service_id=service_id,
                            quantity=quantity
                        )
                    )
                else:
                    return make_response(jsonify({'error': f'Service ID {service_id} not found'}), 400)
        
            db.session.commit()
        
            return make_response(jsonify({
                'id': new_appointment.id,
                'date': new_appointment.date,
                'time': new_appointment.time,
                'stylist_id': new_appointment.stylist_id,
                'client_id': new_appointment.client_id,
                'services': [{
                    'id': service.id,
                    'type': service.type,
                    'price': service.price
                } for service in new_appointment.services]
            }), 201)
    
        except KeyError as e:
            db.session.rollback()
            return make_response(jsonify({'error': f'Missing required field: {str(e)}'}), 400)
    
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': str(e)}), 400)
        
@app.route('/appointments/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def appointment_by_id(id):
    appointment = Appointment.query.get_or_404(id)

    if request.method == 'GET':
        appointment_data = {
            'id': appointment.id,
            'date': appointment.date,
            'time': appointment.time,
            'client': {
                'id': appointment.client.id,
                'first_name': appointment.client.first_name,
                'last_name': appointment.client.last_name,
                'phone_number': appointment.client.phone_number,
                'email': appointment.client.email
            },
            'stylist': {
                'id': appointment.stylist.id,
                'name': appointment.stylist.name
            },
            'services': [
                {
                    'id': service.id,
                    'type': service.type,
                    'price': service.price
                }
                for service in appointment.services
            ]
        }
        return make_response(jsonify(appointment_data), 200)
        
    elif request.method == 'PATCH':
        data = request.get_json()
        try:
            for key, value in data.items():
                setattr(appointment, key, value)
            db.session.commit()
            return make_response(jsonify({'message': 'Appointment updated successfully'}), 200)
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 400)
            
    elif request.method == 'DELETE':
        db.session.delete(appointment)
        db.session.commit()
        return make_response(jsonify({'message': 'Appointment deleted successfully'}), 200)
            
@app.route('/services', methods=['GET', 'POST'])
def services():
    if request.method == 'GET':
        services = []
        for service in Service.query.all():
            service_dict = {
                'id': service.id,
                'type': service.type,
                'price': service.price,
            }
            services.append(service_dict)

        return make_response(jsonify(services), 200)
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            new_service = Service(
                type=data['type'],
                price=data['price']
            )
        
            db.session.add(new_service)
            db.session.commit()
        
            return make_response(jsonify({
                'id': new_service.id,
                'type': new_service.type,
                'price': new_service.price
            }), 201)
        
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 400)
        

@app.route('/appointment_service', methods=['GET', 'POST'])
def appointment_service():
    if request.method == 'GET':
        try:
            # Use SQLAlchemy ORM session query
            with db.session() as session:
                result = session.query(
                    appointment_service.c.appointment_id,
                    appointment_service.c.service_id,
                    appointment_service.c.notes
                ).all()
            
            # Convert result to JSON-compatible format
            response = [
                {
                    'appointment_id': row[0],
                    'service_id': row[1],
                    'notes': row[2]
                }
                for row in result
            ]
            
            return make_response(jsonify(response), 200)
        
        except Exception as e:
            return make_response(jsonify({'error': str(e)}), 500)
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            
            # Check that required data is present
            if not all(key in data for key in ['appointment_id', 'service_id']):
                return make_response(jsonify({'error': 'Missing required fields'}), 400)
            
            appointment_id = data['appointment_id']
            service_id = data['service_id']
            notes = data.get('notes', '')  # Default to empty string if notes are not provided
            
            # Use SQLAlchemy core expression to insert data
            stmt = appointment_service.insert().values(
                appointment_id=appointment_id,
                service_id=service_id,
                notes=notes
            )
            db.session.execute(stmt)
            db.session.commit()
            
            return make_response(jsonify({
                'appointment_id': appointment_id,
                'service_id': service_id,
                'notes': notes
            }), 201)
    
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({'error': str(e)}), 500)

if __name__ == '__main__':
    app.run(port=5555, debug=True)