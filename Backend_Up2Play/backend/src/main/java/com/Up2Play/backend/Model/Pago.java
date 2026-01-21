package com.Up2Play.backend.Model;

import java.time.LocalDateTime;

import com.Up2Play.backend.Model.converter.EstadoActividadConverter;
import com.Up2Play.backend.Model.converter.EstadoPagoConverter;
import com.Up2Play.backend.Model.enums.EstadoPago;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PAGO")
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(name = "fecha_pago")
    private LocalDateTime fecha;

    private double total;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_actividad", nullable = false)
    private Actividad actividad;

    @Convert(converter = EstadoPagoConverter.class)
    private EstadoPago estado;

    @Column(name = "error_mensaje", length = 500)
    private String errorMensaje;

    @Column(name = "stripe_payment_id")
    private String stripePaymentId;

    private String stripeRefundId;

    public Pago() {
    }

    public Pago(Long id, LocalDateTime fecha, double total, Usuario usuario, Actividad actividad) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.usuario = usuario;
        this.actividad = actividad;

    }

    public Pago(LocalDateTime fecha, double total, Usuario usuario, Actividad actividad) {
        this.fecha = fecha;
        this.total = total;
        this.usuario = usuario;
        this.actividad = actividad;

    }

    public Pago(Long id, LocalDateTime fecha, double total, Usuario usuario, Actividad actividad, EstadoPago estado,
            String errorMensaje, String stripePaymentId) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.usuario = usuario;
        this.actividad = actividad;
        this.estado = estado;
        this.errorMensaje = errorMensaje;
        this.stripePaymentId = stripePaymentId;
    }

    public Pago(Long id, LocalDateTime fecha, double total, Usuario usuario, Actividad actividad, EstadoPago estado,
            String errorMensaje, String stripePaymentId, String stripeRefundId) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.usuario = usuario;
        this.actividad = actividad;
        this.estado = estado;
        this.errorMensaje = errorMensaje;
        this.stripePaymentId = stripePaymentId;
        this.stripeRefundId = stripeRefundId;
    }

    public EstadoPago getEstado() {
        return estado;
    }

    public void setEstado(EstadoPago estado) {
        this.estado = estado;
    }

    public String getErrorMensaje() {
        return errorMensaje;
    }

    public void setErrorMensaje(String errorMensaje) {
        this.errorMensaje = errorMensaje;
    }

    public String getStripePaymentId() {
        return stripePaymentId;
    }

    public void setStripePaymentId(String stripePaymentId) {
        this.stripePaymentId = stripePaymentId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Actividad getActividad() {
        return actividad;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
    }

    public String getStripeRefundId() {
        return stripeRefundId;
    }

    public void setStripeRefundId(String stripeRefundId) {
        this.stripeRefundId = stripeRefundId;
    }

}
