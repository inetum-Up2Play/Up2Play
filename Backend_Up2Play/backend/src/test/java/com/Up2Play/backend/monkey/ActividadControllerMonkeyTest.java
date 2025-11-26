package com.Up2Play.backend.monkey;


import io.restassured.http.ContentType;
import io.restassured.response.Response;
import net.datafaker.Faker;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;
import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


public class ActividadControllerMonkeyTest extends BaseApiTest {

    private final Faker faker = new Faker();
    private final java.util.Random rnd = new java.util.Random();

    private static final String[] DEPORTES = {
        "Atletismo", "Balonmano", "Basquet", "Béisbol", "Billar", "Boxeo", "Críquet",
        "Ciclismo", "Escalada", "Esgrima", "Esquí", "Futbol", "Gimnasia", "Golf",
        "Hockey", "Artes Marciales", "Natación", "Patinaje", "Ping Pong", "Piragüismo",
        "Rugby", "Remo", "Snowboard", "Surf", "Tenis", "Triatlón", "Voleibol",
        "Waterpolo", "Ajedrez", "Badminton", "Crossfit", "Danza Deportiva",
        "Entrenamiento de fuerza", "Equitación", "Fútbol Americano", "Lucha Libre",
        "Motocross", "Padel", "Parkour", "Skateboarding", "Squash", "Tiro con Arco",
        "Frisbee", "Senderismo", "Running", "Petanca"
    };

    private static final String[] NIVELES = {
        "Iniciado", "Principiante", "Intermedio", "Avanzado", "Experto"
    };   

    private String fechaFuturaISO(int dias) {
    return LocalDateTime.now().plusDays(dias).withNano(0).toString();
    }




    @Test
    void crearActividadYValidar() {
        // Generar datos aleatorios para crear actividad
        Map<String, Object> actividad = new HashMap<>();    
        actividad.put("nombre", generarNombreActividad());
        actividad.put("descripcion", faker.lorem().sentence());
        actividad.put("fecha", fechaFuturaISO(5));   // ej. 2025-12-01T10:15:30
        actividad.put("ubicacion", faker.address().city());
        actividad.put("nivel", NIVELES[rnd.nextInt(NIVELES.length)]);
        actividad.put("numPersTotales", String.valueOf(rnd.nextInt(5, 15)));
        actividad.put("deporte", DEPORTES[rnd.nextInt(DEPORTES.length)]);
        actividad.put("precio", String.valueOf(rnd.nextInt(0, 50)));

        Response res = given()
                .header("Authorization", AUTH)
                .contentType(ContentType.JSON)
                .body(actividad)
                .when()
                .post("/actividades/crearActividad")
                .then()
                .extract().response();

        assertEquals(200, res.statusCode());
        assertNotNull(res.jsonPath().getString("message"));
        System.out.println("Actividad creada: " + actividad);
    }

    @Test
    void listarActividades() {
        Response res = given()
                .header("Authorization", AUTH)
                .when()
                .get("/actividades/getAll")
                .then()
                .extract().response();

        assertEquals(200, res.statusCode());
        System.out.println("Listado actividades: " + res.asString());
    }

    @Test
    void unirYDesapuntarActividad() {
        // Primero obtener una actividad existente
        Response listRes = given()
                .header("Authorization", AUTH)
                .when()
                .get("/actividades/getAll")
                .then()
                .extract().response();

        assertEquals(200, listRes.statusCode());
        Long idActividad = listRes.jsonPath().getLong("[0].id");
        assertNotNull(idActividad);

        // Unirse a la actividad
        Response unirRes = given()
                .header("Authorization", AUTH)
                .contentType(ContentType.JSON)
                .when()
                .put("/actividades/" + idActividad + "/participantes")
                .then()
                .extract().response();

        System.out.println("Unirse: " + unirRes.asString());

        // Desapuntarse
        Response desapuntarRes = given()
                .header("Authorization", AUTH)
                .contentType(ContentType.JSON)
                .when()
                .delete("/actividades/" + idActividad + "/participantes")
                .then()
                .extract().response();

        System.out.println("Desapuntar: " + desapuntarRes.asString());
    }

    @Test
    void editarActividad() {
        // Obtener actividad creada por el usuario
        Response creadasRes = given()
                .header("Authorization", AUTH)
                .when()
                .get("/actividades/getCreadas")
                .then()
                .extract().response();

        if (creadasRes.jsonPath().getList("$").isEmpty()) {
            System.out.println("No hay actividades creadas para editar.");
            return;
        }

        Long idActividad = creadasRes.jsonPath().getLong("[0].id");

        Map<String, Object> editar = new HashMap<>();
        editar.put("nombre", generarNombreActividad()); // Ejemplo: "Go hiking"
        editar.put("descripcion", faker.lorem().sentence());
        editar.put("fecha", fechaFuturaISO(10));
        editar.put("ubicacion", faker.address().city());
        editar.put("nivel", NIVELES[rnd.nextInt(NIVELES.length)]);
        editar.put("numPersTotales", String.valueOf(rnd.nextInt(5, 20)));
        editar.put("deporte", DEPORTES[rnd.nextInt(DEPORTES.length)]);

        Response res = given()
                .header("Authorization", AUTH)
                .contentType(ContentType.JSON)
                .body(editar)
                .when()
                .put("/actividades/editarActividad/" + idActividad)
                .then()
                .extract().response();

        assertEquals(200, res.statusCode());
        System.out.println("Actividad editada: " + editar);
    }

    
    private String generarNombreActividad() {
        String deporte = DEPORTES[rnd.nextInt(DEPORTES.length)];
        String[] prefijos = {"Clase de", "Entrenamiento de", "Partido de", "Sesión de", "Competición de"};
        String prefijo = prefijos[rnd.nextInt(prefijos.length)];
        return prefijo + " " + deporte;
    }


}
