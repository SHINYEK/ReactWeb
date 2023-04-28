import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Card, Button, Form } from 'react-bootstrap'
import Pagination from 'react-js-pagination'
import Dropdown from 'react-bootstrap/Dropdown';
import { BoxContext } from '../BoxContext';
import LoadingPage from '../LoadingPage';
import LoginPage from '../LoginPage';
import { withRouter } from 'react-router-dom'

const CommentPage = ({ id, history }) => {
    const [comments, setComments] = useState([]);
    const { setBox } = useContext(BoxContext);
    const [body, setBody] = useState(""); //기존내용

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const getComment = async () => {
        let uid = sessionStorage.getItem("uid");
        const result = await axios.get(`/comments/list.json?postid=${id}&page=${page}&size=${size}&uid=${uid}`);
        const total = await axios.get(`/comments/total?postid=${id}`);
        setTotal(total.data);
        //console.log(result.data);
        // 댓글 반복한 다음 기존 키에 ellipsis키 추가 - 초기값 true
        setComments(result.data.map(c => c && { ...c, ellipsis: true, toggle: true, text: c.body }));
    }
    //눌렀을 때 ellipsis 값 반대로 변경 - 열렸다 닫혔다
    const onClickBody = (id) => {
        setComments(comments.map(c => c.id === id ? { ...c, ellipsis: !c.ellipsis } : c));
    }

    //수정& 취소
    const onClickToggle = (id) => {
        setComments(comments.map(c => c.id === id ? { ...c, toggle: !c.toggle, text: c.body } : c))
    }

    const onChangeText = (e, id) => {
        const data = comments.map(c => c.id === id ? { ...c, text: e.target.value } : c)
        setComments(data);
    }

    //댓글등록
    const onInsert = async (e) => {
        e.preventDefault();
        if (body === "") {
            setBox({
                show: true,
                message: "댓글 내용을 입력하세요!"
            })
        } else {
            const form = { postid: id, body: body, writer: sessionStorage.getItem("uid") };
            await axios.post("/comments/insert", form);
            getComment();
            setBody("");
        }
    }

    //댓글삭제버튼
    const onClickDelete = (id) => {
        setBox({
            show: true,
            message: id + "번 댓글을 삭제하실래요?",
            action: () => onDelete(id)
        })
    }
    //댓삭이벤트
    const onDelete = async (id) => {
        await axios.post("/comments/delete?id=" + id);
        getComment();
    }

    //저장버튼
    const onClickSave = (id, text, body) => {
        if (text === body) {
            setComments(comments.map(c => c.id === id ? { ...c, edit: false } : c));
            getComment();
        } else {
            setBox({
                show: true,
                message: `${id}번 댓글을 수정하실래요?`,
                action: async () => {
                    await axios.post('/comments/update', { id: id, body: text });
                    getComment();
                }
            })
        }

    }

    //좋아요 삭제
    const onDeleteFavorite = async (id) => {
        const uid = sessionStorage.getItem("uid");
        await axios.post("/comments/favorite/delete", { id: id, writer: uid });
        setBox({
            show: true,
            message: "좋아요 삭제"
        })
        getComment();
    }

    //좋아요 추가
    const onInsertFavorite = async (id) => {
        if (sessionStorage.getItem('uid')) {
            await axios.post('/comment/favorite/insert',
                { id: id, writer: sessionStorage.getItem('uid') });
            setBox({ show: true, message: '좋아요! 추가' });
            getComment();
        } else {
            history.push('/login');
        }
    }



    useEffect(() => {
        getComment();
    }, [page])


    if (loading) {
        return <LoginPage />
    }
    return (
        <Row className="justify-content-center my-4">
            <Col md={10}>
                <h1>[{id}] 댓글목록</h1>
                <span>▶ 댓글수: {total} 건 </span>

                <Form className="text-end my-2">
                    <Form.Control value={body} as="textarea" onChange={(e) => setBody(e.target.value)} rows={5} placeholder="내용을 입력하세요." />
                    <Button type="submit" className="my-2" onClick={onInsert}>등록</Button>
                </Form>

                {comments.map(c => (
                    <Card key={c.id} className="my-3">
                        {(c.writer === sessionStorage.getItem("uid") && c.toggle) &&
                            <Card.Title>
                                <Dropdown className="text-end">
                                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#" onClick={() => onClickToggle(c.id)}>수정</Dropdown.Item>
                                        <Dropdown.Item href="#" onClick={() => onClickDelete(c.id)}>삭제</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Card.Title>
                        }
                        {c.toggle ?
                            <Card.Body onClick={() => onClickBody(c.id)}>
                                <div style={{ cursor: "pointer" }} className={c.ellipsis && 'ellipsis'}>[{c.id}] {c.body}</div>
                            </Card.Body>
                            :
                            <Card.Body>
                                <div>
                                    <Form.Control as="textarea" value={c.text} onChange={(e) => onChangeText(e, c.id)} rows={3} />
                                    <div>
                                        <Button className="mx-2 my-2 btn-sm" onClick={() => onClickSave(c.id, c.text, c.body)}>저장</Button>
                                        <Button variant="secondary" className="btn-sm" onClick={() => onClickToggle(c.id)}>취소</Button>
                                    </div>
                                </div>
                            </Card.Body>
                        }
                        <Card.Footer className="text-muted">
                            Posted on {c.fmtDate} by {c.writer}
                            <span style={{ float: "right" }}>
                                <span> 좋아요: {c.fcnt} |</span>
                                {c.ucnt == 0 ?
                                    <span style={{ color: "red", cursor: 'pointer' }} onClick={() => onInsertFavorite(c.id)}>♡</span>
                                    :
                                    <span style={{ color: "red", cursor: 'pointer' }} onClick={() => onDeleteFavorite(c.id)}> ♥</span>
                                }
                            </span>


                        </Card.Footer>
                    </Card>
                ))}

            </Col>
            <Pagination
                activePage={page}
                itemsCountPerPage={3}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={(e) => setPage(e)} />
        </Row>
    )
}

export default withRouter(CommentPage) 