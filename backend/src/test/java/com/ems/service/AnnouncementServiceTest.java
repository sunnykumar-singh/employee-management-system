package com.ems.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.AnnouncementRequest;
import com.ems.dto.AnnouncementScheduleRequest;
import com.ems.entity.Announcement;
import com.ems.entity.AnnouncementCategory;
import com.ems.entity.AnnouncementStatus;
import com.ems.entity.Department;
import com.ems.entity.DepartmentStatus;
import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AnnouncementRepository;
import com.ems.repository.DepartmentRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AnnouncementServiceTest {

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private AnnouncementService announcementService;

    private Department department;
    private AnnouncementRequest request;
    private Announcement announcement;

    @BeforeEach
    void setUp() {
        department = Department.builder()
                .id(4L)
                .departmentId("DEP004")
                .name("HR")
                .status(DepartmentStatus.ACTIVE)
                .build();

        request = new AnnouncementRequest();
        request.setTitle("Company Annual Day Celebration");
        request.setCategory(AnnouncementCategory.EVENT);
        request.setDepartmentId(4L);
        request.setMessage("Office celebration details will be shared soon.");

        announcement = Announcement.builder()
                .id(1L)
                .announcementId("ANN001")
                .title("Company Annual Day Celebration")
                .category(AnnouncementCategory.EVENT)
                .department(department)
                .message("Office celebration details will be shared soon.")
                .status(AnnouncementStatus.DRAFT)
                .build();
    }

    @Test
    void createPersistsDraftAnnouncement() {
        when(announcementRepository.count()).thenReturn(0L);
        when(announcementRepository.existsByAnnouncementIdIgnoreCase("ANN001")).thenReturn(false);
        when(departmentRepository.findById(4L)).thenReturn(Optional.of(department));
        when(announcementRepository.save(any(Announcement.class))).thenAnswer(invocation -> {
            Announcement saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        var response = announcementService.create(request);

        assertThat(response.getAnnouncementId()).isEqualTo("ANN001");
        assertThat(response.getStatus()).isEqualTo(AnnouncementStatus.DRAFT);
        assertThat(response.getDepartment().getName()).isEqualTo("HR");

        ArgumentCaptor<Announcement> captor = ArgumentCaptor.forClass(Announcement.class);
        verify(announcementRepository).save(captor.capture());
        assertThat(captor.getValue().getTitle()).isEqualTo("Company Annual Day Celebration");
    }

    @Test
    void createRejectsMissingDepartment() {
        when(announcementRepository.count()).thenReturn(0L);
        when(announcementRepository.existsByAnnouncementIdIgnoreCase("ANN001")).thenReturn(false);
        when(departmentRepository.findById(4L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> announcementService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Department not found");
    }

    @Test
    void createAllowsCompanyWideAnnouncement() {
        request.setDepartmentId(null);
        when(announcementRepository.count()).thenReturn(0L);
        when(announcementRepository.existsByAnnouncementIdIgnoreCase("ANN001")).thenReturn(false);
        when(announcementRepository.save(any(Announcement.class))).thenAnswer(invocation -> {
            Announcement saved = invocation.getArgument(0);
            saved.setId(2L);
            return saved;
        });

        var response = announcementService.create(request);

        assertThat(response.getDepartment().getName()).isEqualTo("All Departments");
        ArgumentCaptor<Announcement> captor = ArgumentCaptor.forClass(Announcement.class);
        verify(announcementRepository).save(captor.capture());
        assertThat(captor.getValue().getDepartment()).isNull();
        verify(departmentRepository, never()).findById(any());
    }

    @Test
    void publishDraftAnnouncement() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));
        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcement);

        var response = announcementService.publish(1L);

        assertThat(response.getStatus()).isEqualTo(AnnouncementStatus.PUBLISHED);
        assertThat(announcement.getPublishedAt()).isNotNull();
    }

    @Test
    void scheduleDraftAnnouncement() {
        AnnouncementScheduleRequest scheduleRequest = new AnnouncementScheduleRequest();
        scheduleRequest.setScheduledAt(Instant.now().plus(2, ChronoUnit.DAYS));
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));
        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcement);

        var response = announcementService.schedule(1L, scheduleRequest);

        assertThat(response.getStatus()).isEqualTo(AnnouncementStatus.SCHEDULED);
        assertThat(announcement.getScheduledAt()).isEqualTo(scheduleRequest.getScheduledAt());
    }

    @Test
    void archivePublishedAnnouncement() {
        announcement.setStatus(AnnouncementStatus.PUBLISHED);
        announcement.setPublishedAt(Instant.now().minus(1, ChronoUnit.DAYS));
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));
        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcement);

        var response = announcementService.archive(1L);

        assertThat(response.getStatus()).isEqualTo(AnnouncementStatus.ARCHIVED);
        assertThat(announcement.getArchivedAt()).isNotNull();
    }

    @Test
    void publishRejectsArchivedAnnouncement() {
        announcement.setStatus(AnnouncementStatus.ARCHIVED);
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));

        assertThatThrownBy(() -> announcementService.publish(1L))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Archived announcements cannot be published");
    }

    @Test
    void deleteRemovesAnnouncement() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));

        announcementService.delete(1L);

        verify(announcementRepository).delete(announcement);
    }

    @Test
    void deleteRejectsMissingAnnouncement() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> announcementService.delete(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Announcement not found");

        verify(announcementRepository, never()).delete(any(Announcement.class));
    }
}
