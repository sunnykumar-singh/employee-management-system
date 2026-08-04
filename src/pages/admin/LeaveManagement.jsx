import LeaveHeader from "../../components/Leave/LeaveHeader";
import LeaveStats from "../../components/Leave/LeaveStats";
import LeaveFilters from "../../components/Leave/LeaveFilters";
import LeaveTable from "../../components/Leave/LeaveTable";

const Leaves = () => {
  return (
    <div className="mx-auto max-w-[1280px] space-y-5">
      <LeaveHeader />

      <LeaveStats />

      <div>
        <LeaveFilters />

        <LeaveTable />
      </div>
    </div>
  );
};

export default Leaves;