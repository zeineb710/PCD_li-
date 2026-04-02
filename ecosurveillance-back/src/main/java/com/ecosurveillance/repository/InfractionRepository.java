package com.ecosurveillance.repository;

import com.ecosurveillance.entity.Infraction;
import com.ecosurveillance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.ecosurveillance.enums.StatusInfraction;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InfractionRepository extends JpaRepository<Infraction, Long> {

    List<Infraction> findByEtudiant(User etudiant);
    long countByInfractionDateAfter(LocalDateTime date);
    List<Infraction> findByEtudiantAndInfractionDateAfter(User etudiant, LocalDateTime date);
    List<Infraction> findByStatus(StatusInfraction status);

    long countBy();
    @Query("SELECT i.status, COUNT(i) FROM Infraction i GROUP BY i.status")
    List<Object[]> countByStatus();

    // ✅ Évolution sur 6 mois (utilisez infractionDate car c'est votre champ existant)
    @Query(value = """
        SELECT DATE_FORMAT(i.infraction_date, '%b') as mois,
               COUNT(*) as total
        FROM infraction i
        WHERE i.infraction_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(i.infraction_date, '%Y-%m'), DATE_FORMAT(i.infraction_date, '%b')
        ORDER BY MIN(i.infraction_date)
        """, nativeQuery = true)
    List<Object[]> evolutionSixMois();

}