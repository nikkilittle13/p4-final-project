from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

appointment_service = db.Table(
    'appointment_service',
    db.Column('appointment_id', db.Integer, db.ForeignKey('appointments.id'), primary_key=True),
    db.Column('service_id', db.Integer, db.ForeignKey('services.id'), primary_key=True),
    db.Column('notes', db.String)
)

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


class Appointment(db.Model, SerializerMixin):
  __tablename__ = 'appointments'

  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.String)
  time = db.Column(db.Integer)
  stylist_id = db.Column(db.Integer, db.ForeignKey('stylists.id'))
  client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))

  services = db.relationship('Service', secondary='appointment_service', back_populates='appointments')
 
  stylist = db.relationship('Stylist', back_populates='appointments')
  client = db.relationship('Client', back_populates='appointments')


  serialize_rules = ('-stylist.appointments', '-client.appointments', '-services.appointments')

  def __repr__(self):
    return f'<Appointment {self.id}> {self.date}, {self.time}'


class Service(db.Model, SerializerMixin):
  __tablename__ = 'services'

  id = db.Column(db.Integer, primary_key=True)
  type = db.Column(db.String)
  price = db.Column(db.Float)


  appointments = db.relationship('Appointment', secondary='appointment_service', back_populates='services')


  serialize_rules = ('-appointments.services',)

  def __repr__(self):
    return f'<Service {self.id}> {self.type}, {self.price}'