package com.Up2Play.backend.skeleton;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SmokeContextTest {

  @Test
  void contextLoads() {
    // Si aquest test passa, el context de Spring s'ha carregat correctament
  }
}