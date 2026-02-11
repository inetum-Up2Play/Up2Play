package com.Up2Play.backend.monkey;

import io.restassured.http.ContentType;
import io.restassured.response.Response;
import net.datafaker.Faker;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import java.time.LocalDateTime;
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

    
    //datos aleatorios para reutilizar en las creaciones.
    private Map<String, Object> generarDatosAleatorios() {
        Map<String, Object> act = new HashMap<>();
        act.put("nombre", generarNombreActividad());
        act.put("descripcion", faker.lorem().sentence());
        act.put("fecha", fechaFuturaISO(rnd.nextInt(1, 30)));
        act.put("ubicacion", faker.address().city());
        act.put("nivel", NIVELES[rnd.nextInt(NIVELES.length)].toUpperCase()); 
        act.put("numPersTotales", rnd.nextInt(5, 25));
        act.put("deporte", DEPORTES[rnd.nextInt(DEPORTES.length)].toUpperCase());     
        act.put("precio", 5.0 + (15.0 * rnd.nextDouble()));
        return act;
    }

    @Test
    @DisplayName("Monkey Test: Crear actividad y validar Status")
    public void crearActividadYValidar() {
        Map<String, Object> actividad = generarDatosAleatorios();

        Response response = given()
                .header("Authorization", AUTH)
                .contentType(ContentType.JSON)
                .body(actividad)
                .when()
                .post("/actividades/crearActividad");

        Assertions.assertEquals(200, response.getStatusCode(), "El post falló: " + response.statusLine());
        System.out.println("Actividad creada con éxito.");
    }

    @Test
    @DisplayName("Monkey Test: Listar actividades")
    void listarActividades() {
        // Aseguramos que haya al menos una para que no devuelva 404 o vacío
        crearActividadYValidar();

        Response res = given()
                .header("Authorization", AUTH)
                .when()
                .get("/actividades/getAll");

        assertEquals(200, res.statusCode());
        System.out.println("Listado actividades obtenido: " + res.asString());
    }

    @Test
    @DisplayName("Monkey Test: Unir y Desapuntar")
    void unirYDesapuntarActividad() {
        crearActividadYValidar();

        Response listRes = given()
                .header("Authorization", AUTH)
                .get("/actividades/getAll");

        String body = listRes.asString();
        if (body != null && body.length() > 2) {
            Long idActividad = listRes.jsonPath().getLong("[0].id");
            assertNotNull(idActividad);

            // Unirse
            given()
                .header("Authorization", AUTH)
                .put("/actividades/" + idActividad + "/participantes")
                .then().statusCode(200);

            // Desapuntarse
            given()
                .header("Authorization", AUTH)
                .delete("/actividades/" + idActividad + "/participantes")
                .then().statusCode(200);
            
            System.out.println("Flujo de participantes completado para ID: " + idActividad);
        }
    }

    @Test
    @DisplayName("Monkey Test: Editar actividad existente")
    void editarActividad() {
        // Crear actividad para que el usuario sea el propietario
        crearActividadYValidar();

        // Obtener actividad creada
        Response creadasRes = given()
                .header("Authorization", AUTH)
                .get("/actividades/getCreadas");

        String body = creadasRes.asString();
        // Verificamos que la lista no esté vacía []
        if (body != null && body.length() > 2) {
            Long idActividad = creadasRes.jsonPath().getLong("[0].id");

            Map<String, Object> datosEditados = generarDatosAleatorios();

            Response res = given()
                    .header("Authorization", AUTH)
                    .contentType(ContentType.JSON)
                    .body(datosEditados)
                    .when()
                    .put("/actividades/editarActividad/" + idActividad);

            assertEquals(200, res.statusCode());
            System.out.println("Actividad ID " + idActividad + " editada correctamente.");
        } else {
            System.out.println("No se encontró actividad para editar (posible fallo en getCreadas).");
        }
    }

    private String generarNombreActividad() {
        String deporte = DEPORTES[rnd.nextInt(DEPORTES.length)];
        String[] prefijos = {"Clase de", "Entrenamiento de", "Partido de", "Sesión de", "Competición de"};
        String prefijo = prefijos[rnd.nextInt(prefijos.length)];
        return prefijo + " " + deporte;
    }
}