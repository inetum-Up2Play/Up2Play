package com.Up2Play.backend.Service;

import com.Up2Play.backend.Model.Usuario;
import com.Up2Play.backend.Repository.UsuarioRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.PaymentIntent;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
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

    // Lista de métodos de pago por defecto
    private static final List<String> DEFAULT_PAYMENT_METHOD_TYPES = Arrays.asList("card");

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
     * Crea un pago P2P usando PaymentIntent.
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
            Long applicationFee,
            Long userId, // ← NUEVO PARÁMETRO
            Long actividadId) // ← NUEVO PARÁMETRO
            throws StripeException {

        validatePaymentParameters(amount, currency, connectedAccountId);

        // Calcular comisión (ej: 5%)
        Long actualFee = (applicationFee != null && applicationFee > 0)
                ? applicationFee
                : calculatePlatformFee(amount);

        // Monto que irá al vendedor (total - comisión)
        Long transferAmount = amount - actualFee;

        // ✅ CORREGIDO: Usa setTransferData en lugar de RequestOptions
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency.toLowerCase())
                .addAllPaymentMethodType(DEFAULT_PAYMENT_METHOD_TYPES)

                // ✅ TRANSFERENCIA AUTOMÁTICA al vendedor
                .setTransferData(
                        PaymentIntentCreateParams.TransferData.builder()
                                .setDestination(connectedAccountId)
                                .setAmount(transferAmount) // Monto que recibe el vendedor
                                .build())

                // Comisión que se queda la plataforma
                .setApplicationFeeAmount(actualFee)

                // ✅ METADATA CRÍTICA para el webhook
                .putMetadata("user_id", userId.toString())
                .putMetadata("actividad_id", actividadId.toString())
                .putMetadata("connected_account_id", connectedAccountId)
                .putMetadata("platform_fee", actualFee.toString())
                .putMetadata("transfer_amount", transferAmount.toString())
                .putMetadata("app", "up2play")

                .setReceiptEmail(customerEmail)
                .build();

        // ✅ CORREGIDO: Se crea en TU cuenta de plataforma (sin RequestOptions)
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        Map<String, Object> result = new HashMap<>();
        result.put("paymentIntentId", paymentIntent.getId());
        result.put("clientSecret", paymentIntent.getClientSecret());
        result.put("status", paymentIntent.getStatus());
        result.put("connectedAccountId", connectedAccountId);
        result.put("amount", amount);
        result.put("platformFee", actualFee);
        result.put("transferAmount", transferAmount);

        return result;
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

    /**
     * Valida los parámetros comunes para pagos.
     */
    private void validatePaymentParameters(Long amount, String currency, String connectedAccountId) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("El amount debe ser mayor que 0");
        }
        if (currency == null || currency.isEmpty()) {
            throw new IllegalArgumentException("La currency es obligatoria");
        }
        if (connectedAccountId == null || connectedAccountId.isEmpty()) {
            throw new IllegalArgumentException("El connectedAccountId es obligatorio");
        }
        // Validación adicional: el ID debe comenzar con "acct_"
        if (!connectedAccountId.startsWith("acct_")) {
            throw new IllegalArgumentException("Formato de accountId inválido");
        }
    }

    /**
     * Método simplificado para crear pago (sobrecarga útil)
     */
    public Map<String, Object> createP2PPayment(Long amount, String currency,
            String connectedAccountId) throws StripeException {
        return createP2PPayment(amount, currency, connectedAccountId, null, null, amount, amount);
    }
}