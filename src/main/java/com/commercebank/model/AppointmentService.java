package com.commercebank.model;

public class AppointmentService {
    private int serviceId;
    private int appointmentId;

    public AppointmentService(int serviceId, int appointmentId) {
        this.serviceId = serviceId;
        this.appointmentId = appointmentId;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }
}
