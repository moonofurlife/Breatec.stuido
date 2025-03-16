from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_babel import Babel

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()



def create_app():
    app = Flask(__name__, template_folder='views', static_folder='public')
    app.secret_key = 'breatec' 
    login_manager.init_app(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    babel = Babel(app)
    app.config['BABEL_DEFAULT_LOCALE'] = 'en' 

    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        from . import models

    from .routes import bp
    app.register_blueprint(bp)

    return app