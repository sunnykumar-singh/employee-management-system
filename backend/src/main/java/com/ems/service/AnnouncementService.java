package com.ems.service;

import com.ems.dto.AnnouncementRequest;
import com.ems.dto.AnnouncementResponse;
import com.ems.dto.AnnouncementScheduleRequest;
import com.ems.dto.PageResponse;
import com.ems.entity.Announcement;
import com.ems.entity.AnnouncementStatus;
import com.ems.entity.Department;
import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AnnouncementRepository;
import com.ems.repository.AnnouncementSpecifications;
import com.ems.repository.DepartmentRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public AnnouncementResponse create(AnnouncementRequest request) {
        Announcement announcement = Announcement.builder()
                .announcementId(nextAnnouncementId())
                .title(request.getTitle().trim())
                .category(request.getCategory())
                .department(resolveDepartment(request.getDepartmentId()))
                .message(request.getMessage().trim())
                .build();
        applyStatus(announcement, request.getStatus() == null ? AnnouncementStatus.DRAFT : request.getStatus(), request.getScheduledAt());
        return AnnouncementResponse.from(announcementRepository.save(announcement));
    }

    @Transactional(readOnly = true)
    public PageResponse<AnnouncementResponse> list(String search, AnnouncementStatus status, Long departmentId, Pageable pageable) {
        Specification<Announcement> specification = Specification.<Announcement>unrestricted()
                .and(AnnouncementSpecifications.searchByTitle(search))
                .and(AnnouncementSpecifications.hasStatus(status))
                .and(AnnouncementSpecifications.hasDepartment(departmentId));

        Page<AnnouncementResponse> page =
                announcementRepository.findAll(specification, pageable).map(AnnouncementResponse::from);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public AnnouncementResponse getById(Long id) {
        return AnnouncementResponse.from(findAnnouncement(id));
    }

    @Transactional
    public AnnouncementResponse update(Long id, AnnouncementRequest request) {
        Announcement announcement = findAnnouncement(id);
        announcement.setTitle(request.getTitle().trim());
        announcement.setCategory(request.getCategory());
        announcement.setDepartment(resolveDepartment(request.getDepartmentId()));
        announcement.setMessage(request.getMessage().trim());
        if (request.getStatus() != null) {
            applyStatus(announcement, request.getStatus(), request.getScheduledAt());
        }
        return AnnouncementResponse.from(announcementRepository.save(announcement));
    }

    @Transactional
    public void delete(Long id) {
        Announcement announcement = findAnnouncement(id);
        announcementRepository.delete(announcement);
    }

    @Transactional
    public AnnouncementResponse publish(Long id) {
        Announcement announcement = findAnnouncement(id);
        if (announcement.getStatus() == AnnouncementStatus.ARCHIVED) {
            throw new BadRequestException("Archived announcements cannot be published");
        }
        if (announcement.getStatus() == AnnouncementStatus.PUBLISHED) {
            throw new BadRequestException("Announcement is already published");
        }
        applyStatus(announcement, AnnouncementStatus.PUBLISHED, null);
        return AnnouncementResponse.from(announcementRepository.save(announcement));
    }

    @Transactional
    public AnnouncementResponse schedule(Long id, AnnouncementScheduleRequest request) {
        Announcement announcement = findAnnouncement(id);
        if (announcement.getStatus() == AnnouncementStatus.ARCHIVED) {
            throw new BadRequestException("Archived announcements cannot be scheduled");
        }
        if (announcement.getStatus() == AnnouncementStatus.PUBLISHED) {
            throw new BadRequestException("Published announcements cannot be scheduled");
        }
        applyStatus(announcement, AnnouncementStatus.SCHEDULED, request.getScheduledAt());
        return AnnouncementResponse.from(announcementRepository.save(announcement));
    }

    @Transactional
    public AnnouncementResponse archive(Long id) {
        Announcement announcement = findAnnouncement(id);
        if (announcement.getStatus() == AnnouncementStatus.ARCHIVED) {
            throw new BadRequestException("Announcement is already archived");
        }
        applyStatus(announcement, AnnouncementStatus.ARCHIVED, null);
        return AnnouncementResponse.from(announcementRepository.save(announcement));
    }

    private void applyStatus(Announcement announcement, AnnouncementStatus status, Instant scheduledAt) {
        Instant now = Instant.now();
        announcement.setStatus(status);

        switch (status) {
            case DRAFT -> {
                announcement.setScheduledAt(null);
                announcement.setPublishedAt(null);
                announcement.setArchivedAt(null);
            }
            case SCHEDULED -> {
                Instant scheduleTime = scheduledAt == null ? announcement.getScheduledAt() : scheduledAt;
                if (scheduleTime == null || !scheduleTime.isAfter(now)) {
                    throw new BadRequestException("Scheduled date and time must be in the future");
                }
                announcement.setScheduledAt(scheduleTime);
                announcement.setPublishedAt(null);
                announcement.setArchivedAt(null);
            }
            case PUBLISHED -> {
                announcement.setPublishedAt(now);
                announcement.setScheduledAt(null);
                announcement.setArchivedAt(null);
            }
            case ARCHIVED -> {
                announcement.setArchivedAt(now);
                if (announcement.getPublishedAt() == null) {
                    announcement.setPublishedAt(now);
                }
            }
        }
    }

    private String nextAnnouncementId() {
        long next = announcementRepository.count() + 1;
        String candidate;
        do {
            candidate = "ANN" + String.format("%03d", next++);
        } while (announcementRepository.existsByAnnouncementIdIgnoreCase(candidate));
        return candidate;
    }

    private Announcement findAnnouncement(Long id) {
        return announcementRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository
                .findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
    }
}
