from flask import Flask, render_template, send_from_directory, jsonify
import os
import json
import logging

# Создаем экземпляр приложения Flask
app = Flask(__name__, static_folder='public', template_folder='views')

# Включаем логирование
logging.basicConfig(level=logging.ERROR)

# Загрузка данных о проектах из JSON файла
def load_projects():
    with open('public/data/projectData.json', 'r', encoding='utf-8') as file:
        return json.load(file)

# Главная страница
@app.route('/')
def main():
    return render_template('main.html')

# Страница "Studio"
@app.route('/studio')
def studio():
    return render_template('studio.html')

# Страница "Contacts"
@app.route('/contacts')
def contacts():
    return render_template('contacts.html')

# Страница "Gallery"
@app.route('/gallery')  # Исправлено опечатка: 'galery' -> 'gallery'
def gallery():
    return render_template('galery.html')

# Динамическая страница проекта
@app.route('/gallery/<slug>')
def project(slug):
    projects = load_projects()['projects']
    
    # Ищем проект по его слагу
    project_data = next((project for project in projects if project['slug'] == slug), None)

    if project_data is None:
        abort(404)  # Возвращаем 404 ошибку, если проект не найден

    return render_template('projects.html', project=project_data)

# Обработка статических файлов (CSS, JS, изображения)
@app.route('/public/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

# Точка входа для приложения
if __name__ == '__main__':
    app.run(debug=True)