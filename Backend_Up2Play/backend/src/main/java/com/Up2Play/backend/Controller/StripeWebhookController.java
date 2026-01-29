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
     * Endpoint principal para webhooks de Stripe
     */
    @PostMapping("/stripe")
    public ResponseEntity<Map<String, Object>> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature,
            HttpServletRequest request) {

        try {
            String clientIp = request.getRemoteAddr();
            logger.info("Webhook recibido desde IP: {}", clientIp);
            logger.info("Payload tamaño: {} bytes", payload.length());
            logger.info("Signature: {}",
                    signature != null ? signature.substring(0, Math.min(50, signature.length())) + "..." : "null");

            Map<String, Object> result = stripeWebhookService.processWebhook(payload, signature);

            String status = (String) result.get("status");

            if ("success".equals(status) || "processed".equals(status) || "ignored".equals(status)) {
                logger.info("Webhook procesado exitosamente - Status: {}", status);
                return ResponseEntity.ok(result);

            } else if ("rejected".equals(status)) {
                logger.error("Webhook rechazado - Firma inválida");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);

            } else {
                logger.error("Error interno procesando webhook: {}", result.get("error"));
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
            }

        } catch (Exception e) {

            logger.error("ERROR CRÍTICO en webhook: {}", e.getMessage(), e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Error interno del servidor");
            errorResponse.put("error", e.getMessage());
            errorResponse.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testWebhookEndpoint() {
        logger.info("🧪 Endpoint de prueba accedido");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "active");
        response.put("message", "Webhook endpoint funcionando correctamente");
        response.put("service", "Up2Play Stripe Webhooks");
        response.put("timestamp", System.currentTimeMillis());
        response.put("endpoints", new String[] {
                "POST /api/webhooks/stripe",
                "GET /api/webhooks/test",
                "GET /api/webhooks/health"
        });

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "stripe-webhook");
        health.put("timestamp", System.currentTimeMillis());
        health.put("environment", getEnvironment());

        return ResponseEntity.ok(health);
    }

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

    private String getEnvironment() {
        String profile = System.getenv("SPRING_PROFILES_ACTIVE");
        if (profile == null || profile.isEmpty()) {
            return "development";
        }
        return profile;
    }
}