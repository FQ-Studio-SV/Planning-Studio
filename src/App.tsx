import { JiraTestPanel } from './components/jira-test-panel'
import { CsvExportTestPanel } from './components/csv-export-test-panel'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 space-y-8">
      <JiraTestPanel />
      <CsvExportTestPanel />
    </div>
  )
}

export default App
