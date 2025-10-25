
import { Layout } from 'antd';
import './App.css'
import Routing from './routing/Routing'
import HeaderCard from './components/header/HeaderCard';
import { useLocation } from "react-router-dom";

function App() {
  const { Content } = Layout;
  const location = useLocation();
  const hideHeader = location.pathname === "/login" || location.pathname === "/";
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!hideHeader && <HeaderCard />}
      <Content>
        <Routing />
      </Content>
    </Layout>
  )
}

export default App
