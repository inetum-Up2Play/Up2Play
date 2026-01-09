package com.Up2Play.backend.Service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Pago;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Model.enums.EstadoPago;
import com.Up2Play.backend.Repository.ActividadRepository;
import com.Up2Play.backend.Repository.PagoRepository;
import com.Up2Play.backend.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class StripeWebhookService {

    private static final Logger logger = LoggerFactory.getLogger(StripeWebhookService.class);

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private PagoRepository pagoRepository;

    /**
     * Procesa webhooks de Stripe - Versión SIMPLE
     */
    public Map<String, Object> processWebhook(String payload, String signature) {
        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("📥 Recibiendo webhook de Stripe...");

            // 1. Validar que viene de Stripe (IMPORTANTE)
            Event event = Webhook.constructEvent(payload, signature, webhookSecret);

            String eventType = event.getType();
            logger.info("✅ Evento válido: {}", eventType);

            // 2. Manejar diferentes tipos de eventos
            switch (eventType) {
                case "payment_intent.succeeded":
                    return handleSuccessfulPayment(event);

                case "payment_intent.payment_failed":
                    return handleFailedPayment(event);

                default:
                    // Para otros eventos, solo los loggeamos
                    logger.info("📝 Evento ignorado: {}", eventType);
                    response.put("status", "ignored");
                    response.put("event_type", eventType);
                    return response;
            }

        } catch (SignatureVerificationException e) {
            logger.error("🚨 FIRMA INVÁLIDA: Alguien está intentando falsificar un webhook!");
            response.put("error", "Firma inválida");
            response.put("status", "rejected");

        } catch (Exception e) {
            logger.error("❌ Error procesando webhook: {}", e.getMessage());
            response.put("error", e.getMessage());
            response.put("status", "error");
        }

        return response;
    }

    /**
     * 💰 Maneja un pago exitoso - GUARDA EN BD
     */
    private Map<String, Object> handleSuccessfulPayment(Event event) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 1. Extraer el PaymentIntent del evento
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElseThrow(() -> new RuntimeException("No hay PaymentIntent"));

            String paymentId = paymentIntent.getId();
            logger.info("✅ PAGO EXITOSO detectado: {}", paymentId);

            // 2. Extraer METADATA que enviamos desde createP2PPayment
            Map<String, String> metadata = paymentIntent.getMetadata();

            String userId = metadata.get("user_id");
            String actividadId = metadata.get("actividad_id");

            logger.info("📊 Metadata extraída: user_id={}, actividad_id={}", userId, actividadId);

            // 3. Validar que tenemos la metadata necesaria
            if (userId == null || actividadId == null) {
                throw new IllegalArgumentException("Faltan datos en el pago. Metadata: " + metadata);
            }

            // 4. Buscar en nuestra base de datos
            Usuario usuario = usuarioRepository.findById(Long.parseLong(userId))
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

            Actividad actividad = actividadRepository.findById(Long.parseLong(actividadId))
                    .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + actividadId));

            logger.info("👤 Usuario encontrado: {}", usuario.getEmail());
            logger.info("🎯 Actividad encontrada: {}", actividad.getNombre());

            // 5. CREAR Y GUARDAR EL PAGO en tu entidad Pago
            Pago pago = new Pago();
            pago.setFecha(LocalDateTime.now()); // Fecha actual

            // Convertir de centavos a euros (Stripe usa centavos)
            double totalEnEuros = paymentIntent.getAmount() / 100.0;
            pago.setTotal(totalEnEuros);
            pago.setEstado(EstadoPago.COMPLETADO);
            pago.setStripePaymentId(paymentId);

            pago.setUsuario(usuario);
            pago.setActividad(actividad);

            // Guardar en la base de datos
            pagoRepository.save(pago);

            logger.info("💾 PAGO GUARDADO en BD - ID: {}, Total: {}€, Usuario: {}, Actividad: {}",
                    pago.getId(), pago.getTotal(), usuario.getEmail(), actividad.getNombre());

            // 6. Preparar respuesta de éxito
            result.put("status", "success");
            result.put("message", "Pago registrado exitosamente");
            result.put("pago_id", pago.getId());
            result.put("stripe_payment_id", paymentId);
            result.put("usuario_id", usuario.getId());
            result.put("actividad_id", actividad.getId());
            result.put("total", pago.getTotal());
            result.put("fecha", pago.getFecha());

        } catch (Exception e) {
            logger.error("💥 ERROR guardando pago: {}", e.getMessage(), e);
            result.put("status", "error");
            result.put("error", e.getMessage());
        }

        return result;
    }

    /**
     * ❌ Maneja un pago fallido - REGISTRA EL ERROR
     */
    private Map<String, Object> handleFailedPayment(Event event) {
        Map<String, Object> result = new HashMap<>();

        try {
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElseThrow(() -> new RuntimeException("No hay PaymentIntent"));

            String paymentId = paymentIntent.getId();
            logger.warn("❌ PAGO FALLIDO: {}", paymentId);

            // Extraer error
            String errorMessage = "Error desconocido";
            if (paymentIntent.getLastPaymentError() != null) {
                errorMessage = paymentIntent.getLastPaymentError().getMessage();
            }

            // Loggear detalles
            logPaymentFailureDetails(paymentIntent);

            // Extraer metadata
            Map<String, String> metadata = paymentIntent.getMetadata();
            String userId = metadata.get("user_id");
            String actividadId = metadata.get("actividad_id");

            if (userId != null && actividadId != null) {
                Usuario usuario = usuarioRepository.findById(Long.parseLong(userId)).orElse(null);
                Actividad actividad = actividadRepository.findById(Long.parseLong(actividadId)).orElse(null);

                // GUARDAR PAGO FALLIDO EN BD (si tu entidad tiene campo estado)
                Pago pagoFallido = new Pago();
                pagoFallido.setFecha(LocalDateTime.now());
                pagoFallido.setTotal(paymentIntent.getAmount() / 100.0);
                pagoFallido.setUsuario(usuario);
                pagoFallido.setActividad(actividad);
                pagoFallido.setEstado(EstadoPago.FALLIDO);
                pagoFallido.setErrorMensaje(errorMessage);
                pagoFallido.setStripePaymentId(paymentId);

                pagoRepository.save(pagoFallido);

                logger.warn("📝 Pago fallido guardado en BD - ID: {}", pagoFallido.getId());

                result.put("pago_id", pagoFallido.getId());
            }

            result.put("status", "processed");
            result.put("message", "Pago fallido registrado");
            result.put("stripe_payment_id", paymentId);
            result.put("error", errorMessage);

        } catch (Exception e) {
            logger.error("Error en handleFailedPayment: {}", e.getMessage());
            result.put("status", "error");
            result.put("error", e.getMessage());
        }

        return result;
    }

    /**
     * 🔍 Método auxiliar: Loggear detalles del pago fallido
     */
    private void logPaymentFailureDetails(PaymentIntent paymentIntent) {
        try {
            // Información útil para debug
            logger.warn("📋 Detalles del pago fallido:");
            logger.warn("   • ID: {}", paymentIntent.getId());
            logger.warn("   • Monto: {} {}",
                    paymentIntent.getAmount() / 100.0,
                    paymentIntent.getCurrency().toUpperCase());
            logger.warn("   • Estado: {}", paymentIntent.getStatus());
            logger.warn("   • Creado: {}", paymentIntent.getCreated());

            if (paymentIntent.getLastPaymentError() != null) {
                logger.warn("   • Tipo error: {}", paymentIntent.getLastPaymentError().getType());
                logger.warn("   • Código: {}", paymentIntent.getLastPaymentError().getCode());
                logger.warn("   • Declinación: {}", paymentIntent.getLastPaymentError().getDeclineCode());
                logger.warn("   • Mensaje: {}", paymentIntent.getLastPaymentError().getMessage());
            }

            // Metadata para contexto
            Map<String, String> metadata = paymentIntent.getMetadata();
            if (!metadata.isEmpty()) {
                logger.warn("   • Metadata: {}", metadata);
            }

        } catch (Exception e) {
            logger.error("Error loggeando detalles del pago fallido: {}", e.getMessage());
        }
    }
}