package com.Up2Play.backend.DTO;

public class DirectChargeRequest {

    private Long amount;
    private String currency;
    private String sourceToken; // token de Stripe.js
    private String connectedAccountId;
    private Long applicationFee;
    private String description;

    public Long getAmount() {
        return amount;
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

    public String getSourceToken() {
        return sourceToken;
    }

    public void setSourceToken(String sourceToken) {
        this.sourceToken = sourceToken;
    }

    public String getConnectedAccountId() {
        return connectedAccountId;
    }

    public void setConnectedAccountId(String connectedAccountId) {
        this.connectedAccountId = connectedAccountId;
    }

    public Long getApplicationFee() {
        return applicationFee;
    }

    public void setApplicationFee(Long applicationFee) {
        this.applicationFee = applicationFee;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
