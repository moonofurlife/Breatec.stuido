from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder='public', template_folder='views')

# Главная страница
@app.route('/')
def main():
    return render_template('main.html')

# Страница "Project"
@app.route('/project')
def project():
    return render_template('projects.html')

# Страница "Studio"
@app.route('/studio')
def studio():
    return render_template('studio.html')

# Страница "Contacts"
@app.route('/contacts')
def contacts():
    return render_template('contacts.html')

@app.route('/galery')
def galery():
    return render_template('galery.html')

# Обработка статических файлов (CSS, JS, изображения)
@app.route('/public/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(debug=True)
