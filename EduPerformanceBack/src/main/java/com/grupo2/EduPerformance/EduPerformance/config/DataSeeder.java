package com.grupo2.EduPerformance.EduPerformance.config;

import com.grupo2.EduPerformance.EduPerformance.model.entity.*;
import com.grupo2.EduPerformance.EduPerformance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private CursosRepository cursosRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private ProfesorRepository profesorRepository;

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo sembrar la base de datos si está completamente vacía
        if (usuarioRepository.count() == 0) {
            System.out.println("🌱 Base de datos vacía detectada. Iniciando siembra de datos de prueba premium...");

            // 1. Crear Administrador
            Usuario adminUser = new Usuario();
            adminUser.setNombre("Sofía");
            adminUser.setApellido("Altamirano");
            adminUser.setEmail("sofia.altamirano@edu.com");
            adminUser.setPassword("admin123");
            adminUser.setEdad(28);
            adminUser = usuarioRepository.save(adminUser);

            Perfil adminPerfil = new Perfil();
            adminPerfil.setDireccion("Calle de la Administración 123");
            adminPerfil.setTelefono("555-0100");
            adminPerfil.setUsuario(adminUser);
            perfilRepository.save(adminPerfil);

            // 2. Crear Profesor Carlos Mendoza
            Usuario profUser = new Usuario();
            profUser.setNombre("Carlos");
            profUser.setApellido("Mendoza");
            profUser.setEmail("carlos.mendoza@edu.com");
            profUser.setPassword("profesor123");
            profUser.setEdad(42);
            profUser = usuarioRepository.save(profUser);

            Perfil profPerfil = new Perfil();
            profPerfil.setDireccion("Avenida del Saber 456");
            profPerfil.setTelefono("555-0200");
            profPerfil.setUsuario(profUser);
            perfilRepository.save(profPerfil);

            Profesor profesor = new Profesor();
            profesor.setUsuario(profUser);
            profesor.setCodigo("PRF-002");
            profesor.setDepartamento("Ciencias Exactas e Ingeniería");
            profesor.setEspecialidad("Desarrollo de Software");
            profesor = profesorRepository.save(profesor);

            // 3. Crear Estudiante Ana Silva
            Usuario estUser1 = new Usuario();
            estUser1.setNombre("Ana");
            estUser1.setApellido("Silva");
            estUser1.setEmail("ana.silva@edu.com");
            estUser1.setPassword("estudiante123");
            estUser1.setEdad(20);
            estUser1 = usuarioRepository.save(estUser1);

            Perfil estPerfil1 = new Perfil();
            estPerfil1.setDireccion("Plaza Estudiantil 789");
            estPerfil1.setTelefono("555-0300");
            estPerfil1.setUsuario(estUser1);
            perfilRepository.save(estPerfil1);

            Estudiante estudiante1 = new Estudiante();
            estudiante1.setUsuario(estUser1);
            estudiante1.setCodigo("EST-001");
            estudiante1.setCarrera("Ingeniería de Sistemas");
            estudiante1.setSemestre(6);
            estudiante1.setCursos(new ArrayList<>());
            estudiante1 = estudianteRepository.save(estudiante1);

            // 4. Crear Estudiante Mateo López
            Usuario estUser2 = new Usuario();
            estUser2.setNombre("Mateo");
            estUser2.setApellido("López");
            estUser2.setEmail("mateo.lopez@edu.com");
            estUser2.setPassword("estudiante123");
            estUser2.setEdad(22);
            estUser2 = usuarioRepository.save(estUser2);

            Perfil estPerfil2 = new Perfil();
            estPerfil2.setDireccion("Paseo de las Letras 101");
            estPerfil2.setTelefono("555-0400");
            estPerfil2.setUsuario(estUser2);
            perfilRepository.save(estPerfil2);

            Estudiante estudiante2 = new Estudiante();
            estudiante2.setUsuario(estUser2);
            estudiante2.setCodigo("EST-002");
            estudiante2.setCarrera("Tecnología en Desarrollo");
            estudiante2.setSemestre(4);
            estudiante2.setCursos(new ArrayList<>());
            estudiante2 = estudianteRepository.save(estudiante2);

            // 5. Crear Cursos y asignarles el Usuario creador (profUser)
            Cursos curso1 = new Cursos();
            curso1.setNombre("Matemáticas Avanzadas");
            curso1.setDescripcion("Cálculo diferencial e integral y álgebra lineal aplicada.");
            curso1.setUsuario(profUser);
            curso1 = cursosRepository.save(curso1);

            Cursos curso2 = new Cursos();
            curso2.setNombre("Programación en Java");
            curso2.setDescripcion("Desarrollo de APIs REST con Spring Boot y JPA Hibernate.");
            curso2.setUsuario(profUser);
            curso2 = cursosRepository.save(curso2);

            // 6. Matricular estudiantes a los cursos (Profesor.cursos ya no se guarda en tabla intermedia)
            estudiante1.setCursos(Arrays.asList(curso1, curso2));
            estudianteRepository.save(estudiante1);

            estudiante2.setCursos(Arrays.asList(curso1, curso2));
            estudianteRepository.save(estudiante2);

            // 8. Crear Calificaciones para Estudiante 1 (Ana Silva)
            // Curso 1: Matemáticas Avanzadas
            Calificacion cal1 = new Calificacion(null, 4.5, estudiante1, curso1, 20, "Taller 1: Derivadas", LocalDate.now().minusDays(10), "Excelente razonamiento lógico.");
            Calificacion cal2 = new Calificacion(null, 3.8, estudiante1, curso1, 30, "Parcial 1: Integrales", LocalDate.now().minusDays(5), "Buen trabajo, repasar teoremas fundamentales.");
            Calificacion cal3 = new Calificacion(null, 4.8, estudiante1, curso1, 15, "Taller 2: Álgebra Lineal", LocalDate.now().minusDays(2), "Perfecto desarrollo de la matriz.");
            
            // Curso 2: Programación en Java
            Calificacion cal4 = new Calificacion(null, 4.9, estudiante1, curso2, 25, "Proyecto 1: CRUD con JPA", LocalDate.now().minusDays(8), "Impecable arquitectura de software.");
            Calificacion cal5 = new Calificacion(null, 4.2, estudiante1, curso2, 30, "Examen: Inyección de Dependencias", LocalDate.now().minusDays(3), "Domina el concepto de desacoplamiento.");

            // Crear Calificaciones para Estudiante 2 (Mateo López)
            // Curso 1: Matemáticas Avanzadas
            Calificacion cal6 = new Calificacion(null, 3.2, estudiante2, curso1, 20, "Taller 1: Derivadas", LocalDate.now().minusDays(10), "Revisar reglas de derivación básicas.");
            Calificacion cal7 = new Calificacion(null, 4.0, estudiante2, curso1, 30, "Parcial 1: Integrales", LocalDate.now().minusDays(5), "Muy buen esfuerzo en la resolución.");
            
            // Curso 2: Programación en Java
            Calificacion cal8 = new Calificacion(null, 3.5, estudiante2, curso2, 25, "Proyecto 1: CRUD con JPA", LocalDate.now().minusDays(8), "Funciona pero necesita optimizar las consultas N+1.");
            Calificacion cal9 = new Calificacion(null, 4.5, estudiante2, curso2, 30, "Examen: Inyección de Dependencias", LocalDate.now().minusDays(3), "Excelente respuesta teórica.");

            calificacionRepository.saveAll(Arrays.asList(cal1, cal2, cal3, cal4, cal5, cal6, cal7, cal8, cal9));

            // 9. Crear Asistencias
            // Asistencias Ana Silva - Curso 1
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(4), true, estudiante1, curso1));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(3), true, estudiante1, curso1));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(2), false, estudiante1, curso1));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(1), true, estudiante1, curso1));

            // Asistencias Ana Silva - Curso 2
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(4), true, estudiante1, curso2));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(3), true, estudiante1, curso2));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(2), true, estudiante1, curso2));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(1), true, estudiante1, curso2));

            // Asistencias Mateo López - Curso 1
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(4), true, estudiante2, curso1));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(3), false, estudiante2, curso1));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(2), true, estudiante2, curso1));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(1), false, estudiante2, curso1));

            // Asistencias Mateo López - Curso 2
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(4), true, estudiante2, curso2));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(3), true, estudiante2, curso2));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(2), false, estudiante2, curso2));
            asistenciaRepository.save(new Asistencia(null, LocalDate.now().minusDays(1), true, estudiante2, curso2));

            System.out.println("🎉 Base de datos de prueba sembrada con éxito. Listo para producción y pruebas front-end.");
        } else {
            System.out.println("ℹ️ Base de datos ya contiene registros. Saltando la siembra de datos de prueba.");
        }
    }
}
