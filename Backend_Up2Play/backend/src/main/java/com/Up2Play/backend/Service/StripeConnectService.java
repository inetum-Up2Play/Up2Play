package com.Up2Play.backend.Service;
 
import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.net.RequestOptions;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
 
import jakarta.annotation.PostConstruct;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
 
import java.util.Map;
import java.util.HashMap;
 
@Service
public class StripeConnectService {
 
    @Value("${stripe.secret.key}")
    private String secretKey;
 
    @Value("${stripe.connect.refresh-url}")
    private String refreshUrl;
 
    @Value("${stripe.connect.return-url}")
    private String returnUrl;
 
    @Autowired
    private UsuarioRepository usuarioRepository;
 
    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }
 
    /**
     * Sincroniza el estado de la cuenta de Stripe con nuestra base de datos.
     * Se debe llamar cuando recibimos un webhook o cuando el usuario vuelve al
     * perfil.
     */
    public void verificarYActualizarEstadoPagos(String stripeAccountId) throws StripeException {
        // 1. Consultamos el estado real en los servidores de Stripe
        Account account = Account.retrieve(stripeAccountId);
 
        // 2. Comprobamos si Stripe ya le permite realizar cargos
        // chargesEnabled es true si ha pasado el onboarding y validaciones
        if (account.getChargesEnabled()) {
            Usuario usuario = usuarioRepository.findByStripeAccountId(stripeAccountId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado para ese ID de Stripe"));
            if (!usuario.getPagosHabilitados()) {
                usuario.setPagosHabilitados(true);
                usuarioRepository.save(usuario);
            }
        }
    }
 
    /**
     * Crea una cuenta Connect Express para un usuario.
     *
     * @param email   Correo electrónico del usuario
     * @param country Código de país de dos letras (ej: "ES", "US")
     * @return Map con información de la cuenta creada
     * @throws StripeException Si ocurre un error en Stripe
     */
    public Map<String, Object> createConnectAccount(String email, String country, Usuario usuario)
            throws StripeException {
        // Validación básica
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (country == null || country.length() != 2) {
            throw new IllegalArgumentException("El país debe ser un código de dos letras");
        }
 
        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS)
                .setCountry(country.toUpperCase()) // Asegurar mayúsculas
                .setEmail(email)
                .setCapabilities(
                        AccountCreateParams.Capabilities.builder()
                                .setCardPayments(
                                        AccountCreateParams.Capabilities.CardPayments.builder()
                                                .setRequested(true)
                                                .build())
                                .setTransfers(
                                        AccountCreateParams.Capabilities.Transfers.builder()
                                                .setRequested(true)
                                                .build())
                                .build())
                // Agregar metadatos para identificar fácilmente
                .putMetadata("app_user_email", email)
                .putMetadata("created_via", "up2play_backend")
                .build();
 
        Account account = Account.create(params);
 
        usuario.setStripeAccountId(account.getId());
        usuarioRepository.save(usuario);
 
        // Retornar más información útil
        Map<String, Object> result = new HashMap<>();
        result.put("accountId", account.getId());
        result.put("email", account.getEmail());
        result.put("country", account.getCountry());
        result.put("type", account.getType());
        result.put("chargesEnabled", account.getChargesEnabled());
        result.put("detailsSubmitted", account.getDetailsSubmitted());
 
        return result;
    }
 
    /**
     * Genera un enlace de onboarding para que el usuario complete su cuenta
     * Connect.
     *
     * @param accountId El ID de la cuenta Connect
     * @return Map con la URL y tipo de enlace
     * @throws StripeException Si ocurre un error en Stripe
     */
    public Map<String, String> createAccountLink(String accountId) throws StripeException {
        if (accountId == null || accountId.isEmpty()) {
            throw new IllegalArgumentException("El accountId es obligatorio");
        }
 
        AccountLinkCreateParams params = AccountLinkCreateParams.builder()
                .setAccount(accountId)
                .setRefreshUrl(refreshUrl)
                .setReturnUrl(returnUrl)
                .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                .build();
 
        AccountLink accountLink = AccountLink.create(params);
 
        Map<String, String> result = new HashMap<>();
        result.put("url", accountLink.getUrl());
        result.put("expiresAt", String.valueOf(accountLink.getExpiresAt()));
        result.put("type", "onboarding");
 
        return result;
    }
 
    /**
     * Crea un pago Direct Charge.
     * El pago se crea directamente en la cuenta del vendedor. *
     *
     * @param amount             Monto en centavos
     * @param currency           Código de moneda (ej: "eur", "usd")
     * @param connectedAccountId ID de la cuenta Connect del destinatario
     * @param customerEmail      Email del cliente que realiza el pago (opcional)
     * @param applicationFee     Comisión de la plataforma (en centavos). Si es
     *                           null, se calcula automáticamente.
     * @return Map con información del pago
     * @throws StripeException Si ocurre un error en Stripe
     */
    public Map<String, Object> createP2PPayment(Long amount, String currency,
            String connectedAccountId,
            String customerEmail,
            Long userId,
            Long actividadId)
            throws StripeException {
 
        // 1. Validación para evitar Error 500 (NPE)
        if (amount == null || amount <= 0)
            throw new IllegalArgumentException("Monto inválido");
        if (connectedAccountId == null)
            throw new IllegalArgumentException("Falta ID de cuenta del vendedor");
 
        // 2. Parámetros del pago
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency != null ? currency.toLowerCase() : "eur")
                .setReceiptEmail(customerEmail)
                // Metadata para que tu Webhook sepa qué ha pasado al confirmar
                .putMetadata("user_id", userId.toString())
                .putMetadata("actividad_id", actividadId.toString())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build())
                .build();
 
        // 3. DIRECT CHARGE le dice a Stripe: "No crees este pago en Up2Play, créalo EN
        // LA CUENTA del vendedor"
        RequestOptions requestOptions = RequestOptions.builder()
                .setStripeAccount(connectedAccountId)
                .build();
 
        PaymentIntent paymentIntent = PaymentIntent.create(params, requestOptions);
 
        Map<String, Object> result = new HashMap<>();
        result.put("clientSecret", paymentIntent.getClientSecret());
        result.put("paymentIntentId", paymentIntent.getId());
        result.put("connectedAccountId", connectedAccountId); // Devolver para el frontend
 
        return result;
    }
 
    /**
     * Realiza un reembolso total de un pago específico.
     * * @param paymentIntentId El ID del pago original (pi_...)
     *
     * @param connectedAccountId El ID de la cuenta del organizador (acct_...)
     * @return El ID del reembolso creado
     * @throws StripeException Si el organizador no tiene saldo suficiente o el ID
     *                         es inválido
     */
    public String crearReembolso(String paymentIntentId, String connectedAccountId) throws StripeException {
        if (paymentIntentId == null || connectedAccountId == null) {
            throw new IllegalArgumentException(
                    "El ID de pago y el ID de cuenta conectada son obligatorios para el reembolso.");
        }
 
        // Configuración del reembolso
        RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(paymentIntentId)
                .build();
 
        // IMPORTANTE: Al ser Direct Charge, el reembolso debe ejecutarse EN LA CUENTA
        // del vendedor
        RequestOptions requestOptions = RequestOptions.builder()
                .setStripeAccount(connectedAccountId)
                .build();
 
        Refund refund = Refund.create(params, requestOptions);
 
        return refund.getId();
    }
 
    /**
     * Calcula la comisión de la plataforma.
     *
     * @param amount Monto en centavos
     * @return Comisión en centavos
     */
    public Long calculatePlatformFee(Long amount) {
        // Ejemplo: 5% de comisión, mínimo 50 céntimos y máximo 500 céntimos
        long fee = amount * 5 / 100;
        return Math.max(50, Math.min(fee, 500));
    }
 
    /**
     * Recupera la información de una cuenta Connect.
     *
     * @param accountId ID de la cuenta Connect
     * @return Map con información de la cuenta
     * @throws StripeException Si ocurre un error en Stripe
     */
    public Map<String, Object> retrieveAccount(String accountId) throws StripeException {
        if (accountId == null || accountId.isEmpty()) {
            throw new IllegalArgumentException("El accountId es obligatorio");
        }
 
        Account account = Account.retrieve(accountId);
 
        Map<String, Object> result = new HashMap<>();
        result.put("accountId", account.getId());
        result.put("email", account.getEmail());
        result.put("country", account.getCountry());
        result.put("type", account.getType());
        result.put("chargesEnabled", account.getChargesEnabled());
        result.put("payoutsEnabled", account.getPayoutsEnabled());
        result.put("detailsSubmitted", account.getDetailsSubmitted());
        result.put("defaultCurrency", account.getDefaultCurrency());
        result.put("created", account.getCreated());
 
        return result;
    }
}