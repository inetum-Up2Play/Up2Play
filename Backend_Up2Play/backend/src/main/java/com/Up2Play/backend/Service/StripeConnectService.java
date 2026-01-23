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
 

    public void verificarYActualizarEstadoPagos(String stripeAccountId) throws StripeException {

        Account account = Account.retrieve(stripeAccountId);
 
        if (account.getChargesEnabled()) {
            Usuario usuario = usuarioRepository.findByStripeAccountId(stripeAccountId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado para ese ID de Stripe"));
            if (!usuario.getPagosHabilitados()) {
                usuario.setPagosHabilitados(true);
                usuarioRepository.save(usuario);
            }
        }
    }

    public Map<String, Object> createConnectAccount(String email, String country, Usuario usuario)
            throws StripeException {

        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (country == null || country.length() != 2) {
            throw new IllegalArgumentException("El país debe ser un código de dos letras");
        }
 
        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS)
                .setCountry(country.toUpperCase())
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
                .putMetadata("app_user_email", email)
                .putMetadata("created_via", "up2play_backend")
                .build();
 
        Account account = Account.create(params);
 
        usuario.setStripeAccountId(account.getId());
        usuarioRepository.save(usuario);

        Map<String, Object> result = new HashMap<>();
        result.put("accountId", account.getId());
        result.put("email", account.getEmail());
        result.put("country", account.getCountry());
        result.put("type", account.getType());
        result.put("chargesEnabled", account.getChargesEnabled());
        result.put("detailsSubmitted", account.getDetailsSubmitted());
 
        return result;
    }
 
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
 
    public Map<String, Object> createP2PPayment(Long amount, String currency,
            String connectedAccountId,
            String customerEmail,
            Long userId,
            Long actividadId)
            throws StripeException {

        if (amount == null || amount <= 0)
            throw new IllegalArgumentException("Monto inválido");
        if (connectedAccountId == null)
            throw new IllegalArgumentException("Falta ID de cuenta del vendedor");
 

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency != null ? currency.toLowerCase() : "eur")
                .setReceiptEmail(customerEmail)
                .putMetadata("user_id", userId.toString())
                .putMetadata("actividad_id", actividadId.toString())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build())
                .build();
 
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
 

    public String crearReembolso(String paymentIntentId, String connectedAccountId) throws StripeException {
        if (paymentIntentId == null || connectedAccountId == null) {
            throw new IllegalArgumentException(
                    "El ID de pago y el ID de cuenta conectada son obligatorios para el reembolso.");
        }
 

        RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(paymentIntentId)
                .build();
 

        RequestOptions requestOptions = RequestOptions.builder()
                .setStripeAccount(connectedAccountId)
                .build();
 
        Refund refund = Refund.create(params, requestOptions);
 
        return refund.getId();
    }

    public Long calculatePlatformFee(Long amount) {
        long fee = amount * 5 / 100;
        return Math.max(50, Math.min(fee, 500));
    }
 
    
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