import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import LeaveHeader from "../../components/Leave/LeaveHeader";
import LeaveStats from "../../components/Leave/LeaveStats";
import LeaveFilters from "../../components/Leave/LeaveFilters";
import LeaveTable from "../../components/Leave/LeaveTable";
import ViewLeaveModal from "../../components/Leave/ViewLeaveModal";
import LeaveForm from "../../components/Leave/LeaveForm";
import leaveData from "../../data/leaveData";

const Leaves = () => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leaves, setLeaves] = useState(leaveData);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setSelectedLeave(null);
    setIsViewOpen(false);
  };

  const handleEditLeave = (leave) => {
  setEditingLeave(leave);
  setIsFormOpen(true);
  };

  const closeForm = () => {
  setEditingLeave(null);
  setIsFormOpen(false);
  };

const handleUpdateLeave = (updatedLeave) => {
  setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
      leave.id === updatedLeave.id ? updatedLeave : leave
    )
  );

  closeForm();
};

  const openDeleteConfirmation = (leave) => {
    setLeaveToDelete(leave);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setLeaveToDelete(null);
  };

  const deleteLeave = () => {
    setLeaves((currentLeaves) => currentLeaves.filter((leave) => leave.id !== leaveToDelete.id));
    toast.success('Leave deleted successfully.');
    closeDeleteConfirmation();
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <LeaveHeader />

      <LeaveStats />

      <div>
        <LeaveFilters />

        <LeaveTable
        leaves={leaves}
        onView={handleViewLeave}
        onEdit={handleEditLeave}
        onDelete={openDeleteConfirmation} />
      </div>

      <LeaveForm
        leave={editingLeave}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleUpdateLeave}
     />

      <ViewLeaveModal
        leave={selectedLeave}
        isOpen={isViewOpen}
        onClose={closeViewModal}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Leave"
        itemName={leaveToDelete?.employee}
        itemId={leaveToDelete?.employeeId}
        onClose={closeDeleteConfirmation}
        onConfirm={deleteLeave}
      />

      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};

export default Leaves;
