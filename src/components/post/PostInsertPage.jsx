import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import BoxModal from '../BoxModal';
import { BoxContext } from '../BoxContext';

const PostInsertPage = ({ history }) => {
    const { box, setBox } = useContext(BoxContext);

    const [form, setForm] = useState({
        writer: sessionStorage.getItem("uid"),
        title: "",
        body: ""
    })
    const { title, body } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onInsert = async () => {
        await axios.post("/post/insert", form);
        history.push('/post');
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (title === '') {
            setBox({
                show: true,
                message: "제목을 입력해주세요!"
            })
            return;
        } else {
            setBox({
                show: true,
                message: "새로운 글을 등록하실래요?",
                action: onInsert
            })
        }

    }

    return (
        <Row className="justify-content-center">
            <Col md={8}>
                <h1 className='my-5'>글쓰기</h1>
                <Form className="text-center" onSubmit={onSubmit}>
                    <Form.Control name="title" onChange={onChange} value={title} className="my-2" placeholder="제목" />
                    <Form.Control name="body" onChange={onChange} value={body} className="my-2" rows={10} as="textarea" />
                    <div>
                        <Button className="my-2 mx-2" type="submit">등록</Button>
                        <Button className="my-2 btn-secondary" type="reset">취소</Button>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}

export default PostInsertPage