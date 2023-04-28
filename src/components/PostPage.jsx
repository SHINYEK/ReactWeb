import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Button } from 'react-bootstrap'
import Pagination from 'react-js-pagination'
import { Link } from 'react-router-dom';
import LoadingPage from './LoadingPage';


const PostPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const getPost = async () => {
        setLoading(true);
        const result = await axios.get(`/post/list.json?page=${page}&size=5`);
        console.log(result.data);
        const result1 = await axios.get('/post/total');
        setPosts(result.data);
        setTotal(result1.data);
        setTimeout(() => setLoading(false), 300);
    }

    useEffect(() => {
        getPost();
    }, [page])
    if (loading) {
        return <LoadingPage />
    }
    return (
        <Row>
            <Col className="text-center my-5">
                <h1>게시글</h1>
                <Row>
                    <Col className="text-start my-2">
                        <span>게시글수: {total}건</span>
                    </Col>
                    <Col className="text-end">
                        {sessionStorage.getItem("uid") && <Link to="/post/insert"><Button className="btb-sm my-2">글쓰기</Button></Link>}
                    </Col>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <td>ID.</td>
                            <td>제목</td>
                            <td>작성자</td>
                            <td>작성일</td>
                            <td>조회수</td>
                            <td>댓글수</td>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td><Link to={`/post/read/${post.id}`}>{post.title}</Link></td>
                                <td>{post.writer}</td>
                                <td>{post.fmtDate}</td>
                                <td>{post.viewcnt}</td>
                                <td>{post.ccnt}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination
                    activePage={page}
                    itemsCountPerPage={5}
                    totalItemsCount={total}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(e) => setPage(e)} />
            </Col>
        </Row>
    )
}

export default PostPage