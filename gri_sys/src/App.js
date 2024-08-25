
import Grievance from "./Grievance";
import GrievanceTracker from "./GrievanceTracker";
// import AddTrackingUpdate from "./AddTrackingUpdate";
import GrievanceActionLogger from "./GrievanceActionLogger";
import PredictiveAnalyticsView from "./PredictiveAnalyticsView.js"
function App() {
  return (
    <div className="App">

      <Grievance />
      <GrievanceTracker />
      {/* <AddTrackingUpdate /> */}
      <GrievanceActionLogger />
      <PredictiveAnalyticsView />
    </div>
  );
}

export default App;
