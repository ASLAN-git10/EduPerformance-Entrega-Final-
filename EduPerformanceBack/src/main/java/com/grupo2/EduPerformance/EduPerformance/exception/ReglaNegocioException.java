package com.grupo2.EduPerformance.EduPerformance.exception;

// Excepción para validaciones de negocio.
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String message) {
        super(message);
    }
}
