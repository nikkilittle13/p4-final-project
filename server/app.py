from flask import Flask, request, make_response, jsonify
from flask_restful import Resource

from config import app, db, api

from models import Client, Stylist, Appointment, Service, AppointmentService

class Clients(Resource):
    def get(self):    
        response_dict_list = [c.to_dict() for c in Client.query.all()]

        return make_response(response_dict_list, 200)
    
    def post(self):
        data = request.get_json()
        new_record = Client(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone_number=data['phone_number']
        )
        db.session.add(new_record)
        db.session.commit()

        return make_response(new_record.to_dict(), 201)
    
api.add_resource(Clients, '/clients')

class Stylists(Resource):
    def get(self):
        response_dict_list = [s.to_dict() for s in Stylist.query.all()]

        return make_response(response_dict_list, 200)
    
    def post(self):
        data = request.get_json()
        new_record = Stylist(
            name=data['name']
        )
        db.session.add(new_record)
        db.session.commit()

        return make_response(new_record.to_dict(), 201)

api.add_resource(Stylists, '/stylists')

class Appointments(Resource):
    def get(self):
        response_dict_list = [a.to_dict() for a in Appointment.query.all()]

        return make_response(response_dict_list, 200)
    
    def post(self):
        data = request.get_json()
        
        new_record = Appointment(
            date=data['date'],
            time=data['time'],
            stylist_id=data['stylist_id'],
            client_id=data['client_id']
        )
        
        db.session.add(new_record)
        
        if 'notes' in data:
            new_record.notes = data['notes']
        
        db.session.commit()
        
        if 'services' in data:
            for service_data in data['services']:
                appointment_service = AppointmentService(
                    appointment_id=new_record.id,
                    service_id=service_data['service_id'],
                    notes=service_data.get('notes')
                )
                db.session.add(appointment_service)
        
        db.session.commit()
        
        return make_response(new_record.to_dict(), 201)


api.add_resource(Appointments, '/appointments')
        
class AppointmentByID(Resource):
    def get(self, id):
        response_dict = Appointment.query.filter_by(id=id).first().to_dict()

        return make_response(response_dict, 200)
    
    def patch(self, id):
        appointment = Appointment.query.get(id)
    
        if not appointment:
            return jsonify({'message': 'Appointment not found'}), 404
    
        data = request.get_json()

        if 'notes' in data:
            appointment.notes = data['notes']
    
        if 'services' in data:
            AppointmentService.query.filter_by(appointment_id=id).delete()
        
        for service_data in data['services']:
            service = AppointmentService(
                appointment_id=id,
                service_id=service_data['service_id'],
                notes=service_data.get('notes')
            )
            db.session.add(service)
        
        for key, value in data.items():
            if hasattr(appointment, key):
                setattr(appointment, key, value)
        
        db.session.commit()
        return make_response(appointment.to_dict(), 200)

                
    def delete(self, id):
        record = Appointment.query.filter(Appointment.id==id).first()

        db.session.delete(record)
        db.session.commit()

        return make_response({"message": "record sucessfully deleted"}, 200)
    
    def post(self, id):
        existing_appointment = Appointment.query.get(id)
        if existing_appointment:
            return make_response({'message': 'Appointment already exists'}, 409)

        data = request.get_json()

        new_record = Appointment(
            id=id,
            date=data['date'],
            time=data['time'],
            stylist_id=data['stylist_id'],
            client_id=data['client_id']
        )
        db.session.add(new_record)
        db.session.commit()

        services = data.get('services', [])
        for service_data in services:
            appointment_service = AppointmentService(
                appointment_id=id,
                service_id=service_data['service_id'],
                notes=service_data.get('notes')
            )
            db.session.add(appointment_service)

        notes = data.get('notes')
        if notes:
            new_record.notes = notes

        db.session.commit()

        return make_response(new_record.to_dict(), 201)
        
api.add_resource(AppointmentByID, '/appointments/<int:id>')
                
class Services(Resource):
    def get(self):
        response_dict_list = [s.to_dict() for s in Service.query.all()]

        return make_response(response_dict_list, 200)
    
    def post(self):
        data = request.get_json()

        new_record = Service(
            type=data['type'],
            price=data['price'],
            )

        db.session.add(new_record)
        db.session.commit()

        return make_response(new_record.to_dict(), 201)

api.add_resource(Services, '/services') 

#get all appointments service price > 100
#loop through service and return appointments

@app.route('/services_by_price')
def services_by_price():
    services = Service.query.filter(Service.price >= 100).all()
    new_appointments = []
    for s in services:
        for appt in s.appointments:
            print(appt)
            new_appointments.append(appt.to_dict())

    return new_appointments

if __name__ == '__main__':
    app.run(port=5555, debug=True)