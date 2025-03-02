from datetime import datetime
from . import db 

class UploadedFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(150), nullable=False)
    filepath = db.Column(db.String(200), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
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