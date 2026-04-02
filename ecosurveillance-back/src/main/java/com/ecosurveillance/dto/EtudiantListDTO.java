package com.ecosurveillance.dto;

import lombok.Data;

@Data
public class EtudiantListDTO {
    private String nom;
    private String email;
    private Long infractions;
    private String dernierePunition;
}