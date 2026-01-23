package com.Up2Play.backend.Service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.Up2Play.backend.Model.Actividad;
import com.Up2Play.backend.Model.Pago;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.ActividadRepository;
import com.Up2Play.backend.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
    private PagoService pagoService;

    public Map<String, Object> processWebhook(String payload, String signature) {
        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Recibiendo webhook de Stripe...");

            Event event = Webhook.constructEvent(payload, signature, webhookSecret);

            String eventType = event.getType();
            logger.info("Evento válido: {}", eventType);

            switch (eventType) {
                case "payment_intent.succeeded":
                    return handleSuccessfulPayment(event);

                case "payment_intent.payment_failed":
                    return handleFailedPayment(event);

                case "charge.refunded":
                    return handleChargeRefunded(event);

                default:
                    logger.info("Evento ignorado: {}", eventType);
                    response.put("status", "ignored");
                    response.put("event_type", eventType);
                    return response;
            }

        } catch (SignatureVerificationException e) {
            logger.error("FIRMA INVÁLIDA: Alguien está intentando falsificar un webhook!");
            response.put("error", "Firma inválida");
            response.put("status", "rejected");

        } catch (Exception e) {
            logger.error("Error procesando webhook: {}", e.getMessage());
            response.put("error", e.getMessage());
            response.put("status", "error");
        }

        return response;
    }

    private Map<String, Object> handleSuccessfulPayment(Event event) {
        Map<String, Object> result = new HashMap<>();

        try {

            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElseThrow(() -> new RuntimeException("No hay PaymentIntent"));

            String paymentId = paymentIntent.getId();
            logger.info("PAGO EXITOSO detectado: {}", paymentId);

            Map<String, String> metadata = paymentIntent.getMetadata();

            String userId = metadata.get("user_id");
            String actividadId = metadata.get("actividad_id");

            logger.info("Metadata extraída: user_id={}, actividad_id={}", userId, actividadId);

            if (userId == null || actividadId == null) {
                throw new IllegalArgumentException("Faltan datos en el pago. Metadata: " + metadata);
            }

            Usuario usuario = usuarioRepository.findById(Long.parseLong(userId))
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

            Actividad actividad = actividadRepository.findById(Long.parseLong(actividadId))
                    .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + actividadId));

            double totalEnEuros = paymentIntent.getAmount() / 100.0;

            Pago pago = pagoService.crearPagoSucceded(totalEnEuros, usuario, actividad, paymentId);

            logger.info("PAGO GUARDADO en BD - ID: {}, Total: {}€, Usuario: {}, Actividad: {}",
                    pago.getId(), pago.getTotal(), usuario.getEmail(), actividad.getNombre());

            result.put("status", "success");
            result.put("message", "Pago registrado exitosamente");
            result.put("pago_id", pago.getId());
            result.put("stripe_payment_id", paymentId);
            result.put("usuario_id", usuario.getId());
            result.put("actividad_id", actividad.getId());
            result.put("total", pago.getTotal());
            result.put("fecha", pago.getFecha());

        } catch (Exception e) {
            logger.error("ERROR guardando pago: {}", e.getMessage(), e);
            result.put("status", "error");
            result.put("error", e.getMessage());
        }

        return result;
    }

    private Map<String, Object> handleFailedPayment(Event event) {
        Map<String, Object> result = new HashMap<>();

        try {
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElseThrow(() -> new RuntimeException("No hay PaymentIntent"));

            String paymentId = paymentIntent.getId();
            logger.warn("PAGO FALLIDO: {}", paymentId);

            String errorMessage = "Error desconocido";
            if (paymentIntent.getLastPaymentError() != null) {
                errorMessage = paymentIntent.getLastPaymentError().getMessage();
            }

            logPaymentFailureDetails(paymentIntent);

            Map<String, String> metadata = paymentIntent.getMetadata();
            String userId = metadata.get("user_id");
            String actividadId = metadata.get("actividad_id");

            if (userId != null && actividadId != null) {
                Usuario usuario = usuarioRepository.findById(Long.parseLong(userId)).orElse(null);
                Actividad actividad = actividadRepository.findById(Long.parseLong(actividadId)).orElse(null);

                double totalEnEuros = paymentIntent.getAmount() / 100.0;

                Pago pagoFallido = pagoService.crearPagoFailed(totalEnEuros, usuario, actividad, paymentId,
                        errorMessage);

                logger.warn("Pago fallido guardado en BD - ID: {}", pagoFallido.getId());

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

    private void logPaymentFailureDetails(PaymentIntent paymentIntent) {
        try {

            logger.warn("Detalles del pago fallido:");
            logger.warn(" ID: {}", paymentIntent.getId());
            logger.warn(" Monto: {} {}",
                    paymentIntent.getAmount() / 100.0,
                    paymentIntent.getCurrency().toUpperCase());
            logger.warn(" Estado: {}", paymentIntent.getStatus());
            logger.warn(" Creado: {}", paymentIntent.getCreated());

            if (paymentIntent.getLastPaymentError() != null) {
                logger.warn(" Tipo error: {}", paymentIntent.getLastPaymentError().getType());
                logger.warn(" Código: {}", paymentIntent.getLastPaymentError().getCode());
                logger.warn(" Declinación: {}", paymentIntent.getLastPaymentError().getDeclineCode());
                logger.warn(" Mensaje: {}", paymentIntent.getLastPaymentError().getMessage());
            }

            Map<String, String> metadata = paymentIntent.getMetadata();
            if (!metadata.isEmpty()) {
                logger.warn(" Metadata: {}", metadata);
            }

        } catch (Exception e) {
            logger.error("Error loggeando detalles del pago fallido: {}", e.getMessage());
        }
    }

    private Map<String, Object> handleChargeRefunded(Event event) {
        Map<String, Object> result = new HashMap<>();

        try {
            com.stripe.model.Charge charge = (com.stripe.model.Charge) event.getDataObjectDeserializer()
                    .getObject().orElseThrow(() -> new RuntimeException("No hay Charge en el evento"));

            String chargeId = charge.getId();
            String paymentIntentId = charge.getPaymentIntent();

            logger.info("REEMBOLSO COMPLETADO para charge: {}", chargeId);
            logger.info(" PaymentIntent asociado: {}", paymentIntentId);

            if (charge.getRefunds() == null || charge.getRefunds().getData() == null
                    || charge.getRefunds().getData().isEmpty()) {
                logger.warn("⚠️ Charge {} no tiene reembolsos en la lista", chargeId);

                double amountRefunded = charge.getAmountRefunded() / 100.0;

                Pago pagoOriginal = pagoService.buscarPagoPorStripeId(paymentIntentId);

                if (pagoOriginal != null) {
                    Pago pagoReembolsado = pagoService.crearPagoReembolsado(
                            amountRefunded,
                            pagoOriginal.getUsuario(),
                            pagoOriginal.getActividad(),
                            "no_refund_id_" + System.currentTimeMillis(),
                            "Refund completed");

                    logger.info("Pago reembolsado creado sin refundId específico");
                    result.put("status", "success");
                    result.put("pago_id", pagoReembolsado.getId());
                    return result;
                }
            }

            String refundId = null;
            double amountRefunded = 0;
            String reason = "unknown";

            if (charge.getRefunds() != null && charge.getRefunds().getData() != null
                    && !charge.getRefunds().getData().isEmpty()) {
                com.stripe.model.Refund refund = charge.getRefunds().getData().get(0);
                refundId = refund.getId();
                amountRefunded = refund.getAmount() / 100.0;
                reason = refund.getReason() != null ? refund.getReason() : "unknown";

                logger.info(" Refund ID: {}", refundId);
            } else {
                amountRefunded = charge.getAmountRefunded() / 100.0;
                refundId = "charge_refunded_" + chargeId;
                logger.info(" Usando amount_refunded de la charge: {}€", amountRefunded);
            }

            logger.info(" Monto reembolsado: {}€", amountRefunded);
            logger.info(" Razón: {}", reason);

            Pago pagoOriginal = pagoService.buscarPagoPorStripeId(paymentIntentId);

            if (pagoOriginal == null) {
                logger.error("No se encontró pago en BD para PaymentIntent: {}", paymentIntentId);
                result.put("status", "error");
                result.put("message", "Pago original no encontrado");
                return result;
            }

            logger.info("Pago original encontrado - ID BD: {}, Usuario: {}",
                    pagoOriginal.getId(), pagoOriginal.getUsuario().getEmail());

            Pago pagoReembolsado = pagoService.crearPagoReembolsado(
                    amountRefunded,
                    pagoOriginal.getUsuario(),
                    pagoOriginal.getActividad(),
                    refundId,
                    reason);

            logger.info("PAGO REEMBOLSADO guardado. ID BD: {}, Monto: {}€",
                    pagoReembolsado.getId(), amountRefunded);

            pagoService.marcarPagoComoReembolsado(pagoOriginal.getId(), refundId);

            result.put("status", "success");
            result.put("message", "Reembolso registrado exitosamente");
            result.put("pago_reembolsado_id", pagoReembolsado.getId());
            result.put("pago_original_id", pagoOriginal.getId());
            result.put("refund_id", refundId);
            result.put("amount_refunded", amountRefunded);
            result.put("reason", reason);

        } catch (Exception e) {
            logger.error("ERROR en handleChargeRefunded: {}", e.getMessage(), e);
            result.put("status", "error");
            result.put("error", e.getMessage());
        }

        return result;
    }

}