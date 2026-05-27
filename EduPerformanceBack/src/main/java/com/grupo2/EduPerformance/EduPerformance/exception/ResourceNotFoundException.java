package com.grupo2.EduPerformance.EduPerformance.exception;

// Excepción lanzada cuando no se encuentra un recurso/entidad por su identificador.
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
