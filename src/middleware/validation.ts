// src/middleware/validation.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction) => {
    body('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    body('email').isEmail().withMessage('El email debe ser válido').run(req);
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};


export const validateUserLogin = (req: Request, res: Response, next: NextFunction) => {
  body('email').isEmail().withMessage('El email debe ser válido').run(req);
  body('password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ... otras validaciones

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  body('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria').run(req);
  body('precio').isFloat().withMessage('El precio debe ser un número').run(req);
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
 };
