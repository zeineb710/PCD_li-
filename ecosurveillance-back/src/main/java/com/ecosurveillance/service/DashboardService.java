package com.ecosurveillance.service;

import com.ecosurveillance.dto.DashboardStatsDTO;
import com.ecosurveillance.dto.EtudiantListDTO;
import com.ecosurveillance.entity.Infraction;
import com.ecosurveillance.entity.PunitionAssignee;
import com.ecosurveillance.enums.Role;
import com.ecosurveillance.enums.StatusInfraction;
import com.ecosurveillance.repository.CameraRepository;
import com.ecosurveillance.repository.InfractionRepository;
import com.ecosurveillance.repository.PunitionAssigneeRepository;
import com.ecosurveillance.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    @Autowired
    private final InfractionRepository infractionRepository;
    private final UserRepository userRepository;
    private final CameraRepository cameraRepository;
    private final PunitionAssigneeRepository punitionAssigneeRepository;

    // =========================
    // STATS ADMIN
    // =========================
    public DashboardStatsDTO getAdminStats() {

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();

        DashboardStatsDTO stats = new DashboardStatsDTO();

        // ✅ total infractions (optimisé)
        stats.setTotalInfractions(infractionRepository.count());

        // ✅ infractions aujourd’hui
        stats.setInfractionsAujourdhui(
                infractionRepository.countByInfractionDateAfter(startOfDay)
        );

        // ✅ total étudiants
        stats.setTotalEtudiants(
                userRepository.countByRole(Role.ETUDIANT)
        );

        // ✅ total punitions
        stats.setTotalPunitions(
                punitionAssigneeRepository.count()
        );

        // ✅ punitions aujourd’hui (optimisé via repo)
        stats.setPunitionsAujourdhui(
                punitionAssigneeRepository.countByInfraction_InfractionDateAfter(startOfDay)
        );

        // ✅ punitions terminées (optimisé)
        stats.setPunitionsTerminees(
                punitionAssigneeRepository.countByStatut("TERMINEE")
        );

        // ✅ caméras actives
        stats.setCamerasActives(
                cameraRepository.countByActive(true)
        );

        return stats;
    }

    // =========================
    // LISTE ÉTUDIANTS
    // =========================
    public List<EtudiantListDTO> getEtudiantsList() {

        return userRepository.findByRole(Role.ETUDIANT).stream()
                .map(etudiant -> {

                    EtudiantListDTO dto = new EtudiantListDTO();
                    dto.setNom(etudiant.getNom());
                    dto.setEmail(etudiant.getEmail());

                    List<Infraction> infractions = infractionRepository.findByEtudiant(etudiant);
                    dto.setInfractions((long) infractions.size());

                    // récupérer la dernière punition assignée
                    infractions.stream().findFirst().ifPresent(firstInfraction -> {
                        PunitionAssignee punition = punitionAssigneeRepository
                                .findByInfraction(firstInfraction)
                                .orElse(null);
                        if (punition != null) {
                            dto.setDernierePunition(punition.getPunition().getDescription());
                        }
                    });

                    return dto;
                })
                .collect(Collectors.toList());
    }
    public Map<String, Long> getStatsByStatus() {
        Map<String, Long> result = new HashMap<>();
        List<Object[]> rows = infractionRepository.countByStatus();
        for (Object[] row : rows) {
            String status = row[0].toString().toLowerCase().replace(" ", "_");
            Long count = ((Number) row[1]).longValue();
            result.put(status, count);
        }
        return result;
    }

    public List<Map<String, Object>> getEvolutionSixMois() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Object[]> rows = infractionRepository.evolutionSixMois();
        for (Object[] row : rows) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("mois", row[0]);
            entry.put("total", ((Number) row[1]).longValue());
            result.add(entry);
        }
        return result;
    }
}