from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import json
from . import db
from app.models import Project, UploadedFile, User, Person, Education, WorkExperience
from app.config import Config
from . import login_manager

bp = Blueprint('main', __name__)

ADMIN_USERNAME = "breatec"
ADMIN_PASSWORD = "breatec"

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)  

@bp.route('/admin', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Проверка логина и пароля
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            user = User(username)  # Создание пользователя
            login_user(user)
            session.permanent = True  # Сделать сессию постоянной
            return redirect(url_for('main.admin_dashboard'))
        
        flash("Неправильное имя пользователя или пароль", "error")  # Показать ошибку

    return render_template('admin.html')

@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@bp.route('/admin/dashboard', methods=['GET'])
@login_required
def admin_dashboard():
    projects = Project.query.all()
    people = Person.query.all() 
    return render_template('admin_dashboard.html', projects=projects, people=people)

@bp.route('/admin/add_project', methods=['GET', 'POST'])
def add_project():
    if not os.path.exists(Config.UPLOAD_FOLDER):
        os.makedirs(Config.UPLOAD_FOLDER)

    if request.method == 'POST':
        project_name = request.form['name']
        project_id = request.form['id']
        project_name_ru = request.form.get('name_ru', None)  # используем get для безопасного доступа
        project_slug = request.form['slug']
        project_location_en = request.form['location_en']
        project_area_en = float(request.form['area_en']) if request.form['area_en'] else 0.0  # проверьте, что это число
        project_process_en = request.form.get('process_en', '') 
        project_client_en = request.form['client_en']
        project_description_en = request.form['description_en']
        project_location_ru = request.form.get('location_ru', '')
        project_process_ru = request.form.get('process_ru', '')
        project_client_ru = request.form.get('client_ru', '')
        project_description_ru = request.form['description_ru']

        new_project = Project(
            name=project_name,
            project_id=project_id,  # проверьте, что project_id присутствует в модели
            name_ru=project_name_ru,
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

        # Добавляем проект в базу данных
        db.session.add(new_project)
        db.session.commit()
        flash('Проект успешно добавлен!', 'success')
        return redirect(url_for('main.admin_dashboard'))

    return render_template('add_project.html')


@bp.route('/admin/edit_project/<int:project_id>', methods=['GET', 'POST'])
def edit_project(project_id):
    project = Project.query.get_or_404(project_id)
    project_folder = os.path.join(Config.UPLOAD_FOLDER, project.slug)

    if request.method == 'POST':
        project.name = request.form['name']
        project.project_id = request.form['id']  # убедитесь, что это поле существует
        project.name_ru = request.form.get('name_ru', None)
        project.slug = request.form['slug']
        project.location_en = request.form['location_en']
        project.area_en = float(request.form['area_en']) if request.form['area_en'] else 0.0
        project.process_en = request.form.get('process_en', '')
        project.client_en = request.form['client_en']
        project.description_en = request.form['description_en']
        project.location_ru = request.form.get('location_ru', None)
        project.process_ru = request.form.get('process_ru', '')
        project.client_ru = request.form.get('client_ru', None)
        project.description_ru = request.form['description_ru']

        # Обработка новых изображений
        if 'new_images' in request.files:
            new_images = request.files.getlist('new_images')
            existing_images = project.images.split(',') if project.images else []
            
            for image in new_images:
                if image and Config.allowed_file(image.filename):
                    filename = secure_filename(image.filename)
                    image_path = os.path.join(project_folder, filename)
                    os.makedirs(project_folder, exist_ok=True)  # Создаем папку проекта, если ее нет
                    image.save(image_path)
                    existing_images.append(filename)

            project.images = ','.join(existing_images)

        # Удаление изображений
        if 'delete_images' in request.form:
            images_to_delete = request.form.getlist('delete_images')
            existing_images = project.images.split(',') if project.images else []

            for img in images_to_delete:
                if img in existing_images:
                    existing_images.remove(img)
                    # Удаляем изображение из файловой системы
                    try:
                        os.remove(os.path.join(project_folder, img))
                    except OSError as e:
                        print(f"Ошибка при удалении изображения {img}: {e}")

            project.images = ','.join(existing_images)

        db.session.commit()
        flash('Проект успешно изменен!')
        return redirect(url_for('main.admin_dashboard'))
    existing_images = project.images.split(',') if project.images else []
    return render_template('edit_project.html', project=project, existing_images=existing_images)
    
@bp.route('/admin/delete_project/<int:project_id>', methods=['POST'])
def delete_project(project_id):
    project = Project.query.get(project_id)
    if project:
        db.session.delete(project)
        db.session.commit()
        flash('Проект успешно удален!', 'success')
    else:
        flash('Проект не найден!', 'error')
    return redirect(url_for('main.admin_dashboard'))


@bp.route('/api/projects/<string:slug>', methods=['GET'])
def get_project(slug):
    # Получаем параметр языка из запроса (по умолчанию - 'en')
    lang = request.args.get('lang', 'en')

    # Найти проект по слагу
    project = Project.query.filter_by(slug=slug).first()
    
    # if project is None:
    #     abort(404)  # Возвращаем ошибку 404, если проект не найден

    # Формируем JSON-ответ в зависимости от языка
    project_data = {
        'id': project.id,
        'slug': project.slug,
        'name': project.name_ru if lang == 'ru' else project.name,
        'location': project.location_ru if lang == 'ru' else project.location_en,
        'area': project.area_en,  # Площадь может быть одинаковой для обоих языков
        'process': project.process_ru if lang == 'ru' else project.process_en,
        'client': project.client_ru if lang == 'ru' else project.client_en,
        'description': project.description_ru if lang == 'ru' else project.description_en,
        'images': project.images.split(',') if project.images else []  # Предполагаем, что изображения разделены запятыми
    }

    return jsonify(project_data)  # Возвращаем данные в формате JSON

@bp.route('/api/projects', methods=['GET'])
def get_projects():
    # Получаем параметр языка из запроса (по умолчанию - 'en')
    lang = request.args.get('lang', 'en')
    # Получаем все проекты из базы данных
    projects = Project.query.order_by(Project.project_id).all()

    # Формируем список проектов для возврата
    project_list = []
    for project in projects:
        project_data = {
            'id': project.id,
            'project_id': project.project_id,
            'slug': project.slug,
            'name': project.name_ru if lang == 'ru' else project.name,
            'location': project.location_ru if lang == 'ru' else project.location_en,
            'area': project.area_en,  # Предполагаем, что площадь одинаковая для обоих языков
            'process': project.process_ru if lang == 'ru' else project.process_en,
            'client': project.client_ru if lang == 'ru' else project.client_en,
            'description': project.description_ru if lang == 'ru' else project.description_en,
            'images': project.images.split(',') if project.images else []  # Предполагаем, что изображения разделены запятыми
        }
        project_list.append(project_data)

    # Возвращаем список проектов в формате JSON
    return jsonify(project_list)

@bp.route('/admin/add_person', methods=['GET', 'POST'])
def add_person():
    if not os.path.exists(Config.UPLOAD_FOLDER):
        os.makedirs(Config.UPLOAD_FOLDER)
    
    if request.method == 'POST':
        name = request.form.get('name')
        name_ru = request.form.get('name_ru')
        person_id = request.form.get('person_id')
        occupation = request.form.get('occupation')
        occupation_ru = request.form.get('occupation_ru')
        is_main = 'is_main' in request.form 

        # Проверка наличия файла
        if 'image' not in request.files:
            flash('Нет файла для загрузки!', 'error')
            return redirect(url_for('add_person_form'))
        
        file = request.files['image']

        if file.filename == '':
            flash('Нет выбранного файла!', 'error')
            return redirect(url_for('add_person_form'))

        filename = secure_filename(file.filename)
        folder = os.path.join(Config.UPLOAD_FOLDER, '0012')
        os.makedirs(folder, exist_ok=True)
        file_path = os.path.join(folder, filename)# Создание директории, если она не существует
        file.save(file_path)

        if not name or not occupation:
            flash('Имя и должность являются обязательными полями!', 'error')
            return redirect(url_for('add_person_form'))

        person = Person(name=name,name_ru=name_ru, person_id=person_id, occupation=occupation, occupation_ru=occupation_ru, image=filename, is_main=is_main)

        # Обработка образования
        edu_ids = request.form.getlist('edu_ids[]')
        education_years = request.form.getlist('education_year[]')
        education_universities = request.form.getlist('education_university[]')
        education_universities_ru = request.form.getlist('education_university_ru[]')
        
        for edu_id, year, university, university_ru in zip(edu_ids, education_years, education_universities, education_universities_ru):
            if year and university:
                education = Education(edu_id=edu_id,years=year, university=university, university_ru = university_ru)
                person.education.append(education)

        # Обработка опыта работы
        work_ids = request.form.getlist('work_ids[]')
        work_years = request.form.getlist('work_year[]')
        work_places = request.form.getlist('work_place[]')
        work_places_ru = request.form.getlist('work_place_ru[]')
        work_positions = request.form.getlist('work_position[]')
        work_positions_ru = request.form.getlist('work_position_ru[]')
        
        for work_id, year, place, position, place_ru, position_ru in zip(work_ids, work_years, work_places, work_positions, work_places_ru, work_positions_ru):
            if year and place and position:
                work_experience = WorkExperience(work_id=work_id, years=year, place=place, place_ru=place_ru, position=position, position_ru=position_ru)
                person.work_experience.append(work_experience)

        db.session.add(person)
        db.session.commit()

        flash('Сотрудник успешно добавлен!', 'success')
        return redirect(url_for('main.admin_dashboard'))

    return render_template('add_person.html')

@bp.route('/admin/edit_person/<int:person_id>', methods=['GET', 'POST'])
def edit_person(person_id):
    person = Person.query.get(person_id)
    folder = os.path.join(Config.UPLOAD_FOLDER, '0012')

    if person is None:
        flash('Сотрудник не найден!', 'error')
        return redirect(url_for('main.admin_dashboard'))

    if request.method == 'POST':
        # Обновление данных о сотруднике
        person.name = request.form.get('name')
        person.name_ru = request.form.get('name_ru')
        person.occupation = request.form.get('occupation')
        person.occupation_ru = request.form.get('occupation_ru')
        person.person_id = request.form.get('person_id')
        person.is_main = 'is_main' in request.form 

        # Обработка изображений
        if 'new_images' in request.files:
            new_images = request.files.getlist('new_images')
            existing_image = person.image or []  # Использовать пустой список, если изображений нет

            for image in new_images:
                if image and Config.allowed_file(image.filename):
                    filename = secure_filename(image.filename)
                    image_path = os.path.join(folder, filename)
                    os.makedirs(folder, exist_ok=True)  # Создаем папку, если ее нет
                    image.save(image_path)
                    existing_image = filename  # Добавляем имя файла к существующему списку
        
            person.image = existing_image  # Сохраняем обновленный список изображений

        if 'delete_images' in request.form:
            images_to_delete = request.form.getlist('delete_images')
            existing_image =  person.image or []

            for img in images_to_delete:
                if img in existing_image:
                    existing_image = None
                    # Удаляем изображение из файловой системы
                    try:
                        os.remove(os.path.join(folder, img))
                    except OSError as e:
                        print(f"Ошибка при удалении изображения {img}: {e}")
            person.image = existing_image

        # Обработка опыта работы
        work_ids = request.form.getlist('work_id')
        # work_index = request.form.getlist('work_ind')
        work_places = request.form.getlist('work_place')
        print(work_places)
        work_positions = request.form.getlist('work_position')
        work_years = request.form.getlist('work_years')

        for i in range(len(work_places)):
            if work_ids[i]:  # Если это уже существующая запись
                work_instance = WorkExperience.query.get(work_ids[i])
                if work_instance:
                    # work_instance.work_id = work_index
                    work_instance.place = work_places[i]
                    work_instance.position = work_positions[i]
                    work_instance.years = work_years[i]
            else:  # Создаем новую запись
                new_work = WorkExperience(
                    person_id=person.id,
                    # work_id = work_index[i],
                    place=work_places[i],
                    position=work_positions[i],
                    years=work_years[i]
                )
                db.session.add(new_work)

        # Обработка образования
        education_ids = request.form.getlist('education_id')
        edu_ids = request.form.getlist('edu_ind')
        education_universities = request.form.getlist('education_university')
        education_years = request.form.getlist('education_years')
        education_universities_ru = request.form.getlist('education_university_ru')

        for i in range(len(education_universities)):
            if education_ids[i]:  # Если это уже существующая запись
                education_instance = Education.query.get(education_ids[i])
                if education_instance:
                    education_instance.edu_id = edu_ids[i]
                    education_instance.university = education_universities[i]
                    education_instance.years = education_years[i]
                    education_instance.university_ru = education_universities_ru[i]
            else:  # Создаем новую запись
                new_education = Education(
                    person_id=person.id,
                    edu_id = edu_ids[i],
                    university=education_universities[i],
                    years=education_years[i],
                    university_ru=education_universities_ru[i]
                )
                db.session.add(new_education)

        db.session.commit()
        flash('Данные сотрудника успешно обновлены!', 'success')
        return redirect(url_for('main.admin_dashboard'))

    # Извлечение существующих записей для работы и образования
    existing_work_experience = WorkExperience.query.filter_by(person_id=person.id).all()
    existing_education = Education.query.filter_by(person_id=person.id).all()

    existing_image = person.image
    return render_template('edit_person.html', 
                           person=person, 
                           existing_image=existing_image, 
                           existing_work_experience=existing_work_experience,
                           existing_education=existing_education)


@bp.route('/admin/delete_person/<int:person_id>', methods=['POST'])
def delete_person(person_id):
    person = Person.query.get(person_id)
    print(person)
    if person is None:
        flash('Сотрудник не найден!', 'error')
    else:
        db.session.delete(person)
        db.session.commit()
        flash('Сотрудник успешно удален!', 'success')
    
    return redirect(url_for('main.admin_dashboard'))

@bp.route('/')
def index():
    # Главное представление
    # projects = Project.query.all()
    return render_template('index.html')


# Страница "Studio"
@bp.route('/studio')
def studio():
    return render_template('studio.html')


# Страница "Contacts"
@bp.route('/contacts')
def contacts():
    return render_template('contacts.html')

# Страница "Gallery"
@bp.route('/gallery') 
def gallery():
    projects = Project.query.all()
    lang = request.args.get('lang', 'en') 
    return render_template('galery.html', project=projects, lang=lang)

# Динамическая страница проекта
@bp.route('/gallery/<slug>')
def project(slug):
    project_data = Project.query.filter_by(slug=slug).first()  # Получаем проект из базы данных по слагу

    # if project_data is None:
    #     abort(404)  # Возвращаем 404 ошибку, если проект не найден
    lang = request.args.get('lang', 'en') 
    return render_template('projects.html', project=project_data, lang=lang)

# Обработка статических файлов (CSS, JS, изображения)
@bp.route('/public/<path:path>')
def static_files(path):
    return send_from_directory('public', path)


# @bp.route('/admin/delete_project/<int:project_id>', methods=['POST'])
# def delete_project(project_id):
#     project = Project.query.get_or_404(project_id)
#     os.remove(project.images)  # Удалите какие-либо изображения, если это необходимо
#     db.session.delete(project)
#     db.session.commit()
#     flash('Проект успешно удален!')
#     return redirect(url_for('main.admin_dashboard'))

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
# @bp.route('/api/project/<int:project_id>', methods=['GET'])
# def get_project(project_id):
#     project = Project.query.get_or_404(project_id)
#     return jsonify({
#         'id': project.id,
#         'name': project.name,
#         'slug': project.slug,
#         'location': project.location,
#         'area': project.area,
#         'process': project.process,
#         'client': project.client,
#         'description': project.description,
#         'images': project.images.split(',') if project.images else []
#     })

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