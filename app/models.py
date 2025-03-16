from datetime import datetime
from flask_login import UserMixin
from . import db 

class UploadedFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(150), nullable=False)
    filepath = db.Column(db.String(200), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class User(UserMixin):
    def __init__(self, id):
        self.id = id

class Project(db.Model):
    __tablename__ = 'project'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    name_ru = db.Column(db.String(100), nullable=True)
    slug = db.Column(db.String(100), nullable=False)
    location_en = db.Column(db.String(200), nullable=True)
    location_ru = db.Column(db.String(200), nullable=True)
    area_en = db.Column(db.Float, nullable=True)
    process_en = db.Column(db.String(200), nullable=True)
    process_ru = db.Column(db.String(200), nullable=True)
    client_en = db.Column(db.String(100), nullable=True)
    client_ru = db.Column(db.String(100), nullable=True)
    description_en = db.Column(db.Text, nullable=True)
    description_ru = db.Column(db.Text, nullable=True)
    images = db.Column(db.String(200), nullable=True)

    def __repr__(self):
        return f'<Project {self.name}>' # Строка для хранения путей к изображениям (можно разделить через запятую)
    
class Person(db.Model):
    __tablename__ = 'people'

    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column(db.Integer, nullable=True)
    name = db.Column(db.String, nullable=False)
    name_ru = db.Column(db.String, nullable=False)
    occupation = db.Column(db.String, nullable=False)
    occupation_ru = db.Column(db.String, nullable=False)
    is_main = db.Column(db.Boolean, nullable=True)
    image = db.Column(db.String, nullable=True)  # Изображение может быть необязательным

    # Отношение "один ко многим" к образованию и опыту работы
    education = db.relationship('Education', back_populates='person', lazy='dynamic', cascade='all, delete-orphan')
    work_experience = db.relationship('WorkExperience', back_populates='person', lazy='dynamic', cascade='all, delete-orphan')


class Education(db.Model):
    __tablename__ = 'education'

    id = db.Column(db.Integer, primary_key=True)
    edu_id = db.Column(db.Integer, nullable=True)
    years = db.Column(db.String, nullable=False)
    university = db.Column(db.String, nullable=False)
    university_ru = db.Column(db.String, nullable=False)

    person_id = db.Column(db.Integer, db.ForeignKey('people.id'))
    person = db.relationship('Person', back_populates='education')


class WorkExperience(db.Model):
    __tablename__ = 'work_experience'

    id = db.Column(db.Integer, primary_key=True)
    work_id = db.Column(db.Integer, nullable=True)
    years = db.Column(db.String, nullable=False)
    place = db.Column(db.String, nullable=False)
    place_ru = db.Column(db.String, nullable=False)
    position = db.Column(db.String, nullable=False)
    position_ru = db.Column(db.String, nullable=False)

    person_id = db.Column(db.Integer, db.ForeignKey('people.id'))
    person = db.relationship('Person', back_populates='work_experience')