from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt, migrate, limiter
from app.models import User, Role, TokenBlocklist, School, Student, Assessment, AcademicSession, PESession, Meal, MealDistribution, Worker, SoftDeleteMixin, CategoryEnum, TermEnum, AuditLog, AttendanceRecord, TrainingRecord, UserRemovalReview
import os

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'static/uploads/')
    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)
    
    CORS(app, 
         supports_credentials=True, 
         origins=["http://localhost:3000", "https://test-dashboard-app-tunnel-8g8atwh8.devinapps.com"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    register_routes(app)
    
    return app

def register_routes(app):
    from app.routes.auth import auth_bp
    from app.routes.base_route import base_bp
    from app.routes.students import students_bp
    from app.routes.student_sessions import student_sessions_bp
    from app.routes.schools import schools_bp
    from app.routes.workers import workers_bp
    from app.routes.meals import meals_bp
    from app.routes.meals_stats import meal_stats_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.assessments import assessments_bp
    from app.routes.uploads import upload_bp
    from app.routes.worker_trainings import worker_trainings_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(base_bp, url_prefix='/api')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(student_sessions_bp, url_prefix='/api/sessions')
    app.register_blueprint(schools_bp, url_prefix='/api/schools')
    app.register_blueprint(workers_bp, url_prefix='/api/workers')
    app.register_blueprint(meals_bp, url_prefix='/api/meals')
    app.register_blueprint(meal_stats_bp, url_prefix='/api/meal-stats')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(assessments_bp, url_prefix='/api/assessments')
    app.register_blueprint(upload_bp, url_prefix='/api/uploads')
    app.register_blueprint(worker_trainings_bp, url_prefix='/api/worker-trainings')
