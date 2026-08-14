import StatCard from '../components/StatCard';
import RequestTable from '../components/RequestTable';
import { mockRequests, dashboardStats } from '../data/mockRequests';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-[22px] font-bold mb-5 text-text-primary">
        Dashboard
      </h1>

      <div className="flex gap-4 mb-7">
        <StatCard label="Total Requests" value={dashboardStats.total} />
        <StatCard label="Approved" value={dashboardStats.approved} accentClass="text-success" />
        <StatCard label="Pending" value={dashboardStats.pending} accentClass="text-warning" />
        <StatCard label="More Info Needed" value={dashboardStats.moreInfo} accentClass="text-danger" />
      </div>

      <h2 className="text-base font-semibold mb-3 text-text-primary">
        Recent Authorization Requests
      </h2>
      <RequestTable requests={mockRequests} />
    </div>
  );
}