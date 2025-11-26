package com.Up2Play.backend.monkey;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Value;

import com.Up2Play.backend.Model.Usuario;
import io.restassured.RestAssured;
import net.datafaker.Faker;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import static io.restassured.RestAssured.given;

import java.util.Map;
import java.util.Random;


public abstract class BaseApiTest {

    protected static String BASE = System.getProperty("baseUrl", "http://localhost:8080");
    protected static String AUTH;
    protected static long SEED = Long.getLong("seed", 12345L);

    protected static Faker faker;
    protected static Random rnd;

    @BeforeAll
    static void init() {
        RestAssured.baseURI = BASE;
        faker = new Faker(new Random(SEED));
        rnd = new Random(SEED);
    }

    @Value("${spring.test.email}")
    static private String emailTest;

    @Value("${spring.test.password}")
    static private String passwordTest; 

    @BeforeAll
    static void authenticate() {
        Response loginRes = given()
            .contentType(ContentType.JSON)
            .body(Map.of("email", "maba045@vidalibarraquer.net", "password", "Hola123!"))
        .when()
            .post("/auth/login")
        .then()
            .extract().response();

        AUTH = "Bearer " + loginRes.jsonPath().getString("token");
        System.out.println("Token obtenido: " + AUTH);
    }

    
}
