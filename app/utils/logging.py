from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from datetime import datetime

def log_rate_limit_violation(limit):
    """Log rate limit violations to the database"""
    from app.models import AuditLog, User
    from app.extensions import db
    
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id is None:
            return jsonify({"error":"Rate limit exceeded"}), 429
    except Exception:
        return jsonify({"error":"Rate limit exceeded"}), 429

    log = AuditLog(
        user_id=user_id,
        action=f"RATE_LIMIT_EXCEEDED: {request.method} {request.path}",
        ip_address=request.remote_addr,
        timestamp=datetime.utcnow(),
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "error": "Rate limit exceeded. Please slow down."
    }), 429

