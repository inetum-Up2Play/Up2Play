package com.Up2Play.backend.monkey;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ActiveProfiles;

import com.Up2Play.backend.Model.Usuario;
import io.restassured.RestAssured;
import net.datafaker.Faker;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import static io.restassured.RestAssured.given;

import java.util.Map;
import java.util.Random;
@SpringBootTest
@ActiveProfiles("test")

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class BaseApiTest {

    protected String BASE = System.getProperty("baseUrl", "http://localhost:8080");
    protected String AUTH;
    protected long SEED = Long.getLong("seed", 12345L);

    protected Faker faker;
    protected Random rnd;

    @Autowired
    private TestPropierties testProperties;

    @BeforeEach
    void init() {
        RestAssured.baseURI = BASE;
        faker = new Faker(new Random(SEED));
        rnd = new Random(SEED);

        Response loginRes = given()
            .contentType(ContentType.JSON)
            .body(Map.of("email", testProperties.getEmail(), "password", testProperties.getPassword()))
            .post("/auth/login")
            .then()
            .extract().response();

        AUTH = "Bearer " + loginRes.jsonPath().getString("token");
        System.out.println("Token obtenido: " + AUTH);
    }
}

