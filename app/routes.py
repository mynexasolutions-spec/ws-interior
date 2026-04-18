from flask import render_template, request, jsonify, current_app
from . import db
from .models import ContactMessage

@current_app.route('/')
def index():
    return render_template('index.html')

@current_app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@current_app.route('/api/contact', methods=['POST'])
def contact_api():
    try:
        data = request.get_json()
        
        # Basic validation
        if not data.get('firstName') or not data.get('email') or not data.get('message'):
            return jsonify({'error': 'Missing required fields'}), 400

        new_message = ContactMessage(
            first_name=data.get('firstName'),
            last_name=data.get('lastName'),
            email=data.get('email'),
            phone=data.get('phone'),
            service=data.get('service'),
            message=data.get('message')
        )

        db.session.add(new_message)
        db.session.commit()

        return jsonify({'message': 'Success! Your message has been saved.'}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
