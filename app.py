from flask import Flask, render_template, send_from_directory, jsonify
import os
import json
import logging

app = Flask(__name__, static_folder='public', template_folder='views')

# Включаем логирование ошибок
logging.basicConfig(level=logging.ERROR)

# Путь к данным проектов
PROJECTS_DATA_PATH = 'public/data/projectData.json'

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
@app.route('/galery')
def galery():
    return render_template('galery.html')

# Динамическая страница проекта
    
@app.route('/galery/<project_slug>')
def project(project_slug):
    try:
        print(f"Загрузка проекта: {project_slug}")

        json_path = os.path.abspath(PROJECTS_DATA_PATH)
        print(f"Путь к JSON: {json_path}")

        with open(PROJECTS_DATA_PATH, 'r', encoding='utf-8') as file:
            data = json.load(file)

        print("JSON загружен:", data)  # Логируем данные

        projects = data.get('projects', [])
        project = next((proj for proj in projects if proj.get('slug') == project_slug or proj.get('id') == project_slug), None)

        if project:
            print("Проект найден:", project)
            return render_template('project.html', project=project)
        else:
            print("Проект не найден")
            return jsonify({"error": "Проект не найден"}), 404
    except Exception as e:
        logging.error(f"Ошибка загрузки данных проекта: {e}")
        return jsonify({"error": f"Ошибка загрузки проекта: {str(e)}"}), 500


# Обработка статических файлов (CSS, JS, изображения)
@app.route('/public/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(debug=True)
