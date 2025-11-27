package com.Up2Play.backend.monkey;


import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;
import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class UsuarioControllerMonkeyTest extends BaseApiTest {

    @Test
    void getTodosUsuarios() {
        Response res = given()
            .header("Authorization", AUTH)
            .accept(ContentType.JSON)
        .when()
            .get("/usuarios")
        .then()
            .extract().response();

        System.out.println("GET /usuarios -> " + res.asString());
        assertTrue(res.statusCode() < 500, "Error 500 en GET /usuarios");
    }

    @Test
    void postUsuarios_monkeyPayloads() {
        for (int i = 0; i < 10; i++) {
            Map<String, Object> payload = new HashMap<>();
            payload.put("nombre", faker.name().fullName());
            payload.put("email", faker.internet().emailAddress());
            payload.put("telefono", faker.phoneNumber().cellPhone());

            Response res = given()
                .header("Authorization", AUTH)
                .contentType(ContentType.JSON)
                .body(payload)
            .when()
                .post("/usuarios")
            .then()
                .extract().response();

            System.out.println("POST /usuarios -> " + res.asString());
            assertTrue(res.statusCode() < 500, "Error 500 con payload: " + payload);
        }
    }

    @Test
    void putUsuario_actualizacionAleatoria() {
        long id = 1; //Ajusta a un ID existente
        Map<String, Object> payload = new HashMap<>();
        payload.put("nombre", faker.name().fullName());
        payload.put("email", faker.internet().emailAddress());
        payload.put("telefono", faker.phoneNumber().cellPhone());

        Response res = given()
            .header("Authorization", AUTH)
            .contentType(ContentType.JSON)
            .body(payload)
        .when()
            .put("/usuarios/" + id)
        .then()
            .extract().response();

        System.out.println("PUT /usuarios/" + id + " -> " + res.asString());
        assertTrue(res.statusCode() < 500, "Error 500 en PUT /usuarios/" + id);
    }

    @Test
    void deleteUsuario() {
        long id = 2; //Ajusta a un ID existente
        Response res = given()
            .header("Authorization", AUTH)
        .when()
            .delete("/usuarios/" + id)
        .then()
            .extract().response();

        System.out.println("DELETE /usuarios/" + id + " -> " + res.asString());
        assertTrue(res.statusCode() < 500, "Error 500 en DELETE /usuarios/" + id);
    }

    @Test
    void getUsuarioActual() {
        Response res = given()
            .header("Authorization", AUTH)
            .get("/usuarios/me")
            .then()
            .extract().response();

        System.out.println("GET /usuarios/me -> " + res.asString());
        assertTrue(res.statusCode() < 500, "Error 500 en /usuarios/me");
    }

    
}
