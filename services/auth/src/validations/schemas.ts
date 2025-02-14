import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

export const registerSchema = loginSchema.keys({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Name is required'
    }),
  title: Joi.string().optional(),
  institution: Joi.string().optional(),
  location: Joi.string().optional(),
  about: Joi.string().optional(),
  profileImage: Joi.string().uri().optional().messages({
    'string.uri': 'Profile image must be a valid URL'
  })
});

export const magicLinkSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  method: Joi.string()
    .valid('email', 'whatsapp')
    .required()
    .messages({
      'any.only': 'Method must be either email or whatsapp',
      'any.required': 'Method is required'
    })
});

export const verifyMagicLinkSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required'
    })
});

export const otpSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number in E.164 format',
      'any.required': 'Phone number is required'
    })
});

export const verifyOtpSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number in E.164 format',
      'any.required': 'Phone number is required'
    }),
  code: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required'
    })
});