package com.Up2Play.backend.DTO;

public class CreatePaymentRequest {

    private Long amount; // en centavos
    private String currency; // "eur", "usd", etc.
    private String connectedAccountId;
    private String customerEmail;
    private Long applicationFee; // opcional
    private Long actividadId; // ID de la actividad asociada al pago

    public Long getAmount() {
        return amount;
    }

    public Long getActividadId() {
        return actividadId;
    }

    public void setActividadId(Long actividadId) {
        this.actividadId = actividadId;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getConnectedAccountId() {
        return connectedAccountId;
    }

    public void setConnectedAccountId(String connectedAccountId) {
        this.connectedAccountId = connectedAccountId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Long getApplicationFee() {
        return applicationFee;
    }

    public void setApplicationFee(Long applicationFee) {
        this.applicationFee = applicationFee;
    }

}
