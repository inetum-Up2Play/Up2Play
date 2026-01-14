package com.Up2Play.backend.Controller;

import com.Up2Play.backend.DTO.CreateAccountRequest;
import com.Up2Play.backend.DTO.CreatePaymentRequest;
import com.Up2Play.backend.Exception.ErroresUsuario.UsuarioNoEncontradoException;
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;
import com.Up2Play.backend.Service.StripeConnectService;
import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
public class StripeConnectController {

    private StripeConnectService stripeConnectService;

    private UsuarioRepository usuarioRepository;

    public StripeConnectController(StripeConnectService stripeConnectService, UsuarioRepository usuarioRepository) {
        this.stripeConnectService = stripeConnectService;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Endpoint para crear una cuenta Connect
     */
    @PostMapping("/accounts")
    public ResponseEntity<?> createConnectAccount(@AuthenticationPrincipal UserDetails principal,
            @RequestBody CreateAccountRequest request) {
        try {

            String email = principal.getUsername();
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));
            Map<String, Object> accountResult = stripeConnectService.createConnectAccount(
                    request.getEmail(),
                    request.getCountry(), usuario);
            String accountId = (String) accountResult.get("accountId");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("accountId", accountId);
            response.put("message", "Cuenta Connect creada exitosamente");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "error", e.getMessage()));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("success", false, "error", "Error de Stripe: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para obtener enlace de onboarding
     */
    @GetMapping("/onboarding-link")

    public ResponseEntity<?> getOnboardingLink(@AuthenticationPrincipal UserDetails principal) {

        try {

            Usuario usuario = usuarioRepository.findByEmail(principal.getUsername())

                    .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

            String stripeId = usuario.getStripeAccountId();
            if (stripeId == null || stripeId.isEmpty()) {

                Map<String, Object> accountResult = stripeConnectService.createConnectAccount(usuario.getEmail(), "ES",
                        usuario);
                stripeId = (String) accountResult.get("accountId");
            }

            Map<String, String> accountLinkMap = stripeConnectService.createAccountLink(stripeId);

            return ResponseEntity.ok(Map.of(

                    "success", true,

                    "onboardingUrl", accountLinkMap.get("url")

            ));

        } catch (StripeException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));

        }

    }

    /**
     * Este es el método que usarás para el pago embebido en Angular.
     * Crea la intención de pago pero NO lo confirma todavía.
     */
    @PostMapping("/payments/payment-intent")
    public ResponseEntity<?> createP2PPayment(@RequestBody CreatePaymentRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        try {
            // Validación preventiva
            if (request.getActividadId() == null || request.getAmount() == null) {
                return ResponseEntity.badRequest().body("Faltan datos: idActividad o monto");
            }

            Usuario usuario = usuarioRepository.findByEmail(principal.getUsername())
                    .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

            // Llamamos al service con los parámetros corregidos para Direct Charge
            Map<String, Object> paymentIntent = stripeConnectService.createP2PPayment(
                    request.getAmount(),
                    request.getCurrency(),
                    request.getConnectedAccountId(),
                    request.getCustomerEmail(),
                    usuario.getId(),
                    request.getActividadId());

            return ResponseEntity.ok(paymentIntent);
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check-status")
    public ResponseEntity<?> checkStripeStatus(@AuthenticationPrincipal UserDetails principal) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(principal.getUsername())
                    .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado"));

            if (usuario.getStripeAccountId() == null) {
                return ResponseEntity.ok(Map.of("pagosHabilitados", false));
            }

            // Sincroniza con Stripe
            stripeConnectService.verificarYActualizarEstadoPagos(usuario.getStripeAccountId());

            // Refrescamos el objeto usuario de la base de datos
            Usuario usuarioActualizado = usuarioRepository.findById(usuario.getId()).get();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "pagosHabilitados", usuarioActualizado.getPagosHabilitados()));

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error de Stripe: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para consultar el estado de una cuenta
     */
    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<?> getAccount(@PathVariable String accountId) {
        try {
            Map<String, Object> account = stripeConnectService.retrieveAccount(accountId);

            Map<String, Object> response = new HashMap<>(account);
            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "error", e.getMessage()));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("success", false, "error", "Error de Stripe: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para calcular comisiones (útil para el frontend)
     */
    @GetMapping("/calculate-fee")
    public ResponseEntity<?> calculateFee(@RequestParam Long amount) {
        try {
            Long fee = stripeConnectService.calculatePlatformFee(amount);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("amount", amount);
            response.put("fee", fee);
            response.put("netAmount", amount - fee);
            response.put("feePercentage", "5%");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("success", false, "error", e.getMessage()));
        }
    }

    /**
     * Endpoints para redirección (configurados en las URLs de Stripe)
     */
    @GetMapping("/return")
    public ResponseEntity<?> handleReturn() {
        // Aquí rediriges al usuario a una página de éxito en tu frontend
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Onboarding completado exitosamente");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reauth")
    public ResponseEntity<?> handleReauth() {
        // Aquí manejas cuando el usuario necesita reautenticarse
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Necesitas completar la autenticación");
        return ResponseEntity.ok(response);
    }
}