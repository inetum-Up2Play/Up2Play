package com.Up2Play.backend.Controller;

import com.Up2Play.backend.Service.StripeWebhookService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class StripeWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(StripeWebhookController.class);

    @Autowired
    private StripeWebhookService stripeWebhookService;

    /**
     * 🎯 Endpoint principal para webhooks de Stripe
     * IMPORTANTE: Stripe envía POST aquí cuando ocurren eventos
     */
    @PostMapping("/stripe")
    public ResponseEntity<Map<String, Object>> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature,
            HttpServletRequest request) {

        try {
            // Log información útil
            String clientIp = request.getRemoteAddr();
            logger.info("📬 Webhook recibido desde IP: {}", clientIp);
            logger.info("📦 Payload tamaño: {} bytes", payload.length());
            logger.info("🔐 Signature: {}",
                    signature != null ? signature.substring(0, Math.min(50, signature.length())) + "..." : "null");

            // Procesar el webhook
            Map<String, Object> result = stripeWebhookService.processWebhook(payload, signature);

            // Determinar código de respuesta basado en el resultado
            String status = (String) result.get("status");

            if ("success".equals(status) || "processed".equals(status) || "ignored".equals(status)) {
                // ✅ Éxito - Webhook procesado correctamente
                logger.info("✅ Webhook procesado exitosamente - Status: {}", status);
                return ResponseEntity.ok(result);

            } else if ("rejected".equals(status)) {
                // 🚨 Firma inválida - Posible ataque
                logger.error("🚨 Webhook rechazado - Firma inválida");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);

            } else {
                // ❌ Error interno del servidor
                logger.error("❌ Error interno procesando webhook: {}", result.get("error"));
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
            }

        } catch (Exception e) {
            // Error inesperado - importante loggear pero devolver 200
            // Stripe reintentará si devolvemos error 500
            logger.error("💥 ERROR CRÍTICO en webhook: {}", e.getMessage(), e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Error interno del servidor");
            errorResponse.put("error", e.getMessage());
            errorResponse.put("timestamp", System.currentTimeMillis());

            // IMPORTANTE: Devolvemos 200 OK para que Stripe no reintente constantemente
            // Aunque haya error, asumimos que lo manejaremos o Stripe reintentará más tarde
            return ResponseEntity.ok(errorResponse);
        }
    }

    /**
     * 🧪 Endpoint de prueba - Para verificar que el webhook está activo
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testWebhookEndpoint() {
        logger.info("🧪 Endpoint de prueba accedido");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "active");
        response.put("message", "✅ Webhook endpoint funcionando correctamente");
        response.put("service", "Up2Play Stripe Webhooks");
        response.put("timestamp", System.currentTimeMillis());
        response.put("endpoints", new String[] {
                "POST /api/webhooks/stripe",
                "GET /api/webhooks/test",
                "GET /api/webhooks/health"
        });

        return ResponseEntity.ok(response);
    }

    /**
     * 🩺 Endpoint de salud - Para monitoreo
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "stripe-webhook");
        health.put("timestamp", System.currentTimeMillis());
        health.put("environment", getEnvironment());

        return ResponseEntity.ok(health);
    }

    /**
     * 📊 Endpoint para estadísticas (opcional)
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getWebhookInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Stripe Webhook Handler");
        info.put("version", "1.0.0");
        info.put("description", "Maneja webhooks de Stripe para pagos P2P");
        info.put("supported_events", new String[] {
                "payment_intent.succeeded",
                "payment_intent.payment_failed"
        });
        info.put("webhook_url", "/api/webhooks/stripe");
        info.put("requires_signature", true);

        return ResponseEntity.ok(info);
    }

    /**
     * Método auxiliar para obtener entorno
     */
    private String getEnvironment() {
        String profile = System.getenv("SPRING_PROFILES_ACTIVE");
        if (profile == null || profile.isEmpty()) {
            return "development";
        }
        return profile;
    }
}