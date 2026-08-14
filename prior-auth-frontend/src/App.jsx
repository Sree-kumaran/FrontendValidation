import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import NewAuthorization from "./pages/NewAuthorization";
import Requests from "./pages/Requests";
import NurseReview from "./pages/NurseReview";
import Policies from "./pages/Policies";
import AuditTrail from "./pages/AuditTrail";
import ExtractionResult from "./pages/ExtractionResult";
import PolicyEvaluation from "./pages/PolicyEvaluation";
import Decision from "./pages/Decision";
import DecisionTrace from "./pages/DecisionTrace";
import ProviderResponse from "./pages/ProviderResponse";
import PostSubmissionReview from "./pages/PostSubmissionReview";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="new-authorization" element={<NewAuthorization />} />

          <Route path="requests" element={<Requests />} />

          <Route path="nurse-review" element={<NurseReview />} />

          <Route path="policies" element={<Policies />} />

          <Route path="audit-trail" element={<AuditTrail />} />

          <Route path="extraction-result" element={<ExtractionResult />} />

          <Route path="policy-evaluation" element={<PolicyEvaluation />} />

          <Route path="decision" element={<Decision />} />

          <Route path="decision-trace" element={<DecisionTrace />} />

          {/* STAGE 11 */}
          <Route path="provider-response" element={<ProviderResponse />} />
          <Route
            path="post-submission-review"
            element={<PostSubmissionReview />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
