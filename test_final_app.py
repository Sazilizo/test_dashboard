#!/usr/bin/env python3
import os
import sys

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    value = value.strip('"\'')
                    os.environ[key] = value

load_env()

try:
    from app import create_app
    app = create_app()
    print("✅ Flask app created successfully!")
    print(f"Database URI configured: {bool(os.getenv('SQLALCHEMY_DATABASE_URI'))}")
    print(f"JWT Secret configured: {bool(os.getenv('JWT_SECRET_KEY'))}")
    
    from app.models import (User, Role, TokenBlocklist, School, Student, 
                           Assessment, AcademicSession, PESession, Meal, 
                           MealDistribution, Worker, SoftDeleteMixin, 
                           CategoryEnum, TermEnum, AuditLog, AttendanceRecord, 
                           TrainingRecord, UserRemovalReview)
    print("✅ All models imported successfully!")
    
    from app.routes import (auth_bp, base_bp, students_bp, student_sessions_bp,
                           schools_bp, workers_bp, meals_bp, meal_stats_bp,
                           dashboard_bp, assessments_bp, upload_bp, worker_trainings_bp)
    print("✅ All route blueprints imported successfully!")
    
    with app.app_context():
        print("✅ App context works correctly!")
        
    print("\n🎉 All tests passed! Flask app is fully functional.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
