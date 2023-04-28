import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import LoadingPage from '../LoadingPage';
import { Row, Col, Card, Button } from 'react-bootstrap'
import { BoxContext } from '../BoxContext';
import { Link } from 'react-router-dom';
import CommentPage from './CommentPage';

const PostReadPage = ({ match, history }) => {
    const [loading, setLoading] = useState(false);
    const { setBox } = useContext(BoxContext);
    const id = match.params.id;
    const [post, setPost] = useState({
        writer: "",
        title: "",
        body: "",
        fmtDate: "",
        viewcnt: 0,
        ccnt: 0
    })

    const { writer, title, body, fmtDate, viewcnt, ccnt } = post;
    const getPost = async () => {
        setLoading(true);
        await axios.get('/post/update/viewcnt?id=' + id);
        const result = await axios.get('/post/read?id=' + id);
        setPost(result.data);
        setLoading(false);
    }

    const onDelete = async () => {
        await axios.get("/post/delete?id=" + id);
        history.push("/post")
    }

    const onClickDelete = () => {
        if (ccnt > 0) {
            setBox({
                show: true,
                message: `${ccnt}개 댓글이 존재합니다. 삭제가 불가능합니다.`
            })
        } else {
            setBox({
                show: true,
                message: `${id}번 게시물을 삭제하시겠습니까?`,
                action: onDelete
            })
        }

    }

    useEffect(() => {
        getPost();
    }, [])

    if (loading) return <LoadingPage />

    return (
        <Row className="justify-content-center">
            <Col md={10}>
                <h1 className="my-5">게시글정보</h1>
                {writer === sessionStorage.getItem("uid") &&
                    <div className="text-end my-2">
                        <Link to={`/post/update/${id}`}><Button className="btn-sm mx-2">수정</Button></Link>
                        <Button className="btn-sm" variant="danger" onClick={onClickDelete}>삭제</Button>
                    </div>
                }
                <Card>
                    <Card.Title className="px-2 py-2">
                        <h5 className="my-2">[{id}] {title}
                            <span style={{ fontSize: "1rem", float: "right", color: "gray" }}>조회수:{viewcnt} | 댓글수 :{ccnt}</span>
                        </h5>
                        <hr />
                    </Card.Title>
                    <Card.Body>
                        <p>{body}</p>
                    </Card.Body>
                    <Card.Footer>
                        Posted on {fmtDate} by {writer}
                    </Card.Footer>
                </Card>
            </Col>
            <CommentPage id={id} />
        </Row>
    )
}

export default PostReadPage