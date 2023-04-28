
import React, { useState } from 'react'
import { Row, Col, Form, Card, Button } from 'react-bootstrap'
import axios from 'axios'

const LoginPage = ({ history }) => {
    const [form, setForm] = useState({
        uid: "user01",
        upass: "pass"
    })

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onLogin = async (e) => {
        e.preventDefault();
        const result = await axios.post("/user/login", form);
        if (result.data === 0) {
            alert("존재하지 않는 사용자입니다.");
        } else if (result.data === 2) {
            alert("비밀번호가 틀립니다.")
        } else {
            sessionStorage.setItem("uid", uid);
            history.go(-1);
        }
    }

    const { uid, upass } = form;

    return (
        <div>
            <Row className="my-5 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Title className="text- center py-3">
                            <h1 className='my-3'>로그인</h1>
                        </Card.Title>
                        <Card.Body>
                            <Form onSubmit={onLogin} className="px-3 text-center">
                                <Form.Control name="uid" onChange={onChange} value={uid} placeholder="아이디" className="my-2" />
                                <Form.Control name="upass" onChange={onChange} value={upass} type="password" placeholder="비밀번호" className="my-2" />
                                <Button type="submit" className="w-100 my-3">로그인</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default LoginPage