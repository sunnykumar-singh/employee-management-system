package com.ems.service;

import com.ems.dto.AttendanceRequest;
import com.ems.dto.AttendanceResponse;
import com.ems.dto.PageResponse;
import com.ems.entity.Attendance;
import com.ems.entity.AttendanceStatus;
import com.ems.entity.Employee;
import com.ems.exception.BadRequestException;
import com.ems.exception.ConflictException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.AttendanceSpecifications;
import com.ems.repository.EmployeeRepository;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private static final String ZERO_HOURS = "0h 00m";

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public AttendanceResponse create(AttendanceRequest request) {
        Employee employee = findActiveEmployee(request.getEmployeeId());
        if (attendanceRepository.existsByEmployeeIdAndDate(employee.getId(), request.getDate())) {
            throw new ConflictException("Attendance already exists for this employee on the selected date");
        }

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(request.getDate())
                .status(request.getStatus())
                .build();
        applyTimes(attendance, request);

        return AttendanceResponse.from(attendanceRepository.save(attendance));
    }

    @Transactional(readOnly = true)
    public PageResponse<AttendanceResponse> list(
            String search, LocalDate date, AttendanceStatus status, Long departmentId, Pageable pageable) {
        Specification<Attendance> specification = Specification.<Attendance>unrestricted()
                .and(AttendanceSpecifications.search(search))
                .and(AttendanceSpecifications.hasDate(date))
                .and(AttendanceSpecifications.hasStatus(status))
                .and(AttendanceSpecifications.hasDepartment(departmentId));

        Page<AttendanceResponse> page = attendanceRepository.findAll(specification, pageable).map(AttendanceResponse::from);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public AttendanceResponse getById(Long id) {
        return AttendanceResponse.from(findAttendance(id));
    }

    @Transactional
    public AttendanceResponse update(Long id, AttendanceRequest request) {
        Attendance attendance = findAttendance(id);
        Employee employee = findActiveEmployee(request.getEmployeeId());

        if (attendanceRepository.existsByEmployeeIdAndDateAndIdNot(employee.getId(), request.getDate(), id)) {
            throw new ConflictException("Attendance already exists for this employee on the selected date");
        }

        attendance.setEmployee(employee);
        attendance.setDate(request.getDate());
        attendance.setStatus(request.getStatus());
        applyTimes(attendance, request);

        return AttendanceResponse.from(attendanceRepository.save(attendance));
    }

    @Transactional
    public void delete(Long id) {
        Attendance attendance = findAttendance(id);
        attendanceRepository.delete(attendance);
    }

    private void applyTimes(Attendance attendance, AttendanceRequest request) {
        LocalTime checkIn = request.getCheckIn();
        LocalTime checkOut = request.getCheckOut();

        if (request.getStatus() == AttendanceStatus.ABSENT) {
            attendance.setCheckIn(null);
            attendance.setCheckOut(null);
            attendance.setWorkingHours(ZERO_HOURS);
            return;
        }

        if (checkIn != null && checkOut != null && !checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Check-out must be after check-in");
        }

        attendance.setCheckIn(checkIn);
        attendance.setCheckOut(checkOut);
        attendance.setWorkingHours(formatWorkingHours(checkIn, checkOut));
    }

    private String formatWorkingHours(LocalTime checkIn, LocalTime checkOut) {
        if (checkIn == null || checkOut == null) {
            return ZERO_HOURS;
        }

        Duration duration = Duration.between(checkIn, checkOut);
        return duration.toHours() + "h " + String.format("%02d", duration.toMinutesPart()) + "m";
    }

    private Attendance findAttendance(Long id) {
        return attendanceRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found"));
    }

    private Employee findActiveEmployee(Long employeeId) {
        return employeeRepository
                .findByIdAndActiveTrue(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }
}
