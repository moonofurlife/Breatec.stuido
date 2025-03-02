from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, url_for, session
import os
import json
import logging
from flask_sqlalchemy import SQLAlchemy
from flask import Flask


application = Flask(__name__, static_folder='public', template_folder='views')
application.secret_key = 'your_secret_key_here'  # Необходимо для использования сессий

# Настройка базы данных
application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'  # Используем SQLite
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(application)

# Включаем логирование
logging.basicConfig(level=logging.ERROR)
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=False)

# Создание таблиц в базе данных
with application.app_context():
    db.create_all()
# Загрузка данных о проектах из JSON файла
def load_projects():
    with open('public/data/projectData.json', 'r', encoding='utf-8') as file:
        return json.load(file)

# Главная страница
@application.route('/')
def main():
    return render_template('index.html')

# Страница "Studio"
@application.route('/studio')
def studio():
    return render_template('studio.html')


@application.route('/pr_g')
def progect_galery():
    return render_template('progect_galery.html')


# Страница "Contacts"
@application.route('/contacts')
def contacts():
    return render_template('contacts.html')

# Страница "Gallery"
@application.route('/gallery')  # Исправлено опечатка: 'galery' -> 'gallery'
def gallery():
    return render_template('galery.html')

# Динамическая страница проекта
@application.route('/gallery/<slug>')
def project(slug):
    projects = load_projects()['projects']
    
    # Ищем проект по его слагу
    project_data = next((project for project in projects if project['slug'] == slug), None)

    # if project_data is None:
    #     abort(404)  # Возвращаем 404 ошибку, если проект не найден

    return render_template('projects.html', project=project_data)

# Обработка статических файлов (CSS, JS, изображения)
@application.route('/public/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

@application.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == 'admin' and password == 'password':  # Замените на ваши логин/пароль
            session['logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return render_template('admin.html', error='Неверный логин или пароль')

    return render_template('admin.html')

@application.route('/admin/dashboard')
def admin_dashboard():
    if 'logged_in' in session:
        projects = Project.query.all() 
        return render_template('admin_dashboard.html')  # Шаблон для админской панели
    return redirect(url_for('admin'))


if __name__ == "__main__":
   application.run(host='0.0.0.0')