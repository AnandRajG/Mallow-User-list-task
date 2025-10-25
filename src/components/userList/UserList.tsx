import {
    Avatar, Button, Card, Col, Flex, Form, Input,
    message, Modal, Pagination, Radio, Row, Space,
    Table, Typography
} from 'antd';
import {
    SearchOutlined, TableOutlined, AppstoreOutlined,
    UserOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import './userList.css';
import APIServices from '../../RestAPIs/APIServices';
import type { ColumnsType } from 'antd/es/table';
import { URL_CONSTANTS } from '../../utils/urlConstants';
import { debounce } from '../../utils/commonFunction';


interface User {
    avatar: string;
    email: string;
    first_name: string;
    last_name: string;
    id: number;
}

interface UserState {
    position: string,
    userData: User[],
    openPopUp: boolean,
    currentPage: number,
    pageSize: number,
    totalPages: number,
    loading: boolean,
    selectedId: number | null,
    isEdit: boolean,
    searchQuery: string,
    originalUserData: User[]
}

const UserList = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [state, setState] = useState<UserState>({
        position: 'table',
        userData: [],
        openPopUp: false,
        currentPage: 1,
        pageSize: 6,
        totalPages: 1,
        loading: false,
        selectedId: null,
        isEdit: false,
        searchQuery: '',
        originalUserData: []
    });

    // API INTEGRATION STARTS =====>

    useEffect(() => {
        getUserData(state.currentPage)
    }, [])

    useEffect(() => {
        if (state.searchQuery) {
            setState((prev) => ({
                ...prev,
                userData: prev.userData?.filter(item => (
                    (item?.email?.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
                    (item?.first_name?.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
                    (item?.last_name?.toLowerCase().includes(state.searchQuery.toLowerCase()))
                ))
            }))
        } else {
            setState((prev) => ({
                ...prev,
                userData: prev.originalUserData || prev.userData
            }));
        }
    }, [state.searchQuery])

    const getUserData = async (page: number) => {
        setState((prev) => ({ ...prev, loading: true }))
        await APIServices.get(`${URL_CONSTANTS.USER_LIST_URL}?page=${page}&per_page=${state.pageSize}`)
            .then((response) => {
                if (response?.status === 200) {
                    setState((prev) => ({
                        ...prev,
                        userData: response?.data?.data,
                        totalPages: response?.data?.total,
                        loading: false,
                        originalUserData: response?.data?.data
                    }))
                }
            }).catch(error => {
                setState((prev) => ({ ...prev, loading: true }))
                message.error(error.message)
            })
    }

    const postuserData = async () => {
        let data = {
            first_name: form.getFieldValue('first_name'),
            last_name: form.getFieldValue('last_name'),
            email: form.getFieldValue('email'),
            avatar: form.getFieldValue('photo_link')
        }
        setState((prev) => ({ ...prev, loading: true }))
        await APIServices.post(URL_CONSTANTS.USER_LIST_URL, data)
            .then((response) => {
                if (response?.status === 201) {
                    messageApi.success('User Created Successfully')
                    onClosePopup()
                    onClearhandler()
                }
            }).catch(error => {
                setState((prev) => ({ ...prev, loading: false }))
                messageApi.error(error.message)
            })
    }

    const putuserData = async () => {
        let data = {
            first_name: form.getFieldValue('first_name'),
            last_name: form.getFieldValue('last_name'),
            email: form.getFieldValue('email')
        }
        setState((prev) => ({ ...prev, loading: true }))
        await APIServices.update(`${URL_CONSTANTS.USER_LIST_URL}/${state.selectedId}`, data)
            .then((response) => {
                if (response?.status === 200) {
                    messageApi.success('Updated Successfully')
                    getUserData(1)
                    onClosePopup()
                }
            }).catch(error => {
                setState((prev) => ({ ...prev, loading: false }))
                messageApi.error(error.message)
            })
    }

    const deleteuserData = async (record: User) => {
        await APIServices.delete(`${URL_CONSTANTS.USER_LIST_URL}/${record?.id}`)
            .then((response) => {
                if (response.status === 204) {
                    messageApi.success('Deleted Successfully')
                    getUserData(1)
                }
            }).catch(error => {
                messageApi.error(error.message)
            })
    }

    // API INTEGRATION ENDS =====>

    const debouncedSearch = useMemo(
        () => debounce((query: string) => {
            setState((prev) => ({ ...prev, currentPage: 1, searchQuery: query }));
        }, 500), []
    );

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setState((prev) => ({ ...prev, searchQuery: value }));
        debouncedSearch(value);
    };

    const onOpenPopup = () => {
        setState((prev) => ({
            ...prev,
            openPopUp: true
        }))
    }

    const onClosePopup = () => {
        setState((prev) => ({
            ...prev,
            openPopUp: false
        }))
    }

    const onEditHandler = (item: User) => {
        setState((prev) => ({
            ...prev,
            openPopUp: true,
            isEdit: true,
            selectedId: item?.id
        }))
        form.setFieldsValue({
            first_name: item?.first_name,
            last_name: item?.last_name,
            email: item?.email,
            profile_link: item?.avatar,
        })
    }

    const onClearhandler = () => {
        form.setFieldsValue({
            first_name: '',
            last_name: '',
            email: '',
            profile_link: '',
        })
        setState((prev) => ({ ...prev, isEdit: false }))
    }

    const renderTableScreen = () => {
        const columns: ColumnsType<User> = [
            { title: 'Avatar', dataIndex: 'avatar', key: 'avatar', align: 'center', render: (avatar) => <Avatar size={40} alt='img' src={avatar} /> },
            { title: 'Email', dataIndex: 'email', key: 'email', align: 'left', render: (email) => <Typography style={{ color: '#1677ff' }}>{email}</Typography> },
            { title: 'First Name', dataIndex: 'first_name', key: 'first_name', align: 'left' },
            { title: 'Last Name', dataIndex: 'last_name', key: 'last_name', align: 'left' },
            {
                title: 'Action', key: 'action', align: 'left', render: (_: any, record: User) => (
                    <Flex gap={10}>
                        <Button variant='solid' color='blue' className='common-Radius'
                            onClick={() => onEditHandler(record)}
                        >Edit</Button>
                        <Button variant='solid' color='danger' className='common-Radius'
                            onClick={() => deleteuserData(record)}
                        >Delete</Button>
                    </Flex>
                )
            }
        ];

        return (
            <section>
                <section className="table-container">
                    <Table
                        dataSource={state.userData}
                        columns={columns}
                        locale={{ emptyText: 'No Records To Be Shown' }}
                        sticky
                        pagination={false}
                        rowKey={(record) => record?.id}
                        loading={state.loading}
                    />
                </section>
                <Pagination
                    current={state.currentPage}
                    pageSize={state.pageSize}
                    total={state.totalPages}
                    onChange={(page) => {
                        setState((prev) => ({ ...prev, currentPage: page }))
                        getUserData(page)
                    }}
                    showSizeChanger={false}
                    className="pagination-right"
                />
            </section>
        );
    };

    const renderCardScreen = () => {
        return (
            <section className="card-container">
                <Row gutter={[12, 12]}>
                    {state.userData.map((item, index) => (
                        <Col span={6} key={index}>
                            <Card className="user-card">
                                <div className="overlay">
                                    <div className="action-buttons">
                                        <Button
                                            shape="circle"
                                            size='large'
                                            icon={<EditOutlined />}
                                            variant='solid'
                                            color='blue'
                                            onClick={() => onEditHandler(item)}
                                        />
                                        <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            variant='solid'
                                            color='danger'
                                            size='large'
                                            onClick={() => deleteuserData(item)}
                                        />
                                    </div>
                                </div>

                                <Avatar
                                    size={70}
                                    icon={<UserOutlined />}
                                    src={item?.avatar}
                                    className="user-avatar"
                                />

                                <div className="user-info">
                                    <Typography className="user-name">{item.first_name}</Typography>
                                    <Typography className="user-email">{item.email}</Typography>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        );
    };

    const renderPopupCard = () => {
        return (
            <Modal open={state.openPopUp} title={state.isEdit ? 'Edit Uset' : 'Create New user'} footer={null}
                onCancel={() => {
                    onClosePopup()
                    onClearhandler()
                }}
                width={'30dvw'}
            >
                <Form form={form} layout={'vertical'} onFinish={state.isEdit ? putuserData : postuserData}>
                    <div style={{ height: '65dvh' }}>
                        <Form.Item label="First Name" name={'first_name'} rules={[{ required: true, message: 'Please Enter first name' }]}>
                            <Input placeholder="Please enter first name" autoComplete='off' />
                        </Form.Item>
                        <Form.Item label="last Name" name={'last_name'} rules={[{ required: true, message: 'Please Enter last name' }]}>
                            <Input placeholder="Please enter last name" autoComplete='off' />
                        </Form.Item>
                        <Form.Item label="Email" name={'email'} rules={[{ required: true, message: 'Please Enter email' }]}>
                            <Input placeholder="please enter email" autoComplete='off' />
                        </Form.Item>
                        <Form.Item label="Profile Image Link" name={'profile_link'} rules={[{ required: true, message: 'Please Enter profile link' }]}>
                            <Input placeholder="Please enter profile image link" autoComplete='off' />
                        </Form.Item>
                    </div>
                    <Flex gap={10} justify='flex-end' wrap>
                        <Button variant='solid' className='common-Radius'
                            disabled={state.loading}
                            onClick={() => {
                                onClosePopup()
                                onClearhandler()
                            }}
                        >Cancel</Button>
                        <Button variant='solid' color='blue' className='common-Radius' htmlType="submit"
                            disabled={state.loading}
                        >{state.isEdit ? 'Update' : 'Submit'}</Button>
                    </Flex>
                </Form>
            </Modal>
        )
    }

    return (
        <div className="user-list">
            <header className="user-list-header">
                <Flex gap={10}>
                    <Typography className="title">Users</Typography>
                    <Flex gap={10} align="center">
                        <Input className="common-Radius"
                            suffix={<SearchOutlined />}
                            allowClear
                            onChange={onChangeHandler}
                        />
                        <Button variant="solid" color='blue' className="common-Radius"
                            onClick={onOpenPopup}
                        >Create User</Button>
                    </Flex>
                </Flex>
            </header>

            <section className="user-list-toggle">
                <Space >
                    <Radio.Group value={state.position} onChange={(e) => setState(prev => ({ ...prev, position: e.target.value }))}>
                        <Radio.Button value='table' >
                            <TableOutlined /> Table
                        </Radio.Button>
                        <Radio.Button value='card'>
                            <AppstoreOutlined /> Card
                        </Radio.Button>
                    </Radio.Group>
                </Space>
            </section>

            {state.position === 'table' ? renderTableScreen() : renderCardScreen()}
            {renderPopupCard()}
            {contextHolder}
        </div>
    );
};

export default UserList;
