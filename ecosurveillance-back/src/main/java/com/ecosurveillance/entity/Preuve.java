// package com.ecosurveillance.entity;

// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.ManyToOne;
// import lombok.Getter;
// import lombok.Setter;
// import jakarta.persistence.Id;

// @Entity
// @Getter
// @Setter
// public class Preuve {

//     @Id
//     @GeneratedValue
//     private Long id;

//     private String imageUrl;
//     private String videoUrl;

//     @ManyToOne
//     private Infraction infraction;
// }

package com.ecosurveillance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "preuves")
@Getter
@Setter

public class Preuve {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;   // chemin fichier photo, ex: "alertes/123_photo.jpg"
    private String videoUrl;   // chemin fichier vidéo, ex: "alertes/123_clip.mp4"

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "infraction_id")
    private Infraction infraction;
}