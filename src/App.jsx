import './styles/globals.css'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/layout/ErrorBoundary'
import Loader from './components/layout/Loader'
import Home from './pages/Home'

function App() {
  return (
    <Layout>
      <Loader />
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </Layout>
  )
}

export default App