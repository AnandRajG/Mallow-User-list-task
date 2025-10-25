import { Button, Flex, Layout, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const HeaderCard = () => {
    const navigate = useNavigate()
    return (
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Flex gap="small" align="center">
                <Typography style={{ color: 'white', fontWeight: 600 }}>Elon Musk</Typography>
                <Button type="primary" danger icon={<LogoutOutlined />}
                    onClick={() => navigate('/')}
                />
            </Flex>
        </Header>
    );
};

export default HeaderCard;