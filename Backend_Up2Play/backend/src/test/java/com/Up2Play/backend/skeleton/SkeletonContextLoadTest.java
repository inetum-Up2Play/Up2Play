package com.Up2Play.backend.skeleton;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
class SkeletonContextLoadTest {

    @Test
    @Timeout(90) // fail-fast si algo cuelga
    void contextLoads() {
        // Si el ApplicationContext no arranca, este test falla.
    }
}