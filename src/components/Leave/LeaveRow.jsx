    import LeaveActions from "./LeaveActions";
    import StatusBadge from "./StatusBadge";

    const LeaveRow = ({ leave, serialNumber, onView, onEdit, onDelete, onApprove, onReject, readOnly = false }) => {
    return (
        <tr className="border-t border-[#edf2f7] text-[11px] hover:bg-[#f8fafc] transition">
        <td className="px-5 py-4 font-medium text-[#344767]">
            {serialNumber}
        </td>

        <td className="px-5 py-4 font-medium text-[#344767]">
            {leave.employeeId}
        </td>

        <td className="whitespace-nowrap px-5 py-4 font-medium text-[#101828]">
            {leave.employee}
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-[#667085]">
            {leave.department}
        </td>

       <td className="whitespace-nowrap px-5 py-4 text-[#667085]">
            {leave.leaveType}
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-[#667085]">
            {leave.from}
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-[#667085]">
            {leave.to}
        </td>

        <td className="px-5 py-4 font-medium text-[#101828]">
            {leave.days}
        </td>

        <td className="max-w-[220px] truncate px-5 py-4 text-[#667085]">
            {leave.reason}
        </td>

        <td className="whitespace-nowrap px-5 py-4">
            <StatusBadge status={leave.status} />
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-[#667085]">
            {leave.appliedOn}
        </td>

        <td className="px-5 py-4">
            <LeaveActions leave={leave} onView={onView} onEdit={onEdit} onDelete={onDelete} onApprove={onApprove} onReject={onReject} readOnly={readOnly} />
        </td>
        </tr>
    );
    };

    export default LeaveRow;
