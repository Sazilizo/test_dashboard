from .auth import auth_bp
from .base_route import base_bp
from .students import students_bp
from .student_sessions import student_sessions_bp
from .schools import schools_bp
from .workers import workers_bp
from .meals import meals_bp
from .meals_stats import meal_stats_bp
from .dashboard import dashboard_bp
from .assessments import assessments_bp
from .uploads import upload_bp
from .worker_trainings import worker_trainings_bp

def register_routes(app):
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

__all__ = [
    'auth_bp', 'base_bp', 'students_bp', 'student_sessions_bp',
    'schools_bp', 'workers_bp', 'meals_bp', 'meal_stats_bp',
    'dashboard_bp', 'assessments_bp', 'upload_bp', 'worker_trainings_bp',
    'register_routes'
]
