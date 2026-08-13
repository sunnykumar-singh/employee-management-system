package com.ems.repository;

import com.ems.entity.Announcement;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AnnouncementRepository
        extends JpaRepository<Announcement, Long>, JpaSpecificationExecutor<Announcement> {

    @Override
    @EntityGraph(attributePaths = "department")
    Optional<Announcement> findById(Long id);

    @Override
    @EntityGraph(attributePaths = "department")
    Page<Announcement> findAll(Specification<Announcement> spec, Pageable pageable);

    boolean existsByAnnouncementIdIgnoreCase(String announcementId);
}
