import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Col, Row, Card, Form, InputGroup } from 'react-bootstrap'
import Pagination from 'react-js-pagination'
import { BoxContext } from './BoxContext'
import LoadingPage from './LoadingPage'

const Homepage = ({ history }) => {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const { setBox } = useContext(BoxContext);
    const [loading, setLoading] = useState(false);

    const getBooks = async () => {
        setLoading(true);
        const uid = sessionStorage.getItem("uid");
        const result = await axios.get(`/books/list?page=${page}&size=4&uid=${uid}&query=${query}`);
        const res = await axios.get(`/books/total?query=${query}`);
        setTotal(res.data);
        setBooks(result.data);
        setLoading(false);
    }
    //좋아요 추가
    const onFavoriteInsert = async (code) => {
        if (!sessionStorage.getItem("uid")) {
            history.push("/login");
        } else {
            await axios.post(`/books/favorite/insert`, { code: code, writer: sessionStorage.getItem("uid") });
            getBooks();
        }

    }

    //좋아요 삭제
    const onFavoriteDelete = async (code) => {
        await axios.post(`/books/favorite/delete`, { code: code, writer: sessionStorage.getItem("uid") });
        getBooks();
    }

    //검색
    const onSubmit = (e) => {
        e.preventDefault();
        getBooks();
    }

    useEffect(() => {
        getBooks();
    }, [sessionStorage.getItem("uid"), page])

    if (loading) return <LoadingPage />
    return (
        <Row className="justify-content-center my-5">
            <h1 className="my-3">Home</h1>
            <Col md={10}>
                <Row>
                    <Col>
                        <span>▶검색수: {total}</span>
                    </Col>
                    <Col md={3}>
                        <Form onSubmit={onSubmit}>
                            <InputGroup className="my-2">
                                <Form.Control palceholder="검색어" value={query} onChange={(e) => setQuery(e.target.value)}></Form.Control>
                                <InputGroup.Text>🔍</InputGroup.Text>
                            </InputGroup>
                        </Form>
                    </Col>

                </Row>
                <Row className="my-2">
                    {books.map(book => (
                        <Col md={3} xs={6} key={book.code}>
                            <Card className="text-center">
                                <Card.Body>
                                    <img src={`/images/books/${book.image}`} width="80%" className="my-2"></img>
                                    <div className="ellipsis" >[{book.code}] {book.title}</div>
                                    <hr />
                                    <div className="text-start">가격: {book.fmtPrice}원</div>
                                    <div className="text-start">저자: {book.author}</div>
                                </Card.Body>
                                <Card.Footer className="text-start" style={{ fontSize: '0.8rem' }}>
                                    <span>조회수:{book.viewcnt} | 리뷰수:{book.rcnt} | 좋아요: {book.fcnt}
                                        <span style={{ float: "right" }}>
                                            {book.ucnt == 0 ?
                                                <span style={{ color: "red", cursor: 'pointer' }} onClick={() => onFavoriteInsert(book.code)}>♡</span>
                                                :
                                                <span style={{ color: "red", cursor: 'pointer' }} onClick={() => onFavoriteDelete(book.code)}> ♥</span>
                                            }
                                        </span>
                                    </span>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>

            </Col>
            <Pagination
                activePage={page}
                itemsCountPerPage={4}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={(e) => setPage(e)} />
        </Row >
    )
}

export default Homepage