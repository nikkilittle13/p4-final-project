from sqlalchemy_serializer import SerializerMixin

from config import db

class Stylist(db.Model, SerializerMixin):
  __tablename__ = 'stylists'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String)
 
  appointments = db.relationship('Appointment', back_populates='stylist', cascade='all, delete-orphan')

  serialize_rules = ('-appointments.stylist',)

  def __repr__(self):
    return f'<Stylist {self.id}> {self.name}'


class Client(db.Model, SerializerMixin):
  __tablename__ = 'clients'

  id = db.Column(db.Integer, primary_key=True)
  first_name = db.Column(db.String)
  last_name = db.Column(db.String)
  phone_number = db.Column(db.String)
  email = db.Column(db.String)
 
  appointments = db.relationship('Appointment', back_populates='client', cascade='all, delete-orphan')

  serialize_rules = ('-appointments.client',)

  def __repr__(self):
    return f'<Client {self.id}> {self.first_name}, {self.last_name}, {self.phone_number}, {self.email}'
  
class AppointmentService(db.Model, SerializerMixin):
  __tablename__ = 'appointment_service'

  id = db.Column(db.Integer, primary_key=True)
  notes = db.Column(db.String)

  appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))
  service_id = db.Column(db.Integer, db.ForeignKey('services.id'))

  appointment = db.relationship('Appointment', back_populates='appointment_services')
  service = db.relationship('Service', back_populates='appointment_services')

  serialize_rules = ('-appointment.appointment_services', '-service.appointment_services')

  def __repr__(self):
    return f'<AppointmentService {self.id}> {self.appointment_id}, {self.service_id}, {self.notes}'

class Appointment(db.Model, SerializerMixin):
  __tablename__ = 'appointments'

  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.String)
  time = db.Column(db.Integer)
  stylist_id = db.Column(db.Integer, db.ForeignKey('stylists.id'))
  client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))

  appointment_services = db.relationship('AppointmentService', back_populates='appointment', cascade='all, delete-orphan')
 
  stylist = db.relationship('Stylist', back_populates='appointments')
  client = db.relationship('Client', back_populates='appointments')

  serialize_rules = ('-stylist.appointments', '-client.appointments')

  def __repr__(self):
    return f'<Appointment {self.id}> {self.date}, {self.time}'


class Service(db.Model, SerializerMixin):
  __tablename__ = 'services'

  id = db.Column(db.Integer, primary_key=True)
  type = db.Column(db.String)
  price = db.Column(db.Float)


  appointment_services = db.relationship('AppointmentService', back_populates='service', cascade='all, delete-orphan')

  def __repr__(self):
    return f'<Service {self.id}> {self.type}, {self.price}'