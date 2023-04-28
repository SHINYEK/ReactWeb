import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Form, Button, Card, Dropdown } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { BoxContext } from '../BoxContext'
import LoadingPage from '../LoadingPage'
import Pagination from 'react-js-pagination';

const CommentsPage = ({ history, id }) => {
    const [loading, setLoading] = useState(false);
    const { setBox } = useContext(BoxContext);
    const [comments, setComments] = useState([]);
    const [body, setBody] = useState('');
    const [text, setText] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const getComments = async () => {
        setLoading(true);
        const result =
            await axios.get(`/comments/list?postid=${id}&page=${page}&size=3`);
        const data = result.data.map(c => c && { ...c, ellipsis: true, edit: false });
        setComments(data);
        const resul1 = await axios.get('/comments/total?postid=' + id);
        setTotal(resul1.data);
        setLoading(false);
    }

    const onClickInsert = () => {
        history.push('/login');
    }

    //새로운댓글 추가
    const onClickRegister = async () => {
        if (body === "") {
            setBox({ show: true, message: '댓글 내용을 입력하세요.' });
        } else {
            const data = {
                body: body, postid: id,
                writer: sessionStorage.getItem('uid')
            }
            await axios.post('/comments/insert', data);
            getComments();
            setBody('');
        }
    }

    const onClickUpdate = (id) => {
        const data = comments.map(c => c.id === id ? { ...c, edit: true } : c);
        setComments(data);
    }

    const onClickCancel = (id) => {
        const data = comments.map(c => c.id === id ? { ...c, edit: false } : c);
        setComments(data);
    }

    //댓글삭제
    const onDelete = async (id) => {
        await axios.get('/comments/delete?id=' + id);
        getComments();
    }

    const onClickDelete = (id) => {
        setBox({
            show: true,
            message: `${id}번 댓글을 삭제하실래요?`,
            action: () => onDelete(id)
        });
    }

    useEffect(() => {
        getComments();
    }, [page]);

    const onClickBody = (id) => {
        const data = comments.map(c => c.id === id ? { ...c, ellipsis: !c.ellipsis } : c);
        setComments(data);
    }

    //저장(수정) 버튼을 클릭한 경우
    const onSave = async (id) => {
        await axios.post('/comments/update', { id: id, body: text });
        getComments();
    }
    const onClickSave = (id) => {
        setBox({
            show: true,
            message: `${id}번 댓글을 수정하실래요?`,
            action: () => onSave(id)
        });
    }

    if (loading) return <LoadingPage />
    return (
        <Row className='my-2'>
            <Col>
                {sessionStorage.getItem('uid') ?
                    <div className='text-center'>
                        <Form.Control value={body}
                            onChange={(e) => setBody(e.target.value)}
                            as="textarea" rows={5} />
                        <Button onClick={() => onClickRegister()}
                            className='my-2 px-5'>등록</Button>
                    </div>
                    :
                    <div>
                        <Button className="w-100"
                            onClick={onClickInsert}>댓글작성</Button>
                    </div>
                }

                {total > 0 &&
                    <div className='my-5'>
                        <h5>댓글수: <span>{total}</span></h5>
                        {comments.map(c =>
                            <Card key={c.id} className='my-3'>
                                {(sessionStorage.getItem('uid') === c.writer && !c.edit) &&
                                    <Card.Title>
                                        <Dropdown className='text-end' style={{ fontSize: '0.7rem' }}>
                                            <Dropdown.Toggle variant="light" id="dropdown-basic"></Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#"
                                                    onClick={() => onClickUpdate(c.id)}>수정</Dropdown.Item>
                                                <Dropdown.Item onClick={() => onClickDelete(c.id)}
                                                    href="#">삭제</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Card.Title>
                                }
                                <Card.Body>
                                    {c.edit ?
                                        <div>
                                            <Form.Control value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                as="textarea" rows={5}>
                                                {c.body}
                                            </Form.Control>
                                            <div className='text-end my-2'>
                                                <Button onClick={() => onClickSave(c.id)}
                                                    className='btn-sm mx-2'>저장</Button>
                                                <Button onClick={() => onClickCancel(c.id)}
                                                    className='btn-sm' variant='secondary'>취소</Button>
                                            </div>
                                        </div>
                                        :
                                        <div onClick={() => onClickBody(c.id)}
                                            style={{ cursor: 'pointer' }}
                                            className={c.ellipsis && 'ellipsis'}>
                                            [{c.id}] {c.body}
                                        </div>
                                    }

                                </Card.Body>
                                <Card.Footer style={{ fontSize: '0.7rem' }}>
                                    Posted on <span>{c.fmtDate}</span> by {c.writer}
                                </Card.Footer>
                            </Card>
                        )}
                        <Pagination
                            activePage={page}
                            itemsCountPerPage={3}
                            totalItemsCount={total}
                            pageRangeDisplayed={5}
                            prevPageText={"<"}
                            nextPageText={">"}
                            onChange={(e) => setPage(e)} />
                    </div>
                }
            </Col>
        </Row>
    )
}

export default withRouter(CommentsPage)