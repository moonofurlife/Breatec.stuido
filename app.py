from flask import Flask, render_template, send_from_directory, jsonify
import os
import json
import logging
from flask import Flask


# Создаем экземпляр приложения Flask
application = Flask(__name__, static_folder='public', template_folder='views')

# Включаем логирование
logging.basicConfig(level=logging.ERROR)

# Загрузка данных о проектах из JSON файла
def load_projects():
    file_path = os.path.join(application.static_folder, 'data', 'projectData.json')
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# Главная страница
@application.route('/')
def main():
    return render_template('index.html')

# Страница "Studio"
@application.route('/studio')
def studio():
    return render_template('studio.html')


@application.route('/studio/Aleksandr')
def studio_employee():
    return render_template('employee.html')


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

    if project_data is None:
        abort(404)  # Возвращаем 404 ошибку, если проект не найден

    return render_template('projects.html', project=project_data)

# Обработка статических файлов (CSS, JS, изображения)
@application.route('/public/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

if __name__ == "__main__":
   application.run(host='0.0.0.0')