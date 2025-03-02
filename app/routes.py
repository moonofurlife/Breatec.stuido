from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import json
from . import db
from app.models import Project, UploadedFile
from app.config import Config

bp = Blueprint('main', __name__)
def load_projects():
    with open('public/data/projectData.json', 'r', encoding='utf-8') as file:
        return json.load(file)
@bp.route('/')
def index():
    # Главное представление
    # projects = Project.query.all()
    return render_template('index.html')

@bp.route('/admin')
def admin_dashboard():
    # Админская панель
    projects = Project.query.all()
    return render_template('admin_dashboard.html', projects=projects)

# Страница "Studio"
@bp.route('/studio')
def studio():
    return render_template('studio.html')


# Страница "Contacts"
@bp.route('/contacts')
def contacts():
    return render_template('contacts.html')

# Страница "Gallery"
@bp.route('/gallery')  # Исправлено опечатка: 'galery' -> 'gallery'
def gallery():
    return render_template('galery.html')

# Динамическая страница проекта
@bp.route('/gallery/<slug>')
def project(slug):
    projects = load_projects()['projects']
    
    # Ищем проект по его слагу
    project_data = next((project for project in projects if project['slug'] == slug), None)

    # if project_data is None:
    #     abort(404)  # Возвращаем 404 ошибку, если проект не найден

    return render_template('projects.html', project=project_data)

# Обработка статических файлов (CSS, JS, изображения)
@bp.route('/public/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

@bp.route('/admin/add_project', methods=['GET', 'POST'])
def add_project():
    if not os.path.exists(Config.UPLOAD_FOLDER):
        os.makedirs(Config.UPLOAD_FOLDER)

    if request.method == 'POST':
        project_name = request.form['name']
        project_slug = request.form['slug']
        project_location_en = request.form['location_en']
        project_area_en = float(request.form['area_en'])
        project_process_en = request.form.get('process_en', '') 
        project_client_en = request.form['client_en']
        project_description_en = request.form['description_en']
        project_location_ru = request.form['location_ru']
        project_process_ru = request.form.get('process_ru', '')
        project_client_ru = request.form['client_ru']
        project_description_ru = request.form['description_ru']

        new_project = Project(
            name=project_name,
            slug=project_slug,
            location_en=project_location_en,
            area_en=project_area_en,
            process_en=project_process_en,
            client_en=project_client_en,
            description_en=project_description_en,
            location_ru=project_location_ru,
            process_ru=project_process_ru,
            client_ru=project_client_ru,
            description_ru=project_description_ru
        )

        # Обработка загрузки изображений
        existing_images = []
        if 'images' in request.files:
            images = request.files.getlist('images')
            project_folder = os.path.join(Config.UPLOAD_FOLDER, project_slug)
            os.makedirs(project_folder, exist_ok=True)

            for image in images:
                if image and Config.allowed_file(image.filename):
                    filename = secure_filename(image.filename)
                    image_path = os.path.join(project_folder, filename)
                    image.save(image_path)
                    existing_images.append(filename)

        # Сохраняем список загруженных изображений в БД
        if existing_images:
            new_project.images = ','.join(existing_images)

        db.session.add(new_project)
        db.session.commit()
        flash('Проект успешно добавлен!', 'success')
        return redirect(url_for('main.admin_dashboard'))

    return render_template('add_project.html')


@bp.route('/admin/edit_project/<int:project_id>', methods=['GET', 'POST'])
def edit_project(project_id):
    project = Project.query.get_or_404(project_id)

    if request.method == 'POST':
        project.name = request.form['name']
        project.slug = request.form['slug']
        project.location_en = request.form['location_en']
        project.area_en = request.form['area_en']
        project.process_en = request.form['process_en']
        project.client_en = request.form['client_en']
        project.description_en = request.form['description_en']
        project.location_ru = request.form['location_ru']
        project.area_ru = request.form['area_ru']
        project.process_ru = request.form['process_ru']
        project.client_ru = request.form['client_ru']
        project.description_ru = request.form['description_ru']
        
        project_folder = os.path.join(Config.UPLOAD_FOLDER, project.name)

        # Обработка новых изображений
        if 'new_images' in request.files:
            new_images = request.files.getlist('new_images')
            existing_images = project.images.split(',') if project.images else []
            
            # Сохранение новых изображений
            for image in new_images:
                if image and Config.allowed_file(image.filename):
                    filename = secure_filename(image.filename)
                    # Сохраните изображение в папку проекта
                    image_path = os.path.join(project_folder, filename)
                    os.makedirs(project_folder, exist_ok=True)  # Создаем папку проекта, если ее нет
                    image.save(image_path)
                    existing_images.append(filename)  # Сохраняем только имя файла
                    
            project.images = ','.join(existing_images)

        # Удаление изображений, если переданы имена файлов
        if 'delete_images' in request.form:
            images_to_delete = request.form.getlist('delete_images')
            existing_images = project.images.split(',') if project.images else []
            
            # Удаляем изображения как из базы данных, так и из файловой системы
            for img in images_to_delete:
                if img in existing_images:
                    existing_images.remove(img)
                    # Удаляем изображение из файловой системы
                    os.remove(os.path.join(project_folder, img))
                    
            project.images = ','.join(existing_images)

        db.session.commit()
        flash('Проект успешно изменен!')
        return redirect(url_for('main.admin_dashboard'))

    # Передаем список изображений в шаблон
    existing_images = project.images.split(',') if project.images else []
    return render_template('edit_project.html', project=project, existing_images=existing_images)

@bp.route('/admin/delete_project/<int:project_id>', methods=['POST'])
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    os.remove(project.images)  # Удалите какие-либо изображения, если это необходимо
    db.session.delete(project)
    db.session.commit()
    flash('Проект успешно удален!')
    return redirect(url_for('main.admin_dashboard'))

@bp.route('/admin/delete_image/<int:project_id>/<int:image_index>', methods=['GET'])
def delete_image(project_id, image_index):
    project = Project.query.get(project_id)
    if project:
        images = project.images.split(',')
        if image_index < len(images):
            os.remove(images[image_index].strip())  # Удалить файл с диска
            del images[image_index]  # Удалить путь из списка
            project.images = ','.join(images)
            db.session.commit()
            flash('Изображение успешно удалено!')
    return redirect(url_for('main.edit_project', project_id=project_id))

# Пример API для получения проекта по ID
@bp.route('/api/project/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify({
        'id': project.id,
        'name': project.name,
        'slug': project.slug,
        'location': project.location,
        'area': project.area,
        'process': project.process,
        'client': project.client,
        'description': project.description,
        'images': project.images.split(',') if project.images else []
    })

# Добавление файла
@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('Нет файла для загрузки')
        return redirect(url_for('main.admin_dashboard'))
    
    file = request.files['file']
    
    if file.filename == '':
        flash('Нет выбранного файла')
        return redirect(url_for('main.admin_dashboard'))
    
    if file and Config.allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Добавление в базу данных
        new_file = UploadedFile(filename=filename, filepath=file_path)
        db.session.add(new_file)
        db.session.commit()

        flash('Файл успешно загружен!')
        return redirect(url_for('main.admin_dashboard'))

    return redirect(url_for('main.admin_dashboard'))