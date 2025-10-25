import { Form, Input, Button, Checkbox, Card, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";
import APIServices from "../../RestAPIs/APIServices";
import { URL_CONSTANTS } from "../../utils/urlConstants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../Redux/store";
import { authtication } from "../../Redux/Slicer/AuthSlicer";
import { useState } from "react";

const Login = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async () => {
        let data = {
            email: form.getFieldValue('email'),
            password: form.getFieldValue('password')
        }
        setLoading(true)
        await APIServices.post(URL_CONSTANTS.LOGIN_URL, data)
            .then((response) => {
                if (response?.status === 200) {
                    messageApi.success('Login Successfully')
                    navigate('/userList')
                    dispatch(authtication(response?.data?.token))
                    setLoading(false)
                }
            }).catch(error => {
                setLoading(false)
                messageApi.error(error.message)
            })
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Form form={form} layout={'vertical'} onFinish={onSubmitHandler}>
                    <Form.Item
                        name="email"
                        initialValue={'eve.holt@reqres.in'}
                        rules={[{ required: true, message: "Please Enter your Email!" }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Please Enter email Id"
                            size="large"
                            className="common-Radius"
                            autoComplete="off"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Please Enter your Password!" }]}
                        initialValue={'cityslicka'}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Please Enter password"
                            size="large"
                            className="common-Radius"
                            autoComplete="off"
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox className="remember-checkbox">Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        {loading ?
                            <div className="spin"><Spin /></div> :
                            <Button
                                variant="solid"
                                color="blue"
                                size="large"
                                htmlType="submit"
                                block
                                className="common-Radius"
                            >
                                Log in
                            </Button>}
                    </Form.Item>
                </Form>
            </Card>
            {contextHolder}
        </div>
    );
};

export default Login;
