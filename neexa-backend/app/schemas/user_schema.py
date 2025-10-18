from marshmallow import Schema, fields, validate, validates, ValidationError
import re

class UserRegistrationSchema(Schema):
    """Schema for user registration validation"""
    email = fields.Email(required=True, validate=validate.Length(max=120))
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    confirm_password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    phone = fields.Str(validate=validate.Length(max=20), allow_none=True)
    date_of_birth = fields.Date(allow_none=True)
    preferred_currency = fields.Str(validate=validate.Length(max=3), missing='ARS')
    
    @validates('password')
    def validate_password(self, value):
        """Validate password strength"""
        if len(value) < 8:
            raise ValidationError('Password must be at least 8 characters long')
        
        if not re.search(r'[A-Z]', value):
            raise ValidationError('Password must contain at least one uppercase letter')
        
        if not re.search(r'[a-z]', value):
            raise ValidationError('Password must contain at least one lowercase letter')
        
        if not re.search(r'\d', value):
            raise ValidationError('Password must contain at least one digit')
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValidationError('Password must contain at least one special character')
    
    @validates('first_name')
    def validate_first_name(self, value):
        """Validate first name"""
        if not value.strip():
            raise ValidationError('First name cannot be empty')
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise ValidationError('First name can only contain letters and spaces')
    
    @validates('last_name')
    def validate_last_name(self, value):
        """Validate last name"""
        if not value.strip():
            raise ValidationError('Last name cannot be empty')
        if not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', value):
            raise ValidationError('Last name can only contain letters and spaces')
    
    @validates('phone')
    def validate_phone(self, value):
        """Validate phone number"""
        if value:
            # Remove all non-digit characters
            digits_only = re.sub(r'\D', '', value)
            if len(digits_only) < 10 or len(digits_only) > 15:
                raise ValidationError('Phone number must be between 10 and 15 digits')

class UserLoginSchema(Schema):
    """Schema for user login validation"""
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=1))

class UserUpdateSchema(Schema):
    """Schema for user profile updates"""
    first_name = fields.Str(validate=validate.Length(min=1, max=50))
    last_name = fields.Str(validate=validate.Length(min=1, max=50))
    phone = fields.Str(validate=validate.Length(max=20), allow_none=True)
    date_of_birth = fields.Date(allow_none=True)
    preferred_currency = fields.Str(validate=validate.Length(max=3))

class PasswordChangeSchema(Schema):
    """Schema for password change validation"""
    current_password = fields.Str(required=True)
    new_password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    confirm_new_password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    
    @validates('new_password')
    def validate_new_password(self, value):
        """Validate new password strength"""
        if len(value) < 8:
            raise ValidationError('Password must be at least 8 characters long')
        
        if not re.search(r'[A-Z]', value):
            raise ValidationError('Password must contain at least one uppercase letter')
        
        if not re.search(r'[a-z]', value):
            raise ValidationError('Password must contain at least one lowercase letter')
        
        if not re.search(r'\d', value):
            raise ValidationError('Password must contain at least one digit')
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValidationError('Password must contain at least one special character')

class UserResponseSchema(Schema):
    """Schema for user response data"""
    id = fields.Int()
    email = fields.Email()
    first_name = fields.Str()
    last_name = fields.Str()
    is_active = fields.Bool()
    is_verified = fields.Bool()
    created_at = fields.DateTime()
    last_login = fields.DateTime()
    preferred_currency = fields.Str()

