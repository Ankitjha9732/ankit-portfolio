import './styles/globals.css'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/layout/ErrorBoundary'
import Home from './pages/Home'

function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </Layout>
  )
}

export default App