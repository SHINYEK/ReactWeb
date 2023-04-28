import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { BoxContext } from '../BoxContext';
import BoxModal from '../BoxModal';
import LoadingPage from '../LoadingPage';

const PostUpdatePage = ({ match, history }) => {
    const id = match.params.id;
    const { setBox } = useContext(BoxContext);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        writer: sessionStorage.getItem("uid"),
        title: "",
        body: ""
    })

    const { title, body } = form;

    const getPost = async () => {
        setLoading(true);
        const result = await axios.get(`/post/read?id=${id}`);
        setForm(result.data);
        setLoading(false);
    }

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setBox({
            show: true,
            message: "수정하실래요?",
            action: onUpdate
        })

    }

    const onUpdate = async () => {
        setLoading(true);
        await axios.post('/post/update', form);
        history.push("/post");
        setLoading(false);
    }

    useEffect(() => {
        getPost();
    }, [])

    if (loading) {
        return <LoadingPage />
    }

    return (
        <Row className="justify-content-center">
            <Col md={8}>
                <h1 className='my-5'>{id}게시글 수정</h1>
                <Form className="text-center" onSubmit={onSubmit}>
                    <Form.Control name="title" onChange={onChange} value={title} className="my-2" placeholder="제목" />
                    <Form.Control name="body" onChange={onChange} value={body} className="my-2" rows={10} as="textarea" />
                    <div>
                        <Button className="my-2 mx-2" type="submit">수정</Button>
                        <Button className="my-2 btn-secondary" type="reset" onClick={getPost}>취소</Button>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}

export default PostUpdatePage